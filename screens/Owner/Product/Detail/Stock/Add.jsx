import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Input, Text } from "ripal-ui";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Currency from "../../../../../lib/Currency";
import useUser from "../../../../../hooks/useUser";
import config from "../../../../../config";
import Slug from "../../../../../lib/Slug";

const OwnerProductStockAdd = ({ navigation, route }) => {
    const [user, setUser] = useUser();
    const [product, setProduct] = useState(route.params.product);
    const [quantity, setQuantity] = useState(10);
    const [price, setPrice] = useState(1000);
    const [label, setLabel] = useState(Slug(product.name) + '-' + dayjs().format('YYYYMMDDHHmmss'));
    const [canSubmit, setCanSubmit] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    const controlQty = action => {
        if (action === 'decrease') {
            if (quantity > 10) {
                setQuantity(prev => Math.ceil(prev) - 10);
            } else {
                setQuantity(1);
            }
        } else {
            setQuantity(prev => Math.ceil(prev) + 10);
        }
    }

    useEffect(() => {
        if (label !== "" && quantity > 0 && price > 0) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }

        navigation.setOptions({
            headerRight: () => (
                <Button circle onPress={submit} style={{
                    opacity: canSubmit ? 1 : 0.4,
                }}>
                    <Ionicons name="checkmark" color={'#fff'} size={20} />
                </Button>
            )
        })
    }, [label, quantity, price, user, navigation]);

    const submit = async () => {
        if (isSubmitting || !canSubmit) return;
        setSubmitting(true);

        try {
            const response = await axios.post(`${config.base_url}/api/store/product/${product.id}/stock/store`, {
                quantity, label,
                cost_price: price,
            }, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
            navigation.goBack();
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ gap: 20 }}>
                    <Input label="Label" value={label} onChangeText={e => setLabel(e)} />
                    <Input label="Harga beli" value={Currency(price).encode()} onChangeText={e => {
                        let val = Currency(e || 0).decode() ?? 0;
                        if (isNaN(val)) {
                            val = 0;
                        }
                        
                        setPrice(val);
                    }} keyboardType="numeric" />
                    <Input label="Jumlah Barang" value={quantity.toString()} onChangeText={e => {
                        let val = parseInt(e);
                        if (isNaN(val)) {
                            val = 1;
                        }
                        setQuantity(val);
                    }} keyboardType="numeric" right={
                        <Inline gap={10}>
                            <TouchableOpacity style={styles.qty_btn} onPress={() => controlQty('decrease')}>
                                <Ionicons name="remove" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.qty_btn} onPress={() => controlQty('increase')}>
                                <Ionicons name="add" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                        </Inline>
                    } />
                </View>

                <View style={{ gap: 10 }}>
                    <Text size={20} style={{ fontWeight: '500' }}>Produk</Text>
                    <Inline>
                        <View style={styles.image}>
                            { product.images.length === 0 ?
                                <Ionicons name="image-outline" size={24} color={COLORS.slate[700]} />
                                :
                                <Image style={styles.image} source={{uri: `${config.base_url}/storage/${product.store_id}/product_images/${product.id}/${product.images[0].filename}`}} />
                            }
                        </View>
                        <View style={{ flexBasis: 100,flexShrink: 1,flexGrow: 1, gap: 5 }}>
                            <Text color={COLORS.slate[800]} size={16} style={{ fontWeight: '600' }}>{product.name}</Text>
                        </View>
                    </Inline>
                </View>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        backgroundColor: "#fff",
        gap: 35,
    },
    qty_btn: {
        padding: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 8,
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.slate[200]
    }
});

export default OwnerProductStockAdd;