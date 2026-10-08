import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, ProgressBar, Text } from "ripal-ui";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Currency from "../../../../../lib/Currency";

const MovementItem = ({ item }) => {
    const LABEL_COLOR =
    item.movement.type === "IN"
        ? COLORS.green[500]
        : item.movement.type === "OUT"
            ? COLORS.red[500]
            : COLORS.slate[400];

    return (
        <Inline style={[styles.item, styles.shadow]}>
            <View style={{ flexShrink: 1,flexBasis: 100,flexGrow: 1, gap: 10}}>
                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>#{item.movement.label}</Text>
                <Inline gap={5}>
                    <Ionicons name="cube-outline" size={16} />
                    <Text size={11}>Jumlah : {item.quantity} pcs</Text>
                </Inline>
            </View>
            <View style={{
                ...styles.label,
                backgroundColor: `${LABEL_COLOR}20`
            }}>
                <Text color={LABEL_COLOR} style={{ fontWeight: '600' }}>
                    { item.movement.type.toUpperCase() }
                </Text>
            </View>
        </Inline>
    )
}

const StockView = ({ product, user }) => {
    const [stocks, setStocks] = useState(product.stocks);
    const navigation = useNavigation();

    return (
        <React.Fragment>
            <Inline>
                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Stok Tersedia</Text>
                <View style={{ flexGrow: 1 }} />
                <Text>{product.quantity} pc(s)</Text>
            </Inline>
            <View style={{ gap: 10 }}>
                { stocks.map((sto, s) => (
                    <View key={s} style={[styles.item, styles.shadow]}>
                        <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{sto.label}</Text>
                        <Inline gap={10}>
                            <Ionicons name="cash-outline" size={16} />
                            <Text size={12}>Harga beli</Text>
                            <Text size={12} color={COLORS.slate[700]} style={{ fontWeight: '500' }}>{Currency(sto.cost_price).encode()}</Text>
                        </Inline>
                        <View />
                        <ProgressBar
                            value={sto.start_quantity - sto.quantity}
                            from={sto.start_quantity}
                            displayValue={false}
                            height={10}
                        />
                        <Inline justifyContent={'flex-end'}>
                            <Text size={11}>{sto.start_quantity - sto.quantity} dari {sto.start_quantity}</Text>
                        </Inline>
                    </View>
                ))}
            </View>

            <Button style={{ width: '100%' }} onPress={() => {
                navigation.navigate('OwnerProductStockAdd', {
                    product,
                });
            }}>Tambah Stok</Button>

            <View /><View />

            <Inline>
                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Pergerakan Stok</Text>
                <View style={{ flexGrow: 1 }} />
                <TouchableOpacity>
                    <Text color={COLORS.primary}>Lainnya</Text>
                </TouchableOpacity>
            </Inline>

            <View style={{ gap: 10 }}>
                { product.stock_movements.map((item, i) => (
                    <MovementItem key={i} item={item} />
                ))}
            </View>

            <View /><View />
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#ddd',
        shadowOffset: { width: 1, height: 1},
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    item: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#fff",
        gap: 10,
    },
    label: {
        padding: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    }
});

export default StockView;