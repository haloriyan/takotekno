import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, COLORS, Inline, Text } from "ripal-ui";

const Welcome = ({navigation, route}) => {
    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <SafeAreaView edges={['top']} style={{ gap: 30, flexGrow: 1 }}>
                    <Inline gap={10}>
                        <Image source={require('../../assets/icon.png')} style={styles.icon} />
                        <Text size={18} style={{fontWeight: '700'}} color={COLORS.slate[800]}>Takotoko</Text>
                    </Inline>

                    <Image source={require('../../assets/login.jpg')} style={styles.illus} />

                    <View style={{gap: 10}}>
                        <Text size={20} style={{fontWeight: '700'}} color={COLORS.slate[800]} align={'center'}>Jualan Tak Pernah Semudah Ini.</Text>
                        <Text align={'center'} color={COLORS.slate[500]}>Catat penjualan, lacak stok, hingga cari tahu jam ramai.</Text>
                    </View>

                    <View style={{flexGrow: 1}} />

                    <View style={{ gap: 15 }}>
                        <Button style={{flexGrow: 1,height: 50}} onPress={() => navigation.navigate('Login')}>Mulai Jualan</Button>
                    </View>

                    <View style={{ padding: 20,paddingTop: 0,paddingBottom: 35 }}>
                        <Text size={11} color={COLORS.slate[400]}>Dengan login atau mendaftar Anda setuju dan patuh terhadap Syarat dan Ketentuan Kami.</Text>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    icon: {
        width: 48,
        height: 48,
        borderRadius: 12,
    },
    illus: {
        width: Dimensions.get('screen').width - 40,
        height: Dimensions.get('screen').width - 40,
        borderRadius: 20,
    }
})

export default Welcome