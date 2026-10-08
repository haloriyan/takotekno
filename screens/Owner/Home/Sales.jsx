import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import config from "../../../config";
import dayjs from "dayjs";
import axios from "axios";
import Currency from "../../../lib/Currency";
import { useNavigation } from "@react-navigation/native";
import StateView from "../../../components/StateView";

const OwnerHomeSales = ({ user }) => {
    const navigation = useNavigation();
    const [sales, setSales] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [raw, setRaw] = useState(null);

    const loadSales = async () => {
        if (isLoading) return;
        setLoading(true);

        try {
            console.log("Page : ", page);
            
            const response = await axios.get(`${config.base_url}/api/user/home/sales?page=${page}`, {
                headers: { Authorization: `Bearer ${user?.token}`}
            });
            let res = response.data;
            
            setSales(res.sales.data);
            setRaw(res.sales);
            
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
            
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user !== null) {
            loadSales();
        }
    }, [user, page]);

    return (
        <View style={{ gap: 10 }}>
            { sales.length === 0 &&
                <>
                <View style={{ height: 40 }} />
                <StateView 
                    title={'Belum ada penjualan hari ini.'}
                    icon={<Ionicons name="cube-outline" size={64} color={COLORS.primary} />}
                    action={
                        <Button onPress={() => navigation.navigate('POSNavigator')}>Buat Pesanan</Button>
                    }
                />
                </>
            }
            { sales.map((sale, s) => (
                <Inline key={s} alignItems="flex-start" style={[styles.item, styles.shadow]} onPress={() => {
                    navigation.navigate('ReportNavigator', {
                        screen: "OwnerReport",
                        params: {
                            navigateTo: {
                                screen: "OwnerReportSalesDetail",
                                params: {
                                    sales: sale
                                }
                            }
                        }
                    });
                }}>
                    <View style={{ gap: 5,flexGrow: 1,flexShrink: 1,flexBasis: 100 }}>
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
            <View />
            <Inline justifyContent={'flex-end'} gap={10}>
                <Button circle accent="secondary" style={{ opacity: raw?.prev_page_url ? 1 : 0 }} onPress={() => {
                    if (raw?.prev_page_url !== null) {
                        setPage(prev => prev - 1);
                    }
                }}>
                    <MaterialIcons name="west" color={COLORS.primary} />
                </Button>
                <Button circle accent="secondary" style={{ opacity: raw?.next_page_url ? 1 : 0 }} onPress={() => {
                    if (raw?.next_page_url !== null) {
                        setPage(prev => prev + 1);
                    }
                }}>
                    <MaterialIcons name="east" color={COLORS.primary} />
                </Button>
            </Inline>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1,height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
});

export default OwnerHomeSales;