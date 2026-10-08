import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import config from "../../config";
import { useToast } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import useUser from "../../hooks/useUser";

const StockItem = ({ stock, product, products, setProducts }) => {
    const [quantity, setQuantity] = useState(stock?.quantity ?? 0);

    const controlQty = (action) => {
        if (action === 'increase') {
            setQuantity(prev => prev + 10);
        } else {
            if (quantity > 10) {
                setQuantity(prev => prev - 10);
            } else {
                setQuantity(prev => 0);
            }
        }
    }

    useEffect(() => {
        products.map((prod, p) => {
            if (prod.id === product.id) {
                prod.available_stocks.map((sto, s) => {
                    if (sto.id === stock.id) {
                        let theProducts = [...products];
                        theProducts[p].available_stocks[s].quantity = quantity;
                        setProducts(theProducts);
                    }
                });
            }
        });
    }, [quantity]);

    return (
        <Inline gap={15}>
            <View style={{ flexGrow: 1,flexBasis: 20,flexShrink: 1,gap: 5}}>
                <Text size={12} color={COLORS.slate[700]} style={{ fontWeight: '700' }}>{stock.label}</Text>
            </View>
            <Inline gap={0}>
                <Pressable style={{ padding: 4,paddingHorizontal: 8 }} onPress={() => {
                    controlQty('decrease')
                }}>
                    <Ionicons name="remove" size={18} />
                </Pressable>
                <TextInput
                    value={quantity.toString()}
                    style={{
                        height: 30,
                        width: 48,
                        textAlign: 'center',
                    }}
                    keyboardType="numeric"
                    onChangeText={e => {
                        let val = e === "" ? 0 : parseInt(e);
                        setQuantity(val);
                    }}
                />
                <Pressable style={{ padding: 4,paddingHorizontal: 8 }} onPress={() => {
                    controlQty('increase')
                }}>
                    <Ionicons name="add" size={18} />
                </Pressable>
            </Inline>
        </Inline>
    )
}

const StockistOpname = ({ navigation, route }) => {
    const [products, setProducts] = useState(route.params?.products ?? []);
    const toast = useToast();
    const [q, setQ] = useState('');
    const [canSubmit, setCanSubmit] = useState(true);
    const [user] = useUser();
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        const initialProducts = route.params?.products ?? [];

        const filteredProducts = initialProducts.filter(
            item => item.available_stocks.length > 0
        );

        if (filteredProducts.length !== initialProducts.length) {
            setProducts(filteredProducts);
            toast.show("Produk dengan stok kosong tidak akan ditampilkan.");
        }
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button circle onPress={submit} color={COLORS.green[500]} style={{
                    opacity: canSubmit ? 1 : 0.4,
                }}>
                    <Ionicons name="checkmark" color={'#fff'} size={20} />
                </Button>
            )
        })
    }, [products, submit, navigation, user]);

    const debounceSearch = useDebouncedCallback(() => {
        console.log(q);
    }, 1000);

    const submit = async () => {
        if (isSubmitting) return;

        setSubmitting(true);
        try {
            const response = await axios.post(`${config.base_url}/api/stockist/opname`, {
                products
            }, { headers: { Authorization: `Bearer ${user.token}` }});
            let res = response.data;

            Alert.alert('Berhasil!', res.message, [
                { text: "Kembali", onPress: () => navigation.goBack()}
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }
    
    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                { products.map((prod, p) => (
                    <View style={styles.item} key={p}>
                        <Inline>
                            <Image 
                                style={styles.product_image} 
                                source={{ uri: `${config.base_url}/storage/${prod.store_id}/product_images/${prod.id}/${prod.images[0].filename}` }} 
                            />
                            <Text size={16} color={COLORS.slate[800]} style={{ fontWeight: '700' }}>{prod.name}</Text>
                        </Inline>

                        <View />

                        <View style={{ gap: 8 }}>
                            { prod.available_stocks.map((sto, s) => (
                                <StockItem
                                    key={s}
                                    product={prod} stock={sto}
                                    products={products} setProducts={setProducts}
                                />
                            ))}
                        </View>
                    </View>
                )) }
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    container: {
        backgroundColor: "#fff",
        flexGrow: 1,
        padding: 20,
        gap: 40,
    },
    product_image: {
        width: 42,
        height: 42,
        borderRadius: 8,
    },
    item: {
        gap: 10,
    },
    search: {
        backgroundColor: "#fff",
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 999
    },
    search_input: {
        height: 36,
        flexGrow: 1,
    }
});

export default StockistOpname;