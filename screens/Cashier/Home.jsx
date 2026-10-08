import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import { Button, COLORS, Dialog, Inline, Text } from "ripal-ui";
import { Dimensions, Image, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import DatePicker from "@react-native-community/datetimepicker";
import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import axios from "axios";
import config from "../../config";
import Grid from "@haloriyan/grid";
import Currency from "../../lib/Currency";

const CashierHome = ({ navigation, route }) => {
    const [user] = useUser();
    const pickerDefaultStyles = useDefaultStyles();
    
    const [showCalendar, setShowCalendar] = useState(false);
    const [tempDate, setTempDate] = useState(dayjs());
    const [date, setDate] = useState(dayjs());
    const [omset, setOmset] = useState(0);
    const [margin, setMargin] = useState(0);
    const [volume, setVolume] = useState(0);
    const [sales, setSales] = useState([]);
    const [raw, setRaw] = useState(null);
    const [page, setPage] = useState(1);
    const [isLoading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [hasCheckedOut, setHasCheckedOut] = useState(false);

    const presenceCheck = async () => {
        try {
            const response = await axios.get(`${config.base_url}/api/store/schedule/${dayjs().format('YYYY-MM-DD')}/check`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            setHasCheckedIn(res.has_checked_in);
            setHasCheckedOut(res.has_checked_out);
            
        } catch (err) {
            console.error(err);
        }
    }

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            setSales([]);
            setRaw(null);

            const response = await axios.get(`${config.base_url}/api/store/report/sales?start_date=${date.format('YYYY-MM-DD')}&end_date=${date.format('YYYY-MM-DD')}&page=${page}&user_id=${user?.id}`, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;

            setSales(prev => [...prev, ...res.sales.data]);
            setRaw(res.sales);
            setOmset(res.omset);
            setMargin(res.margin);
            setVolume(res.volume);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user !== null && isFocused) {
            load();
            presenceCheck();
        }
    }, [date, user, isFocused]);

    if (user == null) return null;

    return (
        <React.Fragment>
            <Inline style={styles.header} gap={15}>
                { user.access.store.icon !== null ?
                    <Image
                        source={{ uri: `${config.base_url}/storage/store_icons/${user.access.store.icon}` }}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 99,
                        }}
                    />
                    :
                    <Button circle>
                        <Ionicons name="storefront-outline" color={'#fff'} size={16} />
                    </Button>
                }

                <Pressable style={{ flexGrow: 1,flexShrink: 1,flexBasis: 100, gap: 2 }} onPress={() => {
                    navigation.navigate('CashierStoreSelector');
                }}>
                    <Inline gap={5}>
                        <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{user.name}</Text>
                        <Ionicons name="chevron-down-outline" size={14} />
                    </Inline>
                    <Text size={12}>{user.access.store.name}</Text>
                </Pressable>

                <View style={{ flexGrow: 1 }} />
                <Button circle color={COLORS.red[100]} style={{ borderRadius: 8 }} onPress={() => {
                    navigation.replace('AuthNavigator', {
                        screen: "Logout"
                    });
                }}>
                    <Ionicons name="log-out-outline" size={18} color={COLORS.red[500]} />
                </Button>
            </Inline>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    load();
                }} />
            } nestedScrollEnabled={true}>
                <Inline style={{ padding: 20 }}>
                    <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '700' }}>Laporan</Text>
                    <View style={{ flexGrow: 1 }} />
                    <Inline gap={5} onPress={() => setShowCalendar(true)}>
                        <Text size={12} style={{ fontWeight: '600' }} color={COLORS.primary}>
                            { date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') ?
                                'Hari Ini'
                            :
                                date.format('DD MMMM YYYY')
                            }
                        </Text>
                        <Ionicons name="chevron-down-outline" color={COLORS.primary} />
                    </Inline>
                </Inline>
                
                <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20 }}>
                        <View />
                        <Inline style={{
                            ...styles.card,
                            backgroundColor: COLORS.blue[500],
                        }} gap={20}>
                            <Button circle color={"#ffffff40"} size={42}>
                                <Ionicons name="cash-outline" color={'#ffffff'} size={20} />
                            </Button>
                            <View style={{ gap: 5,flexBasis: 10,flexGrow: 1,flexShrink: 1 }}>
                                <Text size={12} color="#fff" style={{ fontWeight: '600' }}>Omset</Text>
                                <Text size={20} color="#fff" style={{ fontWeight: '800' }}>{Currency(omset).encode()}</Text>
                            </View>
                        </Inline>
                        <Inline style={{
                            ...styles.card,
                            backgroundColor: COLORS.green[500],
                        }} gap={20}>
                            <View style={{ gap: 5,flexBasis: 10,flexGrow: 1,flexShrink: 1 }}>
                                <Text size={12} color="#fff" style={{ fontWeight: '600' }}>Volume Transaksi</Text>
                                <Text size={20} color="#fff" style={{ fontWeight: '800' }}>{volume[0]?.count ?? 0}</Text>
                            </View>
                            <Button circle color={"#ffffff40"} size={42}>
                                <Ionicons name="bar-chart-outline" color={'#ffffff'} size={20} />
                            </Button>
                        </Inline>
                        <View />
                    </ScrollView>
                </View>

                <View style={{ padding: 20 }}>
                    <Inline gap={5}>
                        <Ionicons name="time-outline" color={COLORS.slate[500]} size={16} />
                        <Text size={11}>Penjualan Terbaru</Text>
                    </Inline>
                    <View style={{ marginTop: 20,gap: 20}}>
                        { sales.map((sale, s) => (
                            <Inline key={s} style={styles.item} alignItems="flex-start" onPress={() => {
                                navigation.navigate('CashierSalesDetail', {
                                    sales: sale,
                                });
                            }}>
                                <View style={{ gap: 5,flexBasis: 10,flexGrow: 1,flexShrink: 1 }}>
                                    <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{sale.invoice_number}</Text>
                                    <View />
                                    <Inline gap={10}>
                                        <Ionicons name="cash-outline" color={COLORS.slate[500]} />
                                        <Text size={12} color={COLORS.slate[500]} style={{ fontWeight: '500' }}>{Currency(sale.total_price).encode()}</Text>
                                    </Inline>
                                    <Inline gap={10}>
                                        <Ionicons name="person-outline" color={COLORS.slate[500]} />
                                        <Text size={12} color={COLORS.slate[500]} style={{ fontWeight: '500' }}>{sale.customer.name}</Text>
                                    </Inline>
                                </View>
                                <Text size={11} color={COLORS.slate[400]} style={{ marginTop: 5 }}>
                                    {dayjs(sale.created_at).fromNow()}
                                </Text>
                            </Inline>
                        ))}
                    </View>

                    { raw?.next_page_url !== null &&
                        <Button accent="secondary" style={{ width: '100%', marginTop: 30 }} onPress={() => {
                            setPage(prev => prev + 1);
                        }}>
                            Lainnya
                        </Button>
                    }

                    <View style={{ height: 80 }} />
                </View>
            </ScrollView>

            <Inline style={styles.bottom} justifyContent={'flex-end'} gap={10}>
                { !hasCheckedIn ?
                    <Button style={{ gap: 10 }} color={COLORS.green[500]} onPress={() => {
                        navigation.navigate('Presence');
                    }}>
                        <Ionicons name="time-outline" color={'#fff'} size={18} />
                        <Text size={12} color="#fff" style={{ fontWeight: '600' }}>Absen Masuk</Text>
                    </Button>
                    :
                    <>
                    { !hasCheckedOut &&
                        <Button style={{ gap: 10 }} color={COLORS.green[500]} onPress={() => {
                            navigation.navigate('Presence');
                        }}>
                            <Ionicons name="time-outline" color={'#fff'} size={18} />
                            <Text size={12} color="#fff" style={{ fontWeight: '600' }}>Absen Pulang</Text>
                        </Button>
                    }
                    </>
                }
                <Button style={{ gap: 10 }}>
                    <Ionicons name="add-outline" color={'#fff'} size={18} />
                    <Text size={12} color="#fff" style={{ fontWeight: '600' }}>Pesanan Baru</Text>
                </Button>
            </Inline>

            { showCalendar &&
                <Dialog visible={showCalendar} onClose={() => {
                    setShowCalendar(false);
                    setPage(1);
                    load();
                }}>
                    <Dialog.Title>Pilih Tanggal Laporan</Dialog.Title>
                    <Dialog.Body>
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
                            setDate(tempDate);
                            setShowCalendar(false);
                            setPage(1);
                            load();
                        }}>Pilih</Button>
                    </Dialog.Actions>
                </Dialog>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        padding: 15,
        paddingHorizontal: 20,
        paddingTop: 65,
    },
    container: {
        flexGrow: 1,
        // gap: 20,
        backgroundColor: "#fff",
    },
    card: {
        padding: 24,
        borderRadius: 12,
        minWidth: 60 / 100 * Dimensions.get('screen').width,
        gap: 10,
    },
    item: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#ddd",
        shadowOffset: { width: 1,height: 1},
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    bottom: {
        position: 'absolute',
        bottom: 20,left: 0,right: 0,
        padding: 20,
    }
});

export default CashierHome;