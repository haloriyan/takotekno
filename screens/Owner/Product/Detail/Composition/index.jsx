import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import config from "../../../../../config";
import StateView from "../../../../../components/StateView";
import { Ionicons } from "@expo/vector-icons";
import { useDebounce, useDebouncedCallback } from "use-debounce";

const Item = ({ increase, decrease, comp }) => {
    const [quantity, setQuantity] = useState(comp.quantity);

    return (
        <Inline gap={15}>
            <Image style={{...styles.image, width: 42}} source={{ uri: `${config.base_url}/storage/${comp.composition.store_id}/product_images/${comp?.composition?.id}/${comp?.composition?.images[0]?.filename}` }} />
            <View style={{ flexGrow: 1,flexBasis: 20,flexShrink: 1,gap: 5}}>
                <Text size={12} color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{comp?.composition?.name}</Text>
            </View>
            <Inline gap={20}>
                <Button accent="secondary" color={quantity > 1 ? COLORS.primary : COLORS.red[500]} circle onPress={() => {
                    decrease(comp.composition_id);
                    setQuantity(prev => prev - 1);
                }}>
                    <Ionicons name={quantity > 1 ? 'remove' : 'trash-outline'} color={quantity > 1 ? COLORS.primary : COLORS.red[500]} size={18} />
                </Button>
                <Text size={14} style={{ fontWeight: '700' }} color={COLORS.slate[800]}>
                    {quantity}
                </Text>
                <Button accent="secondary" circle onPress={() => {
                    increase(comp.composition_id);
                    setQuantity(prev => prev + 1);
                }}>
                    <Ionicons name="add" color={COLORS.primary} size={18} />
                </Button>
            </Inline>
        </Inline>
    )
}

const ProductComposition = ({ product, user }) => {
    const [compositions, setCompositions] = useState([]);
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);

    const debounceSearch = useDebouncedCallback(() => {
        search();
    }, 1300);

    const search = async () => {
        try {
            const response = await axios.post(`${config.base_url}/api/store/product/${product.id}/composition/search`, { q }, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            let res = response.data;

            setResults(res.products);
        } catch (err) {
            console.error(err);
        }
    }

    const load = async () => {
        try {
            const response = await axios.get(`${config.base_url}/api/store/product/${product.id}/composition`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            let res = response.data;

            setCompositions(res.compositions);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            // 
        }
    }

    const increase = async (id) => {
        try {
            const response = await axios.post(`${config.base_url}/api/store/product/${product.id}/composition/increase`, {
                composition_id: id,
            }, { headers: { Authorization: `Bearer ${user?.token}` } });

            if (q !== "") {
                search();
            }
            load();
        } catch (err) {}
    }
    const decrease = async (id) => {
        try {
            const response = await axios.post(`${config.base_url}/api/store/product/${product.id}/composition/decrease`, {
                composition_id: id,
            }, { headers: { Authorization: `Bearer ${user?.token}` } });

            if (q !== "") {
                search();
            }
            load();
        } catch (err) {}
    }

    useEffect(() => {
        if (user !== null) {
            load();
        }
    }, [user]);

    return (
        <View style={{ gap: 20 }}>
            <View style={{ gap: 5 }}>
                <Text size={16} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Komposisi</Text>
                <Text size={13} lineHeight={18} color={COLORS.slate[600]}>
                    Produk dalam list ini akan ikut berkurang untuk setiap item {product.name} terjual.
                </Text>
            </View>

            <View style={[styles.search_card, styles.shadow]}>
                <Inline gap={15}>
                    <Ionicons name="search-outline" size={24} color={COLORS.slate[700]} />
                    <TextInput 
                        style={styles.search_input} 
                        placeholder="Cari produk"
                        value={q}
                        onChangeText={e => {
                            setQ(e);
                            debounceSearch();
                        }}
                    />
                    { q !== "" &&
                        <TouchableOpacity onPress={() => {
                            setQ('');
                            setResults([]);
                        }}>
                            <Ionicons name="close" size={18} color={COLORS.red[500]} />
                        </TouchableOpacity>
                    }
                </Inline>

                { results.map((prod, r) => (
                    <Inline key={r}>
                        <Image style={styles.image} source={{ uri: `${config.base_url}/storage/${prod.store_id}/product_images/${prod.id}/${prod.images[0]?.filename}` }} />
                        <View style={{ flexGrow: 1,flexBasis: 20,flexShrink: 1,gap: 5}}>
                            <Text size={12} color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{prod.name}</Text>
                        </View>
                        <Button circle size={32} onPress={() => {
                            increase(prod.id);
                        }}>
                            <Ionicons name="add" size={14} color={'#fff'} />
                        </Button>
                    </Inline>
                ))}
            </View>

            { compositions.length === 0 ?
                <View style={{ marginTop: 40 }}>
                    <StateView
                        icon={<Ionicons name="cube-outline" size={48} color={COLORS.primary} />}
                        title={'Tidak ada data'}
                        body={`${product.name} tidak memiliki komposisi apapun.`}
                    />
                </View>
                :
                <>
                    <Text size={11} color={COLORS.slate[500]} lineHeight={16}>{product.name} mungkin tidak muncul saat membuat order jika salah satu di list ini tidak memiliki stok yang cukup.</Text>
                    <View style={{ gap: 20,marginTop: 20 }}>
                        { compositions.map((comp, c) => (
                            <Item 
                                comp={comp} key={c}
                                increase={increase} decrease={decrease}
                            />
                        )) }
                    </View>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    search_card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        gap: 20,
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    search_input: {
        flexGrow: 1,
        height: 28,
    },
    image: {
        width: 32,
        aspectRatio: 1,
        borderRadius: 8,
    }
});

export default ProductComposition