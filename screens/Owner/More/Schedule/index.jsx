import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import DatePicker from '@react-native-community/datetimepicker';
import { Button, COLORS, Dialog, Inline, Input, Text } from "ripal-ui";
import config from "../../../../config";
import useUser from "../../../../hooks/useUser";
import Grid from "@haloriyan/grid";
import StateView from "../../../../components/StateView";
import { useIsFocused } from "@react-navigation/native";

const OwnerMoreSchedule = ({ navigation, route }) => {
    const [user] = useUser();
    const [date, setDate] = useState(dayjs());
    const [tempDate, setTempDate] = useState(dayjs());
    const [showCalendar, setShowCalendar] = useState(false);
    const pickerDefaultStyles = useDefaultStyles();
    const [isLoading, setLoading] = useState(false);
    const [canAbsen, setCanAbsen] = useState(true);
    const isFocused = useIsFocused();

    const [schedules, setSchedules] = useState([]);

    const [isAdding, setAdding] = useState(false);
    const [isAddingProc, setAddingProc] = useState(false);
    const [label, setLabel] = useState('');
    const [inTime, setInTime] = useState(dayjs("2026-07-16 09:00:00"));
    const [outTime, setOutTime] = useState(dayjs("2026-07-16 17:00:00"));

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            const response = await axios.get(`${config.base_url}/api/store/schedule/${date.format('YYYY-MM-DD')}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            setSchedules(res.schedules);
            setCanAbsen(res.can_absen);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setTempDate(date);
        setLabel(date.format('DD MMMM YYYY'));
        if (user !== null && isFocused) {
            load();
        }
    }, [date, user, isFocused]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                if (canAbsen) {
                    return (
                        <Button circle onPress={() => {
                            navigation.navigate('OwnerMoreScheduleCreate', {
                                date: date.format('YYYY-MM-DD')
                            });
                        }}>
                            <Ionicons name="add" color={'#fff'} size={20} />
                        </Button>
                    )
                } else {
                    return null
                }
            }
        });
    }, [navigation, date, canAbsen]);

    const submit = async () => {
        if (isAddingProc) return;

        setAddingProc(true);

        try {
            const response = await axios.post(`${config.base_url}/api/store/schedule/${date.format('YYYY-MM-DD')}/store`, {
                label,
                check_in_time: inTime.format('YYYY-MM-DD HH:mm:ss'),
                check_out_time: outTime.format('YYYY-MM-DD HH:mm:ss'),
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            setAdding(false);
            load();
        } catch (err) {
            console.error(err);
        } finally {
            setAddingProc(false);
        }
    }

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    load();
                }} />
            }>
                { !canAbsen &&
                    <StateView
                        icon={<Ionicons name="calendar-outline" size={48} color={COLORS.primary} />}
                        title={
                            "Tingkatkan ke STARTER atau PRO untuk membuat jadwal karyawan"
                        }
                        action={
                            <Button onPress={() => {
                                navigation.navigate('Upgrade')
                            }}>Upgrade</Button>
                        }
                    />
                }
                <View style={{ gap: 15 }}>
                    { schedules.map((sched, s) => (
                        <Inline key={s} style={[styles.item, styles.shadow]} onPress={() => {
                            navigation.navigate('OwnerMoreScheduleDetail', {
                                schedule: sched,
                            });
                        }}>
                            <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 20, gap: 5 }}>
                                <Text>{sched.label}</Text>
                                <View />
                                <Inline gap={5}>
                                    <Ionicons name="people-outline" size={14} />
                                    <Text size={12} color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{sched.users.length} anggota</Text>
                                </Inline>
                                <Inline gap={5}>
                                    <Ionicons name="time-outline" size={14} />
                                    <Text size={12} color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{dayjs(sched.check_in_time).format('HH:mm')}</Text>
                                </Inline>
                            </View>
                            <MaterialIcons name="east" size={20} />
                        </Inline>
                    )) }
                </View>
            </ScrollView>

            { canAbsen &&
                <Inline style={[styles.bottom, styles.shadow]}>
                    <Button circle accent="secondary" onPress={() => {
                        setDate(
                            date.subtract(1, 'days')
                        );
                    }}>
                        <MaterialIcons name="west" color={COLORS.primary} size={18} />
                    </Button>
                    <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 20, gap: 5,alignItems: 'center' }}>
                        <Inline gap={10} onPress={() => {
                            setShowCalendar(true);
                        }}>
                            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                            <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{date.format('DD MMMM YYYY')}</Text>
                        </Inline>
                    </View>
                    <Button circle accent="secondary" onPress={() => {
                        setDate(
                            date.add(1, 'days')
                        );
                    }}>
                        <MaterialIcons name="east" color={COLORS.primary} size={18} />
                    </Button>
                </Inline>
            }

            { showCalendar &&
                <Dialog visible onClose={() => setShowCalendar(false)}>
                    <Dialog.Title>Pilih Tanggal</Dialog.Title>
                    <Dialog.Body>
                        {/* <DateTimePicker
                            styles={{
                                ...pickerDefaultStyles,
                                selected: {
                                    backgroundColor: COLORS.primary,
                                }
                            }}
                            mode="single"
                            date={date}
                            onChange={theDate => {
                                let actualDate = dayjs(theDate.date);
                                setDate(actualDate);
                            }}
                        /> */}
                        <DatePicker
                            value={date.toDate()}
                            onValueChange={(e, theDate) => {
                                setTempDate(dayjs(theDate));
                            }}
                            mode="date"
                            display="spinner"
                        />
                    </Dialog.Body>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            // console.log(tempDate);
                            
                            setDate(tempDate);
                            setShowCalendar(false);
                        }}>Pilih</Button>
                    </Dialog.Actions>
                </Dialog>
            }

            { isAdding &&
                <Dialog visible={isAdding} onClose={() => setAdding(false)}>
                    <Dialog.Title>Buat Jadwal</Dialog.Title>
                    <Dialog.Body>
                        {/*  */}
                    </Dialog.Body>
                    <Dialog.Actions>
                        <Button onPress={submit}>
                            { isAddingProc ? <ActivityIndicator /> : 'Tambahkan'}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({ 
    container: {
        padding: 20,
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    shadow: {
        elevation: 3,
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
    },
    bottom: {
        position: 'absolute',
        bottom: 20,left: 20,right: 20,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 999,
    },
    item: {
        borderRadius: 8,
        padding: 20,
        backgroundColor: "#fff",
    }
});

export default OwnerMoreSchedule;