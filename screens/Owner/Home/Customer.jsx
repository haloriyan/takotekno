import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import config from "../../../config";
import dayjs from "dayjs";
import axios from "axios";
import Currency from "../../../lib/Currency";
import { useNavigation } from "@react-navigation/native";
import Initial from "../../../lib/Initial";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import StateView from "../../../components/StateView";

const OwnerHomeCustomer = ({ user }) => {
    const navigation = useNavigation();
    const [customers, setCustomers] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [raw, setRaw] = useState(null);

    const load = async () => {
        if (isLoading) return;
        setLoading(true);

        try {
            console.log("Page : ", page);
            
            const response = await axios.get(`${config.base_url}/api/user/home/customer?page=${page}`, {
                headers: { Authorization: `Bearer ${user?.token}`}
            });
            let res = response.data;
            
            setCustomers(res.customers.data);
            setRaw(res.customers);
            
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
            
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user !== null) {
            load();
        }
    }, [user, page]);

    return (
        <View style={{ gap: 10 }}>
            { customers.length === 0 &&
                <>
                <View style={{ height: 40 }} />
                <StateView 
                    title={'Belum ada penjualan hari ini.'}
                    icon={<Ionicons name="people-outline" size={64} color={COLORS.primary} />}
                    action={
                        <Button onPress={() => navigation.navigate('POSNavigator')}>Buat Pesanan</Button>
                    }
                />
                </>
            }
            { customers.map((cust, c) => (
                <Inline key={c} gap={15}>
                    <Button circle color={COLORS.primary} size={48}>
                        <Text color="#fff" style={{ fontWeight: '800' }}>{Initial(cust.name)}</Text>
                    </Button>
                    <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 100,gap: 5}}>
                        <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{cust.name}</Text>
                        <Inline gap={5}>
                            <Ionicons name="cash-outline" color={COLORS.slate[500]} />
                            <Text size={11}>{Currency(cust.sales[0].total_price).encode()}</Text>
                        </Inline>
                    </View>
                    <Text size={10} style={{ fontWeight: '300' }}>{dayjs(cust.sales[0].created_at).fromNow()}</Text>
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

export default OwnerHomeCustomer;