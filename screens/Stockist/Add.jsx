import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import { useDebouncedCallback } from "use-debounce";
import config from "../../config";
import useUser from "../../hooks/useUser";
import Currency from "../../lib/Currency";

const Item = ({ product, products, setProducts }) => {
    const [costPrice, setCostPrice] = useState(product.new_stock.cost_price);
    const [quantity, setQuantity] = useState(product?.new_stock?.quantity ?? 0);

    const controlQty = (action) => {
        if (action === 'increase') {
            setQuantity(prev => prev + 10);
        } else {
            if (quantity > 10) {
                setQuantity(prev => prev - 10);
            } else {
                setQuantity(prev => prev - 1);
            }
        }
    }

    useEffect(() => {
        products.map((prod, p) => {
            if (prod.id === product.id) {
                let theProducts = [...products];
                if (quantity <= 0) {
                    theProducts.splice(p, 1);
                } else {
                    theProducts[p].new_stock.quantity = quantity;
                }
                setProducts(theProducts);
            }
        });
    }, [quantity]);

    useEffect(() => {
        let i = products.findIndex(item => item.id === product.id);
        let theProducts = [...products];
        theProducts[i].new_stock['cost_price'] = costPrice;
        setProducts(theProducts);
    }, [costPrice]);

    return (
        <Inline>
            <Image
                source={{ uri: `${config.base_url}/storage/${product.store_id}/product_images/${product.id}/${product.images[0].filename}` }}
                style={styles.image}
            />
            <View style={{ flexGrow: 1,flexBasis: 100,flexShrink: 1,gap: 10 }}>
                <Text color={COLORS.slate[800]} style={{ fontWeight: '700' }}>{product.name}</Text>
                <View style={{ gap: 0 }}>
                    <Text size={11}>Harga Beli</Text>
                    <TextInput
                        style={styles.price_input}
                        value={Currency(costPrice).encode()} 
                        keyboardType="numeric"
                        onChangeText={e => {
                            let val = Currency(e || 0).decode() ?? 0;
                            if (isNaN(val)) {
                                val = 0;
                            }
                            
                            setCostPrice(val);
                        }}
                    />
                </View>
            </View>
            <Inline gap={0}>
                <Pressable style={{ padding: 4,paddingHorizontal: 8 }} onPress={() => {
                    controlQty('decrease')
                }}>
                    <Ionicons 
                        size={18} 
                        name={quantity === 1 ? 'trash-outline' : 'remove'} 
                        color={quantity === 1 ? COLORS.red[500] : COLORS.slate[800]}
                    />
                </Pressable>
                <TextInput
                    value={quantity.toString()}
                    style={{
                        height: 30,
                        width: 48,
                        textAlign: 'center',
                        fontSize: 18,
                        color: COLORS.slate[800]
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
    );
}

const StockistAdd = ({ navigation, route }) => {
    const [user] = useUser();
    const [isSubmitting, setSubmitting] = useState(false);
    const [products, setProducts] = useState(route?.params?.products ?? []);
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setSearching] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);

    const submit = async () => {
        if (isSubmitting) return;

        setSubmitting(true);
        try {
            const response = await axios.post(`${config.base_url}/api/stockist/store`, {
                products,
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            let res = response.data;
            
            Alert.alert(res.message, null, [
                { text: "Kembali", onPress: () => navigation.goBack()}
            ]);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setSubmitting(false);
        }
    }

    const search = async () => {
        setSearching(true);
        try {
            const response = await axios.post(`${config.base_url}/api/stockist/search`, { q }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;
            console.log(res);
            setResults(res.products);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setSearching(false);
        }
    }
    const debounceSearch = useDebouncedCallback(() => {
        search();
    }, 1000);

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

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled>
                <View style={{ gap: 10 }}>
                    <Inline style={[styles.search, styles.shadow]} gap={0}>
                        <Button circle accent="tertiary">
                            <Ionicons name="search-outline" size={18} color={COLORS.slate[500]} />
                        </Button>
                        <TextInput style={styles.search_input} value={q} onChangeText={e => {
                            setSearching(true);
                            setQ(e);
                            debounceSearch();
                        }} placeholder="Cari produk" />
                        { q !== "" &&
                            <Button circle accent="tertiary" onPress={() => {
                                setQ('');
                                debounceSearch();
                            }}>
                                <Ionicons name="close-outline" size={18} color={COLORS.slate[500]} />
                            </Button>
                        }
                    </Inline>
                    { (results.length > 0 && !isSearching && q !== "") &&
                        <View style={[styles.result_area, styles.shadow]}>
                            <ScrollView
                                // 
                            >
                                { results.map((res, r) => {
                                    let i = products.findIndex(item => item.id === res.id);
                                    if (i >= 0) return;
                                    
                                    return (
                                        <Inline key={r} style={styles.result_item} gap={10} onPress={() => {
                                            res['new_stock'] = {
                                                quantity: 10,
                                                cost_price: res.price,
                                            }
                                            let theProducts = [...products];
                                            theProducts.push(res);
                                            setProducts(theProducts);
                                            setQ('');
                                            setResults([]);
                                        }}>
                                            <Image 
                                                style={{
                                                    backgroundColor: "#ecf0f1",
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 8,
                                                }}
                                                source={{ uri: `${config.base_url}/storage/${res.store_id}/product_images/${res.id}/${res.images[0].filename}` }}
                                            />
                                            <Text size={12} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{res.name}</Text>
                                            <View style={{ flexGrow: 1 }} />
                                            <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
                                        </Inline>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    }
                </View>

                <View style={{ gap: 20 }}>
                    { products.map((prod, p) => (
                        <Item
                            product={prod} key={p}
                            products={products} setProducts={setProducts}
                        />
                    ))}
                </View>
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
    },
    result_area: {
        backgroundColor: "#fff",
        borderRadius: 12,
        maxHeight: 200,
        position: 'absolute',
        left: 0,right: 0,
        marginTop: 80,
        zIndex: 3,
        elevation: 3,
    },
    result_item: {
        padding: 12,
        paddingHorizontal: 20,
    },
    image: {
        width: 76,
        height: 76,
        backgroundColor: "#ecf0f1",
        borderRadius: 12,
    },
    price_input: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate[300],
        paddingVertical: 10,
        fontSize: 12,
    }
});

export default StockistAdd;