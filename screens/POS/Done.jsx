import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import { useNavigation } from "@react-navigation/native";
import { buildWALink } from "../../lib/WALink";
import useUser from "../../hooks/useUser";

const Done = ({ sales, setSales, setDone, setShowSummary, isPrinting, setPrinting }) => {
    const navigation = useNavigation();
    const [user] = useUser();

    return (
        <View style={styles.container}>
            { sales.payment_method === "CASH" &&
                <Button circle size={64} color={COLORS.green[500]}>
                    <Feather name="check" color={'#fff'} size={28} />
                </Button>
            }
            { sales.payment_method === "QRISC" &&
                <Image 
                    source={{uri: JSON.parse(sales.payment_payload).data.qr_url}}
                    style={{ 
                        width: 120,
                        height: 120,
                    }}
                />
            }
            <View /><View />
            <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Pesanan Dibuat!</Text>
            <Text align={'center'}>
                { sales.payment_method === 'CASH' &&
                    'Pesanan untuk {sales.customer.name} berhasil dibuat dengan nomor #{sales.invoice_number}.'
                }
                { sales.payment_method === "QRISC" &&
                    'Scan QRIS di atas untuk melakukan pembayaran.'
                }
            </Text>
            <View /><View />
            { user?.access?.role === "owner" &&
                <Inline style={styles.btn} onPress={() => {
                    // 
                }}>
                    <Ionicons name="document-text-outline" size={24} />
                    <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Lihat Detail</Text>
                    <View style={{ flexGrow: 1 }} />
                    <MaterialIcons name="east" size={18} />
                </Inline>
            }
            <Inline style={styles.btn} onPress={() => {
                console.log(sales);
                
                setPrinting(true);
            }}>
                <Ionicons name="print-outline" size={24} />
                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Cetak Struk</Text>
                <View style={{ flexGrow: 1 }} />
                <MaterialIcons name="east" size={18} />
            </Inline>
            { user &&
                <Inline style={styles.btn} onPress={() => {
                    buildWALink(sales, user);
                }}>
                    <Ionicons name="logo-whatsapp" size={24} />
                    <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Kirim Whatsapp</Text>
                    <View style={{ flexGrow: 1 }} />
                    <MaterialIcons name="east" size={18} />
                </Inline>
            }
            <Inline style={styles.btn} onPress={() => {
                setSales(null);
                setDone(false);
                setShowSummary(false);
            }}>
                <Ionicons name="add-outline" size={24} />
                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Pesanan Baru</Text>
                <View style={{ flexGrow: 1 }} />
                <MaterialIcons name="east" size={18} />
            </Inline>
            <View /><View />
            <Button accent="tertiary" onPress={() => {
                navigation.goBack();
            }}>
                Halaman Utama
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        gap: 10,
        paddingTop: 50,
    },
    btn: {
        width: '100%',
        padding: 15,
        paddingHorizontal: 20,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#ddd",
        marginVertical: 5
    }
});

export default Done;