import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import config from "../../../config";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import StateView from "./StateView";
import Grid from "@haloriyan/grid";
import Currency from "../../../lib/Currency";
import useGridCol from "../../../hooks/useGridCol";

const ProductItem = ({ product }) => {
    const navigation = useNavigation();
    const [imagesIndex, setImagesIndex] = useState(0);

    const imageControl = action => {
        if (action === 'back') {
            setImagesIndex(prev => prev - 1);
        } else {
            setImagesIndex(prev => prev + 1);
        }
    }

    return (
        <View style={[styles.product_item, styles.shadow]}>
            <Pressable style={styles.product_image_area} onPress={() => {
                navigation.navigate('OwnerProductDetail', {
                    product,
                });
            }}>
                { product.images.length === 0 ?
                    <Ionicons name="image-outline" size={32} />
                    :
                    <Image style={styles.product_image_area} source={{uri: `${config.base_url}/storage/${product.store_id}/product_images/${product.id}/${product.images[imagesIndex].filename}`}} />
                }

                <Inline style={styles.product_image_indicator} gap={5} justifyContent={'center'}>
                    { product.images.map((img, i) => (
                        <View key={i} style={[styles.product_image_indicator_item, imagesIndex === i ? styles.product_image_indicator_item_active : null]} />
                    ))}
                </Inline>

                <Inline style={styles.product_image_overlay}>
                    { imagesIndex > 0 &&
                        <Button circle size={32} color="#fff" onPress={() => imageControl('back')}>
                            <MaterialIcons name="west" color={COLORS.primary} />
                        </Button>
                    }
                    <View style={{flexGrow: 1,flexShrink: 1,flexBasis: 10}} />
                    { imagesIndex !== product.images.length - 1 &&
                        <Button circle size={32} color="#fff" onPress={() => imageControl('next')}>
                            <MaterialIcons name="east" color={COLORS.primary} />
                        </Button>
                    }
                </Inline>
            </Pressable>

            <Pressable style={{ padding: 20, gap: 5 }} onPress={() => {
                navigation.navigate('OwnerProductDetail', {
                    product,
                });
            }}>
                <Text color={COLORS.slate[800]} style={{ fontWeight: '500' }}>{product.name}</Text>
                <View />
                <Inline gap={10}>
                    <Ionicons name="cash-outline" />
                    <Text size={11}>Harga</Text>
                    <View style={{ flexGrow: 1 }} />
                    <Text style={{ fontWeight: '600' }} size={12} color={COLORS.primary}>{Currency(product.price).encode()}</Text>
                </Inline>
                <Inline gap={10}>
                    <Ionicons name="cube-outline" />
                    <Text size={11}>Stok</Text>
                    <View style={{ flexGrow: 1 }} />
                    <Text>{product.valid_stock}</Text>
                </Inline>
            </Pressable>
        </View>
    )
}

const ProductView = ({ user = null, parentSetCategories, canAdd, setCanAdd }) => {
    const [isLoading, setLoading] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [raw, setRaw] = useState(null);
    const [page, setPage] = useState(1);
    const isFocused = useIsFocused();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [gridCol] = useGridCol();

    const loadCategories = async () => {
        if (isLoading) return;
        setLoading(true);

        try {
            const response = await axios.get(`${config.base_url}/api/store/category`, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
            setCategories(res.categories);
            parentSetCategories(res.categories);
        } catch (err) {
            console.error(err);
            console.error(err.response.data);
        } finally {
            setLoading(false);
            setLoaded(true);
        }
    }
    const load = async () => {
        if (isLoading) return;
        setLoading(true);
        setLoaded(false);

        try {
            if (page === 1) {
                setProducts([]);
            }
            
            let endpoint = `${config.base_url}/api/store/product?page=${page}`;
            if (category !== null) {
                endpoint += `&category_id=${category.id}`
            }

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;

            setRaw(res.products);
            setProducts(prev => [...prev, ...res.products.data]);
            setCanAdd(res.can_add);
        } catch (err) {
            // 
        } finally {
            setLoading(false);
            setLoaded(true);
        }
    }

    useEffect(() => {
        if (isFocused && user !== null) {
            setRaw(null);
            (async () => {
                await loadCategories();
                await load();
            })();
        }
    }, [user, isFocused, category, page]);

    return (
        <React.Fragment>
            { categories.length > 0 &&
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.category_style} contentContainerStyle={styles.category_container}>
                    <View /><View />
                    <TouchableOpacity style={[styles.category_item, category === null ? styles.category_item_active : null]} onPress={() => {
                        setCategory(null);
                        setPage(1);
                    }}>
                        <Text color={category === null ? COLORS.primary : COLORS.slate[700]} size={12} style={{ fontWeight: category === null ? '600' : '500' }}>Semua</Text>
                    </TouchableOpacity>
                    { categories.map((cat, c) => {
                        let isActive = cat.id === category?.id;
                        return (
                            <TouchableOpacity key={c} style={[styles.category_item, isActive ? styles.category_item_active : null]} onPress={() => {
                                setCategory(cat);
                                setPage(1);
                            }}>
                                <Text 
                                    color={isActive ? COLORS.primary : COLORS.slate[700]} 
                                    size={12} 
                                    style={{ fontWeight: isActive ? '600' : '500' }}
                                >{cat.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    <View /><View />
                </ScrollView>
            }
            { isLoaded && products.length === 0 &&
                <StateView 
                    icon={<Ionicons name="cube-outline" size={128} color={COLORS.primary} />}
                    title={"Belum ada produk ditambahkan."}
                    action={
                        <Button onPress={() => navigation.navigate('OwnerProductAdd', {
                            categories,
                        })}>Tambahkan Produk</Button>
                    }
                />
            }
            { isLoaded && products.length > 0 &&
                <ScrollView contentContainerStyle={styles.container} refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={async () => {
                        setRaw(null);
                        setPage(1);
                        load();
                    }} />
                }>
                    <Grid col={gridCol} gap={15}>
                        { products.map((prod, p) => (
                            <ProductItem product={prod} key={p} />
                        ))}
                    </Grid>

                    { raw?.next_page_url !== null &&
                        <Button accent="secondary" style={{ width: '100%',marginTop: 25 }} onPress={() => {
                            setPage(prev => prev + 1);
                        }}>Lainnya</Button>
                    }
                </ScrollView>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    category_container: {
        gap: 10,
        alignItems: 'center'
    },
    category_style: {
        backgroundColor: '#fff',
        maxHeight: 48,
        minHeight: 48,
    },
    category_item: {
        padding: 8,
        paddingHorizontal: 15,
        borderRadius: 999,
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    category_item_active: {
        borderColor: COLORS.primary,
        backgroundColor: `${COLORS.primary}20`
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    product_item: {
        backgroundColor: "#fff",
        borderRadius: 12,
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    product_image_area: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    product_image_overlay: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    product_image_indicator: {
        position: 'absolute',
        left: 0,right: 0,bottom: 0,
        padding: 10,
        backgroundColor: '#00000010',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    product_image_indicator_item: {
        width: 8,
        height: 8,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    product_image_indicator_item_active: {
        backgroundColor: '#fff',
        width: 14,
    }
});

export default ProductView;