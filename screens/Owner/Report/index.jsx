import React, { useState, useEffect } from "react";
import { RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, COLORS, Dialog, Inline, Text } from "ripal-ui";
import OwnerReportSales from "./Sales";
import dayjs from "dayjs";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import useUser from "../../../hooks/useUser";
import OwnerReportMovement from "./Movement";
import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import config from "../../../config";
import OwnerReportPresence from "./Presence";
import FilterDialog from "./Sales/FilterDialog";

const OwnerReport = ({ navigation, route }) => {
    const [user] = useUser();
    const [viewing, setViewing] = useState('sales');
    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'days'));
    const [endDate, setEndDate] = useState(dayjs());
    const [tempStartDate, setTempStartDate] = useState(dayjs().subtract(7, 'days'));
    const [tempEndDate, setTempEndDate] = useState(dayjs());
    const [showCalendar, setShowCalendar] = useState(false);
    const pickerDefaultStyles = useDefaultStyles();
    const [scroll, setScroll] = useState(0);

    const [showSalesFilter, setShowSalesFilter] = useState(false);

    const [salesFilters, setSalesFilters] = useState({
        paymentStatus: config.enums.PAYMENT_STATUSES[0],
        paymentMethod: config.enums.PAYMENT_METHODS[0]
    });

    const [q, setQ] = useState('');

    useEffect(() => {
        if (route?.params?.navigateTo) {
            const nav = route.params.navigateTo;
            if (nav?.screen) {
                navigation.navigate(nav.screen, nav.params);
            }
            // clear the param so it doesn't re-trigger when coming back
            try {
                navigation.setParams({ navigateTo: undefined });
            } catch (e) {}
        }
    }, [route?.params?.navigateTo]);

    const downloadReport = async () => {
        try {
            if (viewing === "sales") {
                const response = await axios.get(`${config.base_url}/api/store/report/sales?q=${q}&start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}&payment_method=${salesFilters.paymentMethod}&payment_status=${salesFilters.paymentStatus}&download=1`, {
                    headers: { Authorization: `Bearer ${user.token}`}
                });
                let res = response.data;
                
            }
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        }
    }

    const [isLoading, setLoading] = useState(false);
    const [onReload, setOnReload] = useState(null);
    const [onDownload, setOnDownload] = useState(null);

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} scrollEventThrottle={16} onScroll={e => {
                setScroll(e.nativeEvent.contentOffset.y);
            }} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={async () => {
                    if (onReload !== null) {
                        await onReload();
                    }
                }} />
            }>
                <SafeAreaView edges={['top']} style={{ padding: 20,paddingBottom: 15 }}>
                    <Text size={28} color={COLORS.slate[800]} style={{ fontWeight: '700' }}>Laporan</Text>
                </SafeAreaView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 34 }} contentContainerStyle={{ gap: 10 }}>
                    <View /><View />
                    <TouchableOpacity onPress={() => setViewing('sales')} style={[styles.chip, viewing === 'sales' ? styles.chip_active : null]}>
                        <Text size={12} color={viewing === 'sales' ? COLORS.primary : COLORS.slate[500]} style={{ fontWeight: viewing === 'sales' ? '600' : '400' }}>Penjualan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewing('movement')} style={[styles.chip, viewing === 'movement' ? styles.chip_active : null]}>
                        <Text size={12} color={viewing === 'movement' ? COLORS.primary : COLORS.slate[500]} style={{ fontWeight: viewing === 'movement' ? '600' : '400' }}>Pergerakan Stok</Text>
                    </TouchableOpacity>
                    { user?.access?.store?.plan?.absensi &&
                        <TouchableOpacity onPress={() => setViewing('presence')} style={[styles.chip, viewing === 'presence' ? styles.chip_active : null]}>
                            <Text size={12} color={viewing === 'presence' ? COLORS.primary : COLORS.slate[500]} style={{ fontWeight: viewing === 'presence' ? '600' : '400' }}>Absensi</Text>
                        </TouchableOpacity>
                    }
                    <View /><View />
                </ScrollView>

                { viewing === 'sales' &&
                    <OwnerReportSales
                        user={user} q={q}
                        startDate={startDate} endDate={endDate}
                        isLoading={isLoading} setLoading={setLoading}
                        setOnReload={setOnReload} onReload={onReload}
                        setOnDownload={setOnDownload}
                        showSalesFilter={showSalesFilter} setShowSalesFilter={setShowSalesFilter} salesFilters={salesFilters}
                    />
                }
                { viewing === 'movement' &&
                    <OwnerReportMovement
                        user={user}
                        startDate={startDate} endDate={endDate}
                        isLoading={isLoading} setLoading={setLoading}
                        setOnReload={setOnReload}
                        setOnDownload={setOnDownload}
                        q={q} setQ={setQ}
                    />
                }
                { viewing === 'presence' &&
                    <OwnerReportPresence
                        user={user}
                        startDate={startDate} endDate={endDate}
                        isLoading={isLoading} setLoading={setLoading}
                        setOnReload={setOnReload}
                    />
                }
            </ScrollView>

            <Inline style={{...styles.bottom, ...styles.shadow}}>
                <View style={{ flexBasis: 10, flexGrow: 1, gap: 4 }}>
                    <Text size={11} color={COLORS.slate[500]}>Tanggal</Text>
                    <Text style={{ fontWeight: '600' }}>{startDate.format('DD MMM')} - {endDate.format('DD MMM YYYY')}</Text>
                </View>
                <Button accent="tertiary" onPress={() => {
                    setShowCalendar(true);
                }}>Ubah</Button>
            </Inline>

            { showCalendar && 
                <Dialog visible={showCalendar} onClose={() => setShowCalendar(false)}>
                    <Dialog.Title>Rentang Tanggal</Dialog.Title>
                    <Dialog.Body>
                        <DateTimePicker
                            styles={{
                                ...pickerDefaultStyles,
                                selected: {
                                    backgroundColor: COLORS.primary,
                                }
                            }}
                            mode="range"
                            startDate={tempStartDate}
                            endDate={tempEndDate}
                            onChange={({startDate, endDate}) => {
                                setTempStartDate(dayjs(startDate));
                                setTempEndDate(dayjs(endDate));
                            }}
                        />
                    </Dialog.Body>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setStartDate(tempStartDate);
                            setEndDate(tempEndDate);
                            setShowCalendar(false);
                        }}>Selesai</Button>
                    </Dialog.Actions>
                </Dialog>
            }

            { scroll > 150 &&
                <Inline style={[styles.header, styles.shadow]} gap={10}>
                    <Ionicons name="search-outline" size={20} color={COLORS.slate[500]} />
                    <TextInput style={styles.header_search} value={q} placeholder="Cari" onChangeText={e => {
                        setQ(e);
                    }} />
                    <Button color={COLORS.green[500]} style={{
                        marginVertical: 10,
                        padding: 0,
                        height: 38, gap: 10
                    }} onPress={() => {
                        onDownload();
                    }}>
                        <Feather name="download" color={'#fff'} />
                        <Text size={12} color="#fff" style={{ fontWeight: '700' }}>Unduh</Text>
                    </Button>
                </Inline>
            }

            { showSalesFilter &&
                <FilterDialog 
                    visible={showSalesFilter} setVisible={setShowSalesFilter}
                    filters={salesFilters} setFilters={setSalesFilters}
                    onReload={onReload}
                />
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    chip: {
        backgroundColor: "#fff",
        padding: 6,
        paddingHorizontal: 15,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: 'center',
        justifyContent: 'center'
    },
    chip_active: {
        borderColor: COLORS.primary,
    },
    bottom: {
        position: 'absolute',
        bottom: 20,left: 20,right: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 999,
        paddingLeft: 30,
        paddingRight: 15,
    },
    shadow: {
        elevation: 8,
        shadowColor: '#ddd',
        shadowOffset: { width: 1, height: 1, },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    header: {
        position: 'absolute',
        top: 60,left: 20,right: 20,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        borderRadius: 9999,
    },
    header_search: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 100,
        height: 48
    }
});

export default OwnerReport;