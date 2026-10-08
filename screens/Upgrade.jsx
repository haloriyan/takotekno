import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, COLORS, Dialog, Inline, Text, Toggle } from "ripal-ui";
import Currency from "../lib/Currency";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import axios from "axios";
import config from "../config";
import useUser from "../hooks/useUser";
import dayjs from "dayjs";

const Yes = () => {
    return (
        <Button circle size={24} color={COLORS.green[500]}>
            <Entypo name="check" color={'#fff'} />
        </Button>
    )
}

const No = () => (
    <Button circle size={24} color={COLORS.slate[300]}>
        <Ionicons name="remove" color={COLORS.slate[800]} />
    </Button>
)

const Upgrade = ({ navigation, route }) => {
    const [user] = useUser();
    const [plan, setPlan] = useState({key: 'basic', label: "Basic"});
    const [plans, setPlans] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [isUpgrading, setUpgrading] = useState(false);
    const [isUpgradingProc, setUpgradingProc] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(`${config.base_url}/api/plan`);
                setPlans(response.data);
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    const upgrade = async () => {
        if (isUpgradingProc) return;
        setUpgradingProc(true);

        try {
            const response = await axios.post(`${config.base_url}/api/store/plan/purchase`, {
                quantity,
                plan: plan.key
            }, { headers: { Authorization: `Bearer ${user.token}`}});
            let res = response.data;

            setUpgrading(false);

            Alert.alert(
                `Berhasil meningkatkan ke ${plan.label}`,
                `Paket akun toko ${user.access.store.name} sekarang menjadi ${plan.label}`,
                [
                    {text: "Lihat Transaksi", onPress: () => {
                        navigation.navigate('UpgradeHistory');
                    }},
                    {text: "Kembali", onPress: () => {
                        navigation.goBack();
                    }, isPreferred: true, style: 'cancel'}
                ]
            )
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setUpgradingProc(false);
        }
    }

    if (!plans) return null;

    return (
        <React.Fragment>
            <SafeAreaView edges={['top']} style={styles.container}>
                <Inline>
                    <View style={{ gap: 10, flexBasis: 10,flexGrow: 1 }}>
                        <Text size={24} color={COLORS.slate[800]} style={{ fontWeight: '700' }}>Upgrade</Text>
                        <Text size={14} lineHeight={20}>Kembangkan bisnismu ke level yang belum pernah terbayangkan sebelumnya.</Text>
                    </View>
                    <Inline style={{paddingVertical: 10,paddingLeft: 10}} gap={6} onPress={() => {
                        navigation.navigate('UpgradeHistory');
                    }}>
                        <Ionicons name="time-outline" size={14} />
                        <Text size={11}>Riwayat</Text>
                    </Inline>
                </Inline>

                <Inline justifyContent={'center'}>
                    <Toggle
                        options={[
                            {key: 'basic', label: "Basic"},
                            {key: 'starter', label: "Starter"},
                            {key: 'pro', label: "PRO"},
                        ]}
                        value={plan} setValue={setPlan}
                        objectKey={'label'}
                    />
                </Inline>

                <View style={[styles.card, styles.shadow]}>
                    <Inline gap={30}>
                        <View style={{ gap: 5,flexShrink: 1,flexGrow: 1,flexBasis: 10 }}>
                            <Text size={18} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{plans[plan.key].label}</Text>
                            <Text size={11} lineHeight={16}>
                                {plan.key === 'basic' ? "Cocok untuk bisnis kecil yang baru memulai." : 
                                 plan.key === 'starter' ? "Tingkatkan efisiensi bisnismu dengan fitur tambahan." : 
                                 "Solusi lengkap untuk bisnis skala besar."}
                            </Text>
                        </View>

                        <Text size={20} color={COLORS.primary} style={{ fontWeight: '700' }}>
                            {Currency(plans[plan.key].price).encode()}
                        </Text>
                    </Inline>

                    <View style={styles.line} />

                    <Inline>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '500', flexGrow: 1 }}>
                            Jumlah Produk
                        </Text>
                        <Button circle color="#fff" size={24}>
                            {plans[plan.key].produk === 'Unlimited' ? 
                                <Ionicons name="infinite" size={18} color={COLORS.slate[700]} /> : 
                                <Text color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{plans[plan.key].produk}</Text>
                            }
                        </Button>
                    </Inline>
                    <Inline>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '500', flexGrow: 1 }}>
                            Transaksi per Hari
                        </Text>
                        <Button circle color="#fff" size={24}>
                            {plans[plan.key].transaksi === 'Unlimited' ? 
                                <Ionicons name="infinite" size={18} color={COLORS.slate[700]} /> : 
                                <Text color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{plans[plan.key].transaksi}</Text>
                            }
                        </Button>
                    </Inline>
                    <Inline>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '500', flexGrow: 1 }}>
                            Hak Akses Karyawan
                        </Text>
                        <Button circle color="#fff" size={24}>
                            {plans[plan.key].karyawan === 'Unlimited' ? 
                                <Ionicons name="infinite" size={18} color={COLORS.slate[700]} /> : 
                                <Text color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{plans[plan.key].karyawan}</Text>
                            }
                        </Button>
                    </Inline>
                    <Inline>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '500', flexGrow: 1 }}>
                            Unduh Laporan ke Excel
                        </Text>
                        {plans[plan.key].laporan ? <Yes /> : <No />}
                    </Inline>
                    <Inline>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '500', flexGrow: 1 }}>
                            Absensi Karyawan
                        </Text>
                        {plans[plan.key].absensi ? <Yes /> : <No />}
                    </Inline>
                    <Inline>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '500', flexGrow: 1 }}>
                            Scanner Produk & Tools AI
                        </Text>
                        {plans[plan.key].ai ? <Yes /> : <No />}
                    </Inline>
                    <Inline>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '500', flexGrow: 1 }}>
                            Cetak Struk
                        </Text>
                        {plans[plan.key].struk ? <Yes /> : <No />}
                    </Inline>
                </View>

                {plan.key !== "basic" &&
                    <Button style={{
                        width: '100%',
                        height: 48
                    }} onPress={() => setUpgrading(true)}>
                        { plan.key === user?.access?.store?.package ?
                            <Text color="#fff" style={{ fontWeight: '700' }}>Perpanjang Paket {plan.label}</Text>
                            :
                            <Text color="#fff" style={{ fontWeight: '700' }}>Ubah ke {plan.label}</Text>
                        }
                    </Button>
                }
            </SafeAreaView>

            <Dialog visible={isUpgrading} onClose={() => setUpgrading(false)}>
                <Dialog.Title>Upgrade Akun</Dialog.Title>
                <Dialog.Body>
                    <Text>Tingkatkan akun toko ke {plan.label} selama </Text>
                    <Inline>
                         <Button circle accent="secondary" style={{
                             opacity: quantity === 1 ? 0 : 1
                         }} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                             <Ionicons name="remove" color={COLORS.primary} size={20} />
                         </Button>
                        <Text size={14} style={{ flexGrow: 1,fontWeight: '600' }} align={'center'}>{quantity} bulan</Text>
                         <Button circle accent="secondary" style={{
                             // 
                         }} onPress={() => setQuantity(quantity + 1)}>
                             <Ionicons name="add" color={COLORS.primary} size={20} />
                         </Button>
                    </Inline>

                    { (
                        user?.access.store?.package !== plan.key &&
                        user?.access.store?.package !== "basic"
                    ) &&
                        <View style={styles.warning}>
                            <Text size={11} color="#fff" lineHeight={18}>Kamu masih memiliki paket {user?.access?.store?.package.toUpperCase()} yang akan kedaluwarsa pada {dayjs(user?.access?.store?.active_plan.expired_at).format('DD MMM YYYY, HH:mm')}. Melanjutkan tindakan ini dapat mengabaikannya setelah pembayaran terverifikasi.</Text>
                        </View>
                    }
                </Dialog.Body>
                <Dialog.Actions>
                    <Button onPress={upgrade}>
                        { isUpgradingProc ? <ActivityIndicator color={'#fff'} /> : 'Tingkatkan'}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20, 
        gap: 20,
        flexGrow: 1,
        backgroundColor: "#fff"
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1,height: 1},
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        gap: 15,
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: COLORS.slate[200],
        marginVertical: 15,
    },
    warning: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
    }
});

export default Upgrade;