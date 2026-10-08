import { Ionicons } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import * as Location from "expo-location";

const AppPermissions = ({ navigation, route }) => {
	const [cameraPerm, reqCameraPerm] = useCameraPermissions();
	const [locPerm, setLocPerm] = useState(null);
	const [mediaPerm, setMediaPerm] = useState(null);

	useEffect(() => {
		(async () => {
			const location = await Location.getForegroundPermissionsAsync();
			setLocPerm(location.granted);

			const media = await ImagePicker.getMediaLibraryPermissionsAsync();
			setMediaPerm(media.granted);
		})();
	}, []);

	const requestLocation = async () => {
		try {
			const perm = await Location.requestForegroundPermissionsAsync();

			setLocPerm(perm.granted);

			if (!perm.granted) {
				Alert.alert(
					"Gagal",
					"Mohon aktifkan izin lokasi pada perangkat"
				);
			}
		} catch (error) {
			console.error(error);

			Alert.alert(
				"Gagal",
				"Terjadi kesalahan saat meminta izin lokasi"
			);
		}
	};

	const requestMedia = async () => {
		try {
			const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();

			setMediaPerm(perm.granted);

			if (!perm.granted) {
				Alert.alert(
					"Gagal",
					"Mohon aktifkan izin foto dan media pada perangkat"
				);
			}
		} catch (error) {
			console.error(error);

			Alert.alert(
				"Gagal",
				"Terjadi kesalahan saat meminta izin foto dan media"
			);
		}
	};

	return (
		<React.Fragment>
			<ScrollView contentContainerStyle={styles.container}>
				{/* Camera */}
				<Inline gap={15}>
					<View
						style={[
							styles.icon,
							cameraPerm?.granted ? styles.icon_active : null,
						]}
					>
						<Ionicons
							name="camera-outline"
							size={18}
							color={
								cameraPerm?.granted
									? COLORS.green[500]
									: COLORS.slate[400]
							}
						/>
					</View>

					<View style={styles.content}>
						<Text
							color={COLORS.slate[800]}
							style={{ fontWeight: "600" }}
						>
							Kamera
						</Text>

						<Text size={11}>
							Diperlukan untuk mengambil foto menggunakan kamera
						</Text>
					</View>

					{cameraPerm?.granted ? (
						<Ionicons
							name="checkmark-outline"
							size={24}
							color={COLORS.green[500]}
						/>
					) : (
						<Button onPress={reqCameraPerm}>Izinkan</Button>
					)}
				</Inline>

				{/* Location */}
				<Inline gap={15}>
					<View
						style={[
							styles.icon,
							locPerm ? styles.icon_active : null,
						]}
					>
						<Ionicons
							name="location-outline"
							size={18}
							color={
								locPerm
									? COLORS.green[500]
									: COLORS.slate[400]
							}
						/>
					</View>

					<View style={styles.content}>
						<Text
							color={COLORS.slate[800]}
							style={{ fontWeight: "600" }}
						>
							Lokasi
						</Text>

						<Text size={11}>
							Diperlukan untuk mendapatkan lokasi perangkat
						</Text>
					</View>

					{locPerm ? (
						<Ionicons
							name="checkmark-outline"
							size={24}
							color={COLORS.green[500]}
						/>
					) : (
						<Button onPress={requestLocation}>Izinkan</Button>
					)}
				</Inline>

				{/* Photos / Media Library */}
				<Inline gap={15}>
					<View
						style={[
							styles.icon,
							mediaPerm ? styles.icon_active : null,
						]}
					>
						<Ionicons
							name="images-outline"
							size={18}
							color={
								mediaPerm
									? COLORS.green[500]
									: COLORS.slate[400]
							}
						/>
					</View>

					<View style={styles.content}>
						<Text
							color={COLORS.slate[800]}
							style={{ fontWeight: "600" }}
						>
							Foto & Media
						</Text>

						<Text size={11}>
							Diperlukan untuk memilih foto dari galeri perangkat
						</Text>
					</View>

					{mediaPerm ? (
						<Ionicons
							name="checkmark-outline"
							size={24}
							color={COLORS.green[500]}
						/>
					) : (
						<Button onPress={requestMedia}>Izinkan</Button>
					)}
				</Inline>
			</ScrollView>
		</React.Fragment>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		flexGrow: 1,
		backgroundColor: "#fff",
		gap: 20,
	},
	icon: {
		width: 48,
		aspectRatio: 1,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: COLORS.slate[300],
	},
	icon_active: {
		borderColor: COLORS.green[500],
	},
	content: {
		flexBasis: 10,
		flexGrow: 1,
		flexShrink: 1,
		gap: 5,
	},
});

export default AppPermissions;