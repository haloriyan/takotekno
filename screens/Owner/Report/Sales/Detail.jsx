import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, COLORS, Dialog, Inline, Text } from "ripal-ui";
import useUser from "../../../../hooks/useUser";
import axios from "axios";
import config from "../../../../config";
import { Ionicons } from "@expo/vector-icons";
import Currency from "../../../../lib/Currency";
import dayjs from "dayjs";
import PaymentStatus from "../../../../components/PaymentStatus";
import { useToast } from "react-native-toast-notifications";

const OwnerReportSalesDetail = ({ navigation, route }) => {
    const [sales, setSales] = useState(route.params.sales);
    const [user] = useUser();
    const [isLoading, setLoading] = useState(false);
    const [status, setStatus] = useState(sales.payment_status);
    const toast = useToast();

    const load = async () => {
        if (isLoading) return;
        setLoading(true);

        try {
            const response = await axios.get(`${config.base_url}/api/store/report/sales/${sales.id}/detail`, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
            setSales(res.sales);
        } catch (err) {
            console.error(err);
            
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user !== null) {
            load();
        }
    }, [user]);

    const [isCancelling, setCancelling] = useState(false);
    const [isCancellingProc, setCancellingProc] = useState(false);
    const [isAccepting, setAccepting] = useState(false);
    const [isAcceptingProc, setAcceptingProc] = useState(false);

    const acceptOrder = async () => {
        if (isAcceptingProc) return;

        setAcceptingProc(true);
        try {
            const response = await axios.post(`${config.base_url}/api/store/sales/${sales.invoice_number}/accept`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            toast.show(res.message, {
                type: "success"
            });
            setAccepting(false);
            setStatus('PAID');
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setAcceptingProc(false);
        }
    }
    const cancelOrder = async () => {
        if (isCancellingProc) return;

        setCancellingProc(true);
        try {
            const response = await axios.post(`${config.base_url}/api/store/sales/${sales.invoice_number}/cancel`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            toast.show(res.message, {
                type: "success"
            });
            setCancelling(false);
            setStatus('CANCELLED');
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setCancellingProc(false);
        }
    }

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <Inline>
                    <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '700',flexGrow: 1,flexBasis: 10 }}>#{sales.invoice_number}</Text>
                    <PaymentStatus status={status} />
                </Inline>
                <View />
                <Inline>
                    <View style={{ flexBasis: 10, flexGrow: 1, flexShrink: 1, gap: 4}}>
                        <Text size={11}>Customer</Text>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{sales.customer.name}</Text>
                    </View>
                    <View style={{ flexBasis: 10, flexGrow: 1, flexShrink: 1, gap: 4}}>
                        <Text size={11}>Staff</Text>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{sales.user.name}</Text>
                    </View>
                    <View style={{ flexBasis: 10, flexGrow: 1, flexShrink: 1, gap: 4}}>
                        <Ionicons name="time-outline" size={11} />
                        <Text size={11}>{dayjs(sales.created_at).format('DD MMMM YYYY, HH:mm:ss')}</Text>
                    </View>
                </Inline>

                <View /><View /><View />
                <Inline gap={10}>
                    <Ionicons name="person-outline" size={18} color={COLORS.slate[500]} />
                    <Text size={12}>{sales.customer.name}</Text>
                </Inline>
                <Inline gap={10}>
                    <Ionicons name="cash-outline" size={18} color={COLORS.slate[500]} />
                    <Text size={12}>{Currency(sales.total_price).encode()}</Text>
                </Inline>
                <Inline gap={10}>
                    <Ionicons name="time-outline" size={18} color={COLORS.slate[500]} />
                    <Text size={12}>{dayjs(sales.created_at).format('DD MMMM YYYY, HH:mm:ss')}</Text>
                </Inline>

                <View /><View />
                { sales?.items &&
                    <View style={{ gap: 10 }}>
                        <Text size={11}>Item(s)</Text>
                        { sales.items.map((item, i) => {
                            if (!item.is_composition) {
                                return (
                                    <Inline key={i}>
                                        <View style={styles.image}>
                                            { item.product.images.length == 0 ? 
                                                <Ionicons name="image-outline" size={24} color={COLORS.slate[700]} /> 
                                            : 
                                                <Image
                                                    style={styles.image}
                                                    source={{ uri: `${config.base_url}/storage/${item.product.store_id}/product_images/${item.product.id}/${item.product.images[0].filename}` }}
                                                />
                                            }
                                        </View>
                                        <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 10,gap: 5 }}>
                                            <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{item.product.name}</Text>
                                            <Text size={12}>
                                                {Currency(item.price).encode()} x {item.quantity} pc(s)
                                            </Text>
                                        </View>
                                        <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{Currency(item.total_price).encode()}</Text>
                                    </Inline>
                                )
                            }
                        })}
                    </View>
                }
                <View style={{ height: 80, backgroundColor: "#fff" }} />
            </ScrollView>
            { status === 'PENDING' &&
                <Inline style={styles.bottom} justifyContent={'flex-end'} gap={10}>
                    <Button color={COLORS.red[500]} onPress={() => {
                        // cancelOrder();
                        setCancelling(true);
                    }}>Batalkan</Button>
                    <Button color={COLORS.green[500]} onPress={() => {
                        // setStatus('PAID');
                        setAccepting(true);
                    }}>Terima Pembayaran</Button>
                </Inline>
            }

            { isCancelling &&
                <Dialog visible={isCancelling} onClose={() => setCancelling(false)}>
                    <Dialog.Title>Batalkan Pesanan</Dialog.Title>
                    <Dialog.Body>
                        <Text>Yakin ingin membatalkan pesanan {sales.invoice_number}?</Text>
                    </Dialog.Body>
                    <Dialog.Actions>
                        <Button color={COLORS.red[500]} onPress={cancelOrder}>{isCancellingProc ? <ActivityIndicator color={'#fff'} size={12} /> : 'Batalkan'}</Button>
                    </Dialog.Actions>
                </Dialog>
            }
            { isAccepting &&
                <Dialog visible={isAccepting} onClose={() => setAccepting(false)}>
                    <Dialog.Title>Terima Pembayaran</Dialog.Title>
                    <Dialog.Body>
                        <Text>Konfirmasi pembayaran untuk pesanan {sales.invoice_number}?</Text>
                    </Dialog.Body>
                    <Dialog.Actions>
                        <Button color={COLORS.green[500]} onPress={acceptOrder}>{isAcceptingProc ? <ActivityIndicator color={'#fff'} size={12} /> : 'Terima'}</Button>
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
        gap: 10,
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#eee"
    },
    bottom: {
        backgroundColor: "#fff",
        padding: 20,
    }
});

export default OwnerReportSalesDetail;