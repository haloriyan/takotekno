import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import config from "../../config";
import useUser from "../../hooks/useUser";
import Currency from "../../lib/Currency";
import { Ionicons } from "@expo/vector-icons";
import Summary from "./Summary";
import { useIsFocused } from "@react-navigation/native";
import Scanner from "./Scanner";
import StateView from "../Owner/Product/StateView";
import { SafeAreaView } from "react-native-safe-area-context";
// import POSPrint from "./Print";

const POSHome = ({ navigation, route }) => {
    const { width } = useWindowDimensions();
    const [user, setUser] = useUser();
    const [categories, setCategories] = useState([]);
    const [carts, setCarts] = useState([]);
    const [cartProductIDs, setCartProductIDs] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [isScanning, setScanning] = useState(false);
    const isFocused = useIsFocused();
    const [isPrinting, setPrinting] = useState(false);
    const [sales, setSales] = useState(null);
    const [canAdd, setCanAdd] = useState(true);
    const [canScan, setCanScan] = useState(false);
    const [q, setQ] = useState('');
    const [paymentMethod, setPaymentMethod] = useState({
        key: "CASH", label: "Tunai"
    });
    const [paymentStatus, setPaymentStatus] = useState({ key: "PAID", label: "Lunas" });

    const load = async () => {
        try {
            const response = await axios.get(`${config.base_url}/api/pos?q=${q}`, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;

            setCategories(res.categories);
            setCarts(res.carts);

            let productIDs = [];
            res.carts.map(item => {
                productIDs.push(item.product_id);
            });
            setCartProductIDs(productIDs);

            setCanScan(res.can_scan);
            setCanAdd(res.can_add);
            
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        }
    }
    const loadCart = async () => {
        try {
            // 
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        }
    }

    useEffect(() => {
        if (isFocused && user !== null) {
            let int = setInterval(() => {
                load();
            }, 1500);

            return () => clearInterval(int);
        }
    }, [user, isFocused, q]);

    useEffect(() => {
        if (canScan) {
            if (width > 480 || showSummary) {
                navigation.setOptions({
                    headerRight: () => (
                        <Button circle onPress={() => setScanning(!isScanning)}>
                            <Ionicons name="scan" color={'#fff'} />
                        </Button>
                    ),
                    headerShown: true,
                    headerTitle: "Buat Order"
                });
            }

            if (width <= 480 && !showSummary) {
                navigation.setOptions({ headerShown: false })
            }
        }
    }, [navigation, isScanning, canScan, showSummary]);

    const addToCart = async product => {
        try {
            const response = await axios.post(`${config.base_url}/api/pos/cart/store`, {
                product,
                stock_id: product.stock.id,
            }, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            // 
        }
    }

    const minusCart = async cartID => {
        try {
            const response = await axios.post(`${config.base_url}/api/pos/cart/remove`, {
                cart_id: cartID
            }, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            
            let res = response.data;
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            // 
        }
    }

    const removeFromCart = async productID => {
        try {
            const response = await axios.post(`${config.base_url}/api/pos/cart/delete`, {
                product_id: productID
            }, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        }
    }

    return (
        <React.Fragment>
            { !canAdd &&
                <View style={styles.cant_add_container}>
                    <StateView
                        icon={<Ionicons name="trending-up-outline" size={64} color={COLORS.primary} />}
                        title={'Upgrade untuk Membuat Order'}
                        body={'Kamu telah mencapai batas dalam membuat pesanan. Tingkatkan ke STARTER atau PRO untuk membuat pesanan baru, atau tunggu sampai besok agar bisa membuat pesanan kembali.'}
                        action={
                            <Button onPress={() => navigation.navigate('Upgrade')}>Upgrade</Button>
                        }
                    />
                </View>
            }
            { width < 480 &&
                <SafeAreaView>
                    <Inline style={[styles.header]}>
                        <Inline style={[styles.search, styles.shadow]} gap={10}>
                            <Ionicons name="search-outline" size={18} />
                            <TextInput style={styles.search_input} placeholder="Cari" value={q} onChangeText={e => {
                                setQ(e);
                            }} />
                            { q !== "" &&
                                <Pressable onPress={() => setQ('')}>
                                    <Ionicons name="close-outline" size={18} />
                                </Pressable>
                            }
                        </Inline>
                        <Button size={42} circle onPress={() => setScanning(!isScanning)}>
                            <Ionicons name="scan" color={'#fff'} />
                        </Button>
                    </Inline>
                </SafeAreaView>
            }
            <Inline gap={0} alignItems="flex-start" style={{ flexGrow: 1 }}>
                <View style={styles.left}>
                    <ScrollView contentContainerStyle={styles.left_inner} nestedScrollEnabled>
                        { categories.map((cat, c) => (
                            <View key={c}>
                                <Text size={20} color={COLORS.slate[800]} style={styles.category_name}>{cat.name}</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                                    <View /><View />
                                    { cat.products.map((prod, p) => {
                                        return (
                                            <View key={p} style={[styles.product_item, cartProductIDs.includes(prod.id) && styles.product_item_selected]}>
                                                <TouchableOpacity onPress={() => addToCart(prod)} style={{ flexGrow: 1 }}>
                                                    <Image style={styles.product_image} source={{ uri: `${config.base_url}/storage/${prod.store_id}/product_images/${prod.id}/${prod.images[0].filename}` }} />
                                                    <View style={{ paddingVertical: 10 }}>
                                                        <Inline>
                                                            <View style={{ flexBasis: 10,flexGrow: 1,flexShrink: 1,gap: 5 }}>
                                                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{prod.name}</Text>
                                                                <Text size={12} color={COLORS.primary} style={{ fontWeight: '500' }}>{Currency(prod.price).encode()}</Text>
                                                            </View>
                                                            { carts[cartProductIDs.indexOf(prod.id)] &&
                                                                <Button circle size={28}>
                                                                    <Text color="#fff" style={{ fontWeight: '800' }}>
                                                                        {
                                                                            carts[
                                                                                cartProductIDs.indexOf(prod.id)
                                                                            ]?.quantity
                                                                        }
                                                                    </Text>
                                                                </Button>
                                                            }
                                                        </Inline>
                                                    </View>
                                                </TouchableOpacity>
                                                { cartProductIDs.includes(prod.id) && (
                                                    <TouchableOpacity 
                                                        style={styles.remove_product_btn} 
                                                        onPress={() => {
                                                            removeFromCart(prod.id);
                                                        }}
                                                    >
                                                        <Ionicons name="trash-outline" size={20} color={COLORS.red[500]} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )
                                    })}
                                    <View /><View />
                                </ScrollView>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                { width > 768 &&
                    <View style={styles.right}>
                        <View style={[styles.right_inner, styles.shadow]}>
                            <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Ringkasan</Text>
                            <View style={{ gap: 10 }}>
                                { carts.map((cart, c) => (
                                    <Inline key={c} gap={15}>
                                        <Image 
                                            style={{
                                                ...styles.product_image,
                                                width: 80,
                                            }} 
                                            source={{ uri: `${config.base_url}/storage/${cart.product.store_id}/product_images/${cart.product.id}/${cart.product.images[0].filename}` }}
                                        />
                                        <View style={{ flexBasis: 10, flexGrow: 1, gap: 4 }}>
                                            <Text size={16} color={COLORS.slate[800]}>{cart.product.name}</Text>
                                            <Text size={12} color={COLORS.primary}>{Currency(cart.total_price).encode()}</Text>
                                        </View>
                                        <Inline gap={20}>
                                            <TouchableOpacity style={styles.qty_btn}>
                                                <Ionicons name="remove-outline" />
                                            </TouchableOpacity>
                                            <Text color={COLORS.slate[800]} size={20} style={{ fontWeight: '500' }}>
                                                { cart.quantity }
                                            </Text>
                                            <TouchableOpacity style={styles.qty_btn} onPress={() => {
                                                let done = false;
                                                categories.map((cat, c) => {
                                                    cat.products.map((prod, p) => {
                                                        if (prod.id === cart.product_id && done == false) {
                                                            done = true;
                                                            addToCart(prod);
                                                        }
                                                    })
                                                })
                                            }}>
                                                <Ionicons name="add-outline" />
                                            </TouchableOpacity>
                                        </Inline>
                                    </Inline>
                                ))}
                            </View>
                        </View>
                    </View>
                }
            </Inline>
            { (width < 480 && carts.length > 0) &&
                <Inline style={[styles.balloon, styles.shadow]}>
                    <View style={{ flexBasis: 10,flexGrow: 1,flexShrink: 1, gap: 5}}>
                        <Text size={11}>Total Belanja :</Text>
                        <Text color={COLORS.primary} style={{ fontWeight: '600' }}>
                            {Currency(
                                carts.reduce((sum, item) => {
                                    let result = sum;
                                    if (!item.is_composition) {
                                        result += item.total_price;
                                    }
                                    return result;
                                }, 0)
                            ).encode()}
                        </Text>
                    </View>
                    <Button onPress={() => {
                        setShowSummary(true);
                    }}>Proses</Button>
                </Inline>
            }
            { showSummary &&
                <View style={[styles.overlay, styles.summary_mobile]}>
                    <Summary 
                        carts={carts} categories={categories} user={user}
                        setShowSummary={setShowSummary}
                        paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                        addToCart={addToCart} minusCart={minusCart}
                        isPrinting={isPrinting} setPrinting={setPrinting}
                        sales={sales} setSales={setSales}
                        paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus}
                    />
                </View>
            }
            { isScanning &&
                <View style={[styles.overlay, { backgroundColor: "#000" }]}>
                    <Scanner
                        user={user} carts={carts} categories={categories}
                        addToCart={addToCart} setScanning={setScanning}
                    />
                </View>
            }
            { isPrinting &&
                <>
                {/* <POSPrint 
                    sales={sales}
                    isPrinting={isPrinting} setPrinting={setPrinting}
                /> */}
                </>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    left: {
        flexBasis: 10,
        flexGrow: 1,
        flexShrink: 1,
        height: '100%'
    },
    left_inner: {
        flexGrow: 1,
    },
    right: {
        width: '40%',
        padding: 20,
    },
    right_inner: {
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 18,
        gap: 20,
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1,height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    category_name: {
        padding: 20,
        fontWeight: '600'
    },
    product_item: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: Dimensions.get('screen').width < 480 ? 125 : 250,
    },
    product_item_selected: {
        // borderWidth: 1,
        // borderColor: COLORS.primary,
        // backgroundColor: `${COLORS.primary}`
    },
    remove_product_btn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#fff',
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        zIndex: 1,
    },
    product_image: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: "#eee",
        borderRadius: 12,
    },
    qty_btn: {
        width: 32,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center'
    },
    balloon: {
        position: 'absolute',
        bottom: 25,left: 20,right: 20,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 18,
    },
    overlay: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
    },
    summary_mobile: {
        backgroundColor: "#fff",
    },
    cant_add_container: {
        // position: "absolute",
        // top: 0,left: 0,right: 0,bottom: 0,
        flexGrow: 1,
        flexBasis: Dimensions.get('screen').height - 100,
        flexShrink: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    header: {
        paddingHorizontal: 20,
    },
    search: {
        backgroundColor: "#fff",
        borderRadius: 99,
        flexGrow: 1,
        flexBasis: 100,
        flexShrink: 1,
        paddingHorizontal: 20,
    },
    search_input: {
        flexGrow: 1,
        flexGrow: 1,
        flexBasis: 100,
        flexShrink: 1,
        height: 48,
        // backgroundColor: "red"
    }
});

export default POSHome;
