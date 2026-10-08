import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";

const OnboardingWelcome = ({ setStep }) => {
    return (
        <>
            <Text size={32} style={{fontWeight: '800'}} color={COLORS.slate[800]}>Bukan POS yang bikin kamu makin ribet, tapi</Text>

            <View />

            <Inline>
                <View style={{...styles.icon_box, backgroundColor: COLORS.red[500]}}>
                    <Ionicons name="scan-outline" color={'#fff'} size={42} />
                </View>
                <View style={{ flexGrow: 1, gap: 6, flexBasis: 32, flexShrink: 1 }}>
                    <Text size={18} style={{fontWeight: '700'}} color={COLORS.slate[700]}>Catat jualan tanpa ngetik atau melototin list produk.</Text>
                    <Text>Jepret produk di depanmu dan sistem yang akan mencari.</Text>
                </View>
            </Inline>
            <Inline>
                <View style={{...styles.icon_box, backgroundColor: COLORS.green[500]}}>
                    <Ionicons name="cash-outline" color={'#fff'} size={42} />
                </View>
                <View style={{ flexGrow: 1, gap: 6, flexBasis: 32, flexShrink: 1 }}>
                    <Text size={18} style={{fontWeight: '700'}} color={COLORS.slate[700]}>Nunjukin hari ini kamu untung berapa.</Text>
                    <Text>Marginmu akan langsung kelihatan setelah mencatat pembelian.</Text>
                </View>
            </Inline>
            <Inline>
                <View style={{...styles.icon_box, backgroundColor: COLORS.blue[500]}}>
                    <Ionicons name="cube-outline" color={'#fff'} size={42} />
                </View>
                <View style={{ flexGrow: 1, gap: 6, flexBasis: 32, flexShrink: 1 }}>
                    <Text size={18} style={{fontWeight: '700'}} color={COLORS.slate[700]}>Bantu tau nanti harus restok apa.</Text>
                    <Text>Catat keluar - masuk produk stokmu, termasuk bahan atau bumbu.</Text>
                </View>
            </Inline>
            <Inline>
                <View style={{...styles.icon_box, backgroundColor: COLORS.amber[500]}}>
                    <Ionicons name="time-outline" color={'#fff'} size={42} />
                </View>
                <View style={{ flexGrow: 1, gap: 6, flexBasis: 32, flexShrink: 1 }}>
                    <Text size={18} style={{fontWeight: '700'}} color={COLORS.slate[700]}>Paham kapan jam paling ramai.</Text>
                    <Text>Siapkan stok dan tim lebih pas biar nggak keteteran.</Text>
                </View>
            </Inline>

            <View />

            <View style={styles.action_area}>
                <Button style={{flexGrow: 1, height: 52}} onPress={() => setStep('store')
                }>Mulai</Button>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    icon_box: {
        width: '20%',
        aspectRatio: 1/1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    action_area: {
        position: 'absolute',
        bottom: 30,left: 20,right: 20,
    }
})

export default OnboardingWelcome