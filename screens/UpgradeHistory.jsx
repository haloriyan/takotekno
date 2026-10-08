import React, { useEffect, useState } from "react";
import { Linking, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, COLORS, Dialog, Inline, Text } from "ripal-ui";
import useUser from "../hooks/useUser";
import axios from "axios";
import config from "../config";
import dayjs from "dayjs";
import Currency from "../lib/Currency";

const UpgradeHistory = ({ navigation, route }) => {
    const [user] = useUser();

    const [isLoading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [raw, setRaw] = useState(null);

    const [transaction, setTransaction] = useState(null);

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            const response = await axios.get(`${config.base_url}/api/store/plan/history`, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;

            setRaw(res.transactions);
            setTransactions(prev => [...prev, ...res.transactions.data]);
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
    }, [user]);

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={async () => {
                    setRaw(null);
                    setTransactions([]);
                    load();
                }} />
            }>
                { transactions.map((trx, t) => (
                    <Inline key={t} style={styles.item} alignItems="flex-start" onPress={() => setTransaction(trx)}>
                        <View style={{ flexBasis: 10,flexGrow: 1, gap: 6 }}>
                            <Text size={11}>Paket</Text>
                            <Text size={12} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{trx.plan.toUpperCase()}</Text>
                        </View>
                        <View style={{ flexBasis: 10,flexGrow: 1, gap: 6 }}>
                            <Text size={11}>Aktif hingga</Text>
                            <Text size={12} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{dayjs(trx.expired_at).format('DD MMM YYYY HH:mm')}</Text>
                        </View>
                        <View style={{ flexBasis: 10,flexGrow: 1, gap: 6 }}>
                            <Text size={11}>Status</Text>
                            <Text size={12} color={trx.payment_status === "PAID" ? COLORS.green[500] : COLORS.yellow[500]} style={{ fontWeight: '600' }}>{trx.payment_status}</Text>
                        </View>
                    </Inline>
                ))}
            </ScrollView>

            { transaction !== null &&
            <Dialog visible={transaction !== null} onClose={() => setTransaction(null)}>
                <Dialog.Title>Detail</Dialog.Title>
                <Dialog.Body>
                    <Inline>
                        <Text size={11}>ID Transaksi</Text>
                        <View style={{ flexGrow: 1 }} />
                        <Text style={{ fontWeight: '500' }} color={COLORS.slate[800]}>#{transaction.id}</Text>
                    </Inline>
                    <Inline>
                        <Text size={11}>Jumlah</Text>
                        <View style={{ flexGrow: 1 }} />
                        <Text style={{ fontWeight: '500' }} color={COLORS.slate[800]}>{transaction.quantity} bulan</Text>
                    </Inline>
                    <Inline>
                        <Text size={11}>Berlaku hingga</Text>
                        <View style={{ flexGrow: 1 }} />
                        <Text style={{ fontWeight: '500' }} color={COLORS.slate[800]}>{dayjs(transaction.expired_at).format('DD MMMM YYYY, HH:mm:ss')}</Text>
                    </Inline>
                    <Inline>
                        <Text size={11}>Nominal Pembayaran</Text>
                        <View style={{ flexGrow: 1 }} />
                        <Text style={{ fontWeight: '500' }} color={COLORS.slate[800]}>{Currency(transaction.payment_amount).encode()}</Text>
                    </Inline>
                    <Inline>
                        <Text size={11}>Status Pembayaran</Text>
                        <View style={{ flexGrow: 1 }} />
                        <Text style={{ fontWeight: '500' }} color={transaction.payment_status === "PAID" ? COLORS.green[500] : COLORS.yellow[500]}>{transaction.payment_status}</Text>
                    </Inline>
                </Dialog.Body>
                <Dialog.Actions>
                    <Button color={COLORS.slate[300]} onPress={() => setTransaction(null)}>
                        <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Tutup</Text>
                    </Button>
                    <Button color={COLORS.green[500]} onPress={() => {
                        Linking.openURL('https://wa.me/6285159772902');
                    }}>
                        <Text color={'#fff'} style={{ fontWeight: '600' }}>Bantuan</Text>
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
        gap: 20,
    },
    item: {
        backgroundColor: "#fff",
        elevation: 3,
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1},
        shadowOpacity: 0.7,
        shadowRadius: 10,
        padding: 20,
        borderRadius: 12,
    }
});

export default UpgradeHistory;