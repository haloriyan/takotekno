import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import useUser from "../../../../hooks/useUser";
import { ActivityIndicator, Alert, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, COLORS, Dialog, Inline, Input, Text } from "ripal-ui";
import Grid from "@haloriyan/grid";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import config from "../../../../config";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const OwnerMoreScheduleCreate = ({ navigation, route }) => {
	const initialDate = dayjs(route.params.date);

	const [date, setDate] = useState(initialDate);
	const [tempDate, setTempDate] = useState(initialDate);
	const [showCalendar, setShowCalendar] = useState(false);

	const [showTimePicker, setShowTimePicker] = useState(false);
	const [timePickerType, setTimePickerType] = useState(null);
	const [tempTime, setTempTime] = useState(null);

	const [user] = useUser();

	const [isAddingProc, setAddingProc] = useState(false);

	const [label, setLabel] = useState(
		`${initialDate.format('DD MMMM YYYY')} - `
	);

	const [inTime, setInTime] = useState(
		initialDate
			.hour(9)
			.minute(0)
			.second(0)
			.millisecond(0)
	);

	const [outTime, setOutTime] = useState(
		initialDate
			.hour(17)
			.minute(0)
			.second(0)
			.millisecond(0)
	);

	const [q, setQ] = useState('');
	const [users, setUsers] = useState([]);
	const [userIDs, setUserIDs] = useState([]);
	const [results, setResults] = useState([]);

	const [canSubmit, setCanSubmit] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);


	/*
	 * Keep the date portion of Masuk and Pulang synchronized
	 * when the main schedule date is changed.
	 *
	 * The time itself is preserved.
	 */
	useEffect(() => {
		setLabel(`${date.format('DD MMMM YYYY')} - `);

		setInTime(prev => {
			return date
				.hour(prev.hour())
				.minute(prev.minute())
				.second(0)
				.millisecond(0);
		});

		setOutTime(prev => {
			const newOut = date
				.hour(prev.hour())
				.minute(prev.minute())
				.second(0)
				.millisecond(0);

			const currentIn = date
				.hour(inTime.hour())
				.minute(inTime.minute())
				.second(0)
				.millisecond(0);

			/*
			 * If changing the schedule date causes Pulang
			 * to become before Masuk, move Pulang to the
			 * following day.
			 */
			return newOut.isBefore(currentIn)
				? newOut.add(1, 'day')
				: newOut;
		});
	}, [date]);


	/*
	 * Create a date using the date from baseDate and
	 * the time from pickerDate.
	 */
	const makeTime = (baseDate, pickerDate) => {
		return dayjs(baseDate)
			.hour(dayjs(pickerDate).hour())
			.minute(dayjs(pickerDate).minute())
			.second(0)
			.millisecond(0);
	};


	/*
	 * Open the time/date picker.
	 */
	const openTimePicker = type => {
		const currentTime = type === 'in'
			? inTime
			: outTime;

		setTimePickerType(type);
		setTempTime(currentTime);
		setShowTimePicker(true);
	};


	/*
	 * Handle the temporary picker value.
	 *
	 * We don't immediately modify inTime/outTime here.
	 * The actual value is committed only after pressing "Pilih".
	 */
	const handleTimePickerChange = (event, selectedDate) => {
		if (!selectedDate) {
			return;
		}

		setTempTime(dayjs(selectedDate));
	};


	/*
	 * Commit the selected time.
	 */
	const confirmTimePicker = () => {
		if (!tempTime || !timePickerType) {
			return;
		}

		if (timePickerType === 'in') {
			const newInTime = tempTime;

			setInTime(newInTime);

			/*
			 * Masuk is now after Pulang.
			 *
			 * Automatically move Pulang one hour after Masuk
			 * so the schedule remains valid.
			 */
			if (newInTime.isAfter(outTime)) {
				setOutTime(
					newInTime
						.add(1, 'hour')
						.second(0)
						.millisecond(0)
				);
			}
		} else {
			/*
			 * Extra safety check.
			 *
			 * The native picker already receives minimumDate,
			 * but we still validate here before committing.
			 */
			if (tempTime.isBefore(inTime)) {
				Alert.alert(
					'Waktu tidak valid',
					'Waktu pulang tidak boleh sebelum waktu masuk.'
				);
				return;
			}

			setOutTime(tempTime);
		}

		setShowTimePicker(false);
		setTimePickerType(null);
		setTempTime(null);
	};


	const search = async () => {
		try {
			const response = await axios.get(
				`${config.base_url}/api/store/schedule/${date.format('YYYY-MM-DD')}/search?q=${encodeURIComponent(q)}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			const res = response.data;

			setResults(res.employees);
		} catch (err) {
			console.error(err);
		}
	};


	const debounceSearch = useDebouncedCallback(() => {
		search();
	}, 1500);


	const submit = useCallback(async () => {
		if (isSubmitting) {
			return;
		}

		/*
		 * Final validation before submitting.
		 *
		 * This makes sure the backend is never intentionally
		 * sent an invalid time range.
		 */
		if (outTime.isBefore(inTime)) {
			Alert.alert(
				'Waktu tidak valid',
				'Waktu pulang tidak boleh sebelum waktu masuk.'
			);
			return;
		}

		setSubmitting(true);

		try {
			const response = await axios.post(
				`${config.base_url}/api/store/schedule/${date.format('YYYY-MM-DD')}/store`,
				{
					user_ids: userIDs,
					label,
					check_in_time: inTime.format('YYYY-MM-DD HH:mm:ss'),
					check_out_time: outTime.format('YYYY-MM-DD HH:mm:ss'),
				},
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			const res = response.data;

			Alert.alert(
				'Berhasil',
				res.message,
				[
					{
						text: 'Kembali',
						onPress: () => navigation.goBack(),
					},
				]
			);
		} catch (err) {
			console.error(err);

			Alert.alert(
				'Gagal',
				'Terjadi kesalahan saat menyimpan jadwal.'
			);
		} finally {
			setSubmitting(false);
		}
	}, [
		isSubmitting,
		inTime,
		outTime,
		date,
		userIDs,
		label,
		user,
		navigation,
	]);


	useEffect(() => {
		if (label !== '' && users.length > 0) {
			setCanSubmit(true);
		} else {
			setCanSubmit(false);
		}
	}, [users, label]);


	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button
					circle
					onPress={submit}
					style={{
						opacity: canSubmit ? 1 : 0.4,
					}}
				>
					{isSubmitting ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Ionicons
							name="checkmark"
							color="#fff"
							size={20}
						/>
					)}
				</Button>
			),
		});
	}, [
		navigation,
		canSubmit,
		isSubmitting,
		submit,
	]);


	return (
		<React.Fragment>
			<ScrollView contentContainerStyle={styles.container}>

				{/* Tanggal */}
				<Inline>
					<View
						style={{
							gap: 5,
							flexGrow: 1,
							flexShrink: 1,
							flexBasis: 20,
						}}
					>
						<Text
							color={COLORS.slate[800]}
							style={{ fontWeight: '600' }}
						>
							Tanggal
						</Text>

						<Text>
							{date.format('DD MMMM YYYY')}
						</Text>
					</View>

					<Button
						accent="secondary"
						onPress={() => {
							setTempDate(date);
							setShowCalendar(true);
						}}
					>
						Ubah
					</Button>
				</Inline>


				{/* Label */}
				<View style={{ gap: 10 }}>
					<Input
						label="Label"
						value={label}
						onChangeText={e => setLabel(e)}
					/>

					<Text size={11}>
						Contoh : 16 Juli 2026 - Shift Pagi
					</Text>
				</View>


				{/* Waktu */}
				<View style={{ gap: 15 }}>

					{/* Masuk */}
					<Inline>
						<View
							style={{
								flexBasis: 10,
								flexGrow: 1,
								flexShrink: 1,
								gap: 5,
							}}
						>
							<Text
								color={COLORS.slate[800]}
								style={{ fontWeight: '600' }}
							>
								Masuk
							</Text>

							<Text>
								{inTime.format('DD MMMM, HH:mm')}
							</Text>
						</View>

						<Button
							accent="tertiary"
							onPress={() => openTimePicker('in')}
						>
							Ubah
						</Button>
					</Inline>


					{/* Pulang */}
					<Inline>
						<View
							style={{
								flexBasis: 10,
								flexGrow: 1,
								flexShrink: 1,
								gap: 5,
							}}
						>
							<Text
								color={COLORS.slate[800]}
								style={{ fontWeight: '600' }}
							>
								Pulang
							</Text>

							<Text>
								{outTime.format('DD MMMM, HH:mm')}
							</Text>
						</View>

						<Button
							accent="tertiary"
							onPress={() => openTimePicker('out')}
						>
							Ubah
						</Button>
					</Inline>

				</View>


				{/* Search employee */}
				<View style={{ gap: 15 }}>
					<Inline
						style={styles.search}
						gap={0}
					>
						<Button
							circle
							accent="tertiary"
						>
							<Ionicons
								name="search-outline"
								size={18}
								color={COLORS.slate[500]}
							/>
						</Button>

						<TextInput
							style={styles.search_input}
							value={q}
							onChangeText={e => {
								setQ(e);
								debounceSearch();
							}}
							placeholder="Cari karyawan untuk ditambahkan"
						/>

						{q !== '' && (
							<Button
								circle
								accent="tertiary"
								onPress={() => {
									setQ('');
									debounceSearch();
								}}
							>
								<Ionicons
									name="close-outline"
									size={18}
									color={COLORS.slate[500]}
								/>
							</Button>
						)}
					</Inline>


					<Inline gap={10}>
						{results.map((res, r) => {
							if (!userIDs.includes(res.user.id)) {
								return (
									<Inline
										key={r}
										style={styles.result_item}
										gap={5}
										onPress={() => {
											setUsers(prev => [
												...prev,
												res,
											]);

											setUserIDs(prev => [
												...prev,
												res.user.id,
											]);
										}}
									>
										<Ionicons
											name="person-outline"
											color={COLORS.primary}
										/>

										<Text
											size={13}
											color={COLORS.primary}
										>
											{res.user.name}
										</Text>

										<Ionicons
											name="add-outline"
											color={COLORS.primary}
										/>
									</Inline>
								);
							}

							return null;
						})}
					</Inline>
				</View>


				{/* Selected employees */}
				<View style={{ gap: 15 }}>
					{users.map((member, m) => (
						<Inline
							gap={10}
							key={m}
						>
							<Button
								circle
								size={42}
								style={{ margin: 0 }}
							>
								<Ionicons
									name="person-outline"
									size={18}
									color="#fff"
								/>
							</Button>

							<View
								style={{
									flexGrow: 1,
									flexShrink: 1,
									flexBasis: 20,
									gap: 4,
								}}
							>
								<Text
									color={COLORS.slate[800]}
									style={{
										fontWeight: '600',
									}}
								>
									{member.user.name}
								</Text>

								<Text size={11}>
									{member.role.toUpperCase()}
								</Text>
							</View>

							<Button
								circle
								size={32}
								color={COLORS.red[100]}
								onPress={() => {
									const theUsers = [...users];
									const theUserIDs = [...userIDs];

									theUsers.splice(m, 1);
									theUserIDs.splice(m, 1);

									setUsers(theUsers);
									setUserIDs(theUserIDs);
								}}
							>
								<Ionicons
									name="remove"
									color={COLORS.red[500]}
									size={22}
								/>
							</Button>
						</Inline>
					))}
				</View>

			</ScrollView>


			{/* Calendar Dialog */}
			{showCalendar && (
				<Dialog
					visible
					onClose={() => setShowCalendar(false)}
				>
					<Dialog.Title>
						Pilih Tanggal
					</Dialog.Title>

					<Dialog.Body>
						<DateTimePicker
							value={tempDate.toDate()}
							onChange={(event, theDate) => {
								if (theDate) {
									setTempDate(dayjs(theDate));
								}
							}}
							mode="date"
							display="spinner"
						/>
					</Dialog.Body>

					<Dialog.Actions>
						<Button
							onPress={() => {
								setDate(tempDate);
								setShowCalendar(false);
							}}
						>
							Pilih
						</Button>
					</Dialog.Actions>
				</Dialog>
			)}


			{/* Masuk / Pulang Dialog */}
			{showTimePicker && tempTime && (
				<Dialog
					visible
					onClose={() => {
						setShowTimePicker(false);
						setTimePickerType(null);
						setTempTime(null);
					}}
				>
					<Dialog.Title>
						{timePickerType === 'in'
							? 'Ubah Waktu Masuk'
							: 'Ubah Waktu Pulang'}
					</Dialog.Title>

					<Dialog.Body>
						<DateTimePicker
							value={tempTime.toDate()}
							onChange={handleTimePickerChange}
							mode="datetime"
							display="spinner"

							/*
							 * This is the important constraint
							 * for Pulang.
							 *
							 * The iOS picker won't allow the user
							 * to select a date/time before Masuk.
							 */
							{...(timePickerType === 'out'
								? {
									minimumDate: inTime.toDate(),
								}
								: {})}
						/>
					</Dialog.Body>

					<Dialog.Actions>
						<Button
							onPress={confirmTimePicker}
						>
							Pilih
						</Button>
					</Dialog.Actions>
				</Dialog>
			)}

		</React.Fragment>
	);
};

const styles = StyleSheet.create({ 
    container: {
        backgroundColor: "#fff",
        padding: 20,
        gap: 30,
        flexGrow: 1,
    },
    search: {
        backgroundColor: COLORS.slate[100],
        borderRadius: 99,
        paddingHorizontal: 10,
    },
    search_input: {
        height: 48,
        flexGrow: 1,
    },
    result_item: {
        padding: 5,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 0.5,
        borderColor: COLORS.primary,
    }
})

export default OwnerMoreScheduleCreate;