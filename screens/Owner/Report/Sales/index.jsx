import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Text, Toggle } from "ripal-ui";
import Currency from "../../../../lib/Currency";
import axios from "axios";
import config from "../../../../config";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import { BarChart, LineChart, ChartKitProvider, createChartPreset } from "react-native-chart-kit/v2";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useDebounce } from "use-debounce";
import StateView from "../../../../components/StateView";
import PaymentStatus from "../../../../components/PaymentStatus";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import Slug from "../../../../lib/Slug";

dayjs.extend(relativeTime);
dayjs.locale('id');

const OwnerReportSales = ({ 
    user, startDate, endDate, 
    setOnReload, setOnDownload, q, onReload,
    isLoading, setLoading,
    showSalesFilter, setShowSalesFilter, salesFilters
}) => {
    const [sales, setSales] = useState([]);
    const [raw, setRaw] = useState(null);
    const [page, setPage] = useState(1);
    const [omset, setOmset] = useState(0);
    const [margin, setMargin] = useState(0);
    const [volume, setVolume] = useState([]);
    const [omsetChart, setOmsetChart] = useState([]);
    const [marginChart, setMarginChart] = useState([]);
    const isFocused = useIsFocused();

    const navigation = useNavigation();
    const [viewingChart, setViewingChart] = useState({key: "volume", label: "Volume Transaksi"});

    const defaultChartPreset = createChartPreset({
        default: {
            background: "#fff",
            series: [COLORS.primary],
        },
        omset: {
            background: "#fff",
            series: [COLORS.primary],
            grid: "#eeeeee"
        }
    });

    const downloadReport = async () => {
        const timestamp = dayjs().format('DD_MMMM_YYYY_HH:mm:ss');
        const filename = "Laporan_Penjualan_" + Slug(user.access.store.name, '_') + "-Exported_at_" + timestamp + ".xlsx";
        const fileUri = FileSystem.cacheDirectory + filename;
        let endpoint = `${config.base_url}/api/store/report/sales/export?` +
            `q=${encodeURIComponent(q)}` +
            `&start_date=${startDate.format('YYYY-MM-DD')}` +
            `&end_date=${endDate.format('YYYY-MM-DD')}` +
            `&payment_method=${salesFilters.paymentMethod?.key ?? 'null'}` +
            `&payment_status=${salesFilters.paymentStatus?.key ?? 'null'}`;

        let download = await FileSystem.downloadAsync(endpoint, fileUri, {
            headers: { Authorization: `Bearer ${user.token}` }
        });

        if (download.status >= 200 && download.status < 300) {
            await Sharing.shareAsync(fileUri);
        }
    }

    useEffect(() => {
        setOnReload(
            () => 
                () => {
                    setPage(1);
                    load();
                }
        );
        setOnDownload(
            () => 
                () => {
                    downloadReport();
                }
        );
    }, [user, startDate, endDate, q, salesFilters]);

    const [search] = useDebounce(q, 1000);

    useEffect(() => {
        setPage(1);
        load();
    }, [search]);

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            let theSales = [...sales];
            
            if (page === 1) {
                // setSales([]);
                theSales = [];
                setRaw(null);
            }

            let endpoint =  config.base_url + "/api/store/report/sales?" +
                            `q=${q}` +
                            `&start_date=${startDate.format('YYYY-MM-DD')}` +
                            `&end_date=${endDate.format('YYYY-MM-DD')}` +
                            `&payment_method=${salesFilters.paymentMethod.key}` +
                            `&payment_status=${salesFilters.paymentStatus.key}` +
                            `&page=${page}`;

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
            
            theSales = [...theSales, ...res.sales.data];
            setRaw(res.sales);
            setOmset(res.omset);
            setMargin(res.margin);
            setVolume(res.volume);
            setOmsetChart(res.omset_chart);
            setMarginChart(res.margin_chart);
            setSales(theSales);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user !== null && isFocused) {
            setSales([]);
            load();
        }
    }, [startDate, endDate, user, page, isFocused]);

    return (
        <View style={{ marginTop: 20, gap: 20}}>
            <ScrollView contentContainerStyle={{ gap: 20 }} style horizontal showsHorizontalScrollIndicator={false}>
                <View />
                <View style={styles.card}>
                    <View style={styles.card_title}>
                        <Inline gap={10}>
                            <Ionicons name="bar-chart-outline" size={16} color={COLORS.blue[500]} />
                            <Text size={12} color={COLORS.slate[800]}>Omset</Text>
                        </Inline>
                    </View>
                    <View style={styles.card_content}>
                        <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '800' }}>{Currency(omset).encode()}</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <View style={styles.card_title}>
                        <Inline gap={10}>
                            <Ionicons name="cash-outline" size={16} color={COLORS.green[500]} />
                            <Text size={12} color={COLORS.slate[800]}>Keuntungan</Text>
                        </Inline>
                    </View>
                    <View style={styles.card_content}>
                        <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '800' }}>{Currency(margin).encode()}</Text>
                    </View>
                </View>
                <View />
            </ScrollView>
            <View />

            <View style={{ paddingHorizontal: 20 }}>
                <Toggle
                    options={[
                        {key: "volume", label: "Volume Transaksi"},
                        {key: "omset", label: "Omset"},
                        {key: "margin", label: "Keuntungan"},
                    ]}
                    objectKey={'label'}
                    value={viewingChart} setValue={setViewingChart}
                />
            </View>

            {volume.length > 0 && (
                <View style={styles.chart_container}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    { viewingChart.key === 'volume' &&
                            <ChartKitProvider presets={defaultChartPreset} preset={"default"}>
                            <LineChart
                                data={volume} xKey="date" yKey="count"
                                series={[
                                    {
                                        yKey: "count",
                                        label: "Volume",
                                        strokeWidth: 1,
                                        dot: {
                                            strokeWidth: 1.5
                                        },
                                    }
                                ]}
                                width={Dimensions.get('screen').width}
                                height={220}
                                tooltip={true}
                                interaction={{
                                    mode: "tap",
                                }}
                            />
                        </ChartKitProvider>
                    }
                    { viewingChart.key === 'omset' &&
                        <ChartKitProvider presets={defaultChartPreset} preset={"default"}>
                            <LineChart
                                data={omsetChart} xKey="date" yKey="revenue"
                                series={[
                                    {
                                        yKey: "revenue",
                                        label: "Omset",
                                        strokeWidth: 1,
                                        dot: {
                                            strokeWidth: 1.5
                                        },
                                    }
                                ]}
                                width={Dimensions.get('screen').width}
                                height={220}
                                tooltip={true}
                                interaction={{ mode: "tap" }}
                            />
                        </ChartKitProvider>
                    }
                    { viewingChart.key === "margin" &&
                        <ChartKitProvider presets={defaultChartPreset} preset={"default"}>
                            <LineChart
                                data={marginChart} xKey="date" yKey="margin"
                                series={[
                                    {
                                        yKey: "margin",
                                        label: "Untung",
                                        strokeWidth: 1,
                                        dot: {
                                            strokeWidth: 1.5
                                        },
                                    }
                                ]}
                                width={Dimensions.get('screen').width}
                                height={220}
                                tooltip={true}
                                interaction={{ mode: "tap" }}
                            />
                        </ChartKitProvider>
                    }
                    </ScrollView>
                </View>
            )}

            <View style={{ padding: 20, paddingTop: 0, gap: 20 }}>
                <Inline>
                    <Text size={16} color={COLORS.slate[800]} style={{ fontWeight: '700' }}>Transaksi Penjualan</Text>
                    <View style={{ flexGrow: 1 }} />
                    <View>
                        <Button circle color="#fff" style={[styles.shadow]} onPress={() => {
                            setShowSalesFilter(true);
                        }} size={42}>
                            <Ionicons name="filter" size={18} color={COLORS.primary} />
                        </Button>

                        { (salesFilters.paymentMethod?.key !== null || salesFilters.paymentStatus?.key !== null) &&
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: -4,right: 4,
                                    width: 12,height: 12,
                                    backgroundColor: COLORS.primary,
                                    borderRadius: 12,
                                }}
                            />
                        }
                    </View>
                </Inline>
                { sales.length === 0 &&
                    <>
                    <View /><View />
                    <StateView
                        icon={
                            <Ionicons name="bag-outline" size={48} color={COLORS.primary} />
                        }
                        title={'Tidak ada data'}
                        body={'Coba ubah filter pencarian.'}
                    />
                    </>
                }
                { sales.map((sale, s) => {
                    let paymentMethod = config.enums.PAYMENT_METHODS.find(item => item.key === sale.payment_method);
                    let paymentStatus = config.enums.PAYMENT_STATUSES.find(item => item.key === sale.payment_status);
                    return (
                        <TouchableOpacity key={s} style={[styles.item, styles.shadow]} onPress={() => {
                            navigation.navigate('OwnerReportSalesDetail', {
                                sales: sale,
                            })
                        }}>
                            <Inline>
                                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{sale.invoice_number}</Text>
                                <View style={{ flexGrow: 1 }} />
                                <PaymentStatus status={sale.payment_status} textProps={{ size: 12 }} />
                            </Inline>
                            <View style={{ gap: 10,marginTop: 15 }}>
                                <Inline gap={10}>
                                    <Ionicons name={paymentMethod?.icon} color={COLORS.slate[500]} size={18} />
                                    <View style={{ flexGrow: 1,flexBasis: 10,flexShrink: 1,gap: 2 }}>
                                        <Text size={11} color={COLORS.primary} style={{ fontWeight: '400' }}>{paymentMethod?.label}</Text>
                                        <Text size={12} color={COLORS.slate[500]} style={{ fontWeight: '500' }}>{Currency(sale.total_price).encode()}</Text>
                                    </View>
                                </Inline>
                                <Inline gap={10}>
                                    <Ionicons name="person-outline" color={COLORS.slate[500]} size={18} />
                                    <Text size={12} color={COLORS.slate[500]} style={{ fontWeight: '500' }}>{sale.customer.name}</Text>
                                </Inline>
                                <Inline gap={10}>
                                    <Ionicons name="time-outline" color={COLORS.slate[500]} size={18} />
                                    <Text size={12} color={COLORS.slate[500]} style={{ fontWeight: '500' }}>
                                        {dayjs().diff(dayjs(sale.created_at), 'minutes') > 60 ?
                                            dayjs(sale.created_at).format('DD MMM YYYY, HH:mm')
                                            :
                                            dayjs(sale.created_at).fromNow()
                                        }
                                    </Text>
                                </Inline>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>

            { raw?.next_page_url !== null &&
                <View style={{ padding: 20,paddingTop: 9 }}>
                    <Button accent="secondary" style={{ width: '100%' }} onPress={() => {
                        setPage(prev => page + 1);
                    }}>Lainnya</Button>
                </View>
            }

            <View style={{ height: 80 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        minWidth: 55 / 100 * Dimensions.get('screen').width,
        maxWidth: 55 / 100 * Dimensions.get('screen').width,
    },
    card_title: {
        padding: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    },
    card_content: {
        padding: 20,
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1,height: 1},
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    item: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
    },
    chart_container: {
        paddingHorizontal: 20,
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
});

export default OwnerReportSales;