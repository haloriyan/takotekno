import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, COLORS, Dialog, Inline, Text, Toggle } from "ripal-ui";
import config from "../../../../config";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import useUser from "../../../../hooks/useUser";
import { useIsFocused } from "@react-navigation/native";
import ImageViewer from "./ImageViewer";
import StockView from "./Stock";
import dayjs from "dayjs";
import ProductComposition from "./Composition";

const OwnerProductDetail = ({ navigation, route }) => {
    const [user, setUser] = useUser();
    const [showHeaderContext, setShowHeaderContext] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const [isDeletingProc, setDeletingProc] = useState(false);
    const [product, setProduct] = useState(route.params.product);
    const isFocused = useIsFocused();
    const [imageIndex, setImageIndex] = useState(0);
    const [showImage, setShowImage] = useState(false);
    const [viewing, setViewing] = useState('Detail');
    const [sales, setSales] = useState([]);

    const load = async () => {
        try {
            const response = await axios.get(`${config.base_url}/api/store/product/${product.id}/detail`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;
            
            setProduct(res.product);
            setSales(res.sales);
        } catch (err) {
            // 
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button circle color="#fff" onPress={() => setShowHeaderContext(!showHeaderContext)}>
                    <Ionicons name="ellipsis-horizontal-outline" color={COLORS.slate[700]} size={20} />
                </Button>
            )
        })
    }, [showHeaderContext]);

    useEffect(() => {
        // navigation.setOptions({
        //     headerShown: !showImage
        // })
    }, [showImage]);

    useEffect(() => {
        if (isFocused && user !== null) {
            load();
        }
    }, [isFocused, user]);

    const del = async () => {
        
        if (isDeletingProc) return;
        setDeletingProc(true);
        try {
            const response = await axios.get(`${config.base_url}/api/store/product/${product.id}/delete`, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
        } catch (err) {
            console.error(err);
            console.error(err.response.data);
        } finally {
            navigation.goBack();
            setDeleting(false);
            setDeletingProc(false);
        }
    }

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled scrollEventThrottle={16} onScroll={e => {
                setShowHeaderContext(false);
            }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
                    // 
                }} style={{
                    backgroundColor: "#fff",
                    // maxHeight: 200,
                    maxHeight: product.images.length === 1 ? 400 : 200,
                }}>
                    { product.images.map((img, i) => (
                        <TouchableOpacity key={i} onPress={() => {
                            setImageIndex(i);
                            setShowImage(true);
                        }}>
                            <Image style={{
                                ...styles.image,
                                width: (product.images.length === 1 ? 100 : 60) / 100 * Dimensions.get('screen').width,
                                // width: 60 / 100 * Dimensions.get('screen').width,
                            }} source={{ uri: `${config.base_url}/storage/${product.store_id}/product_images/${product.id}/${img.filename}` }} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.content}>
                    <Toggle
                        options={['Detail', 'Stok', 'Komposisi']}
                        value={viewing} setValue={setViewing}
                    />
                    
                    { viewing === 'Detail' &&
                        <View style={{ gap: 10 }}>
                            <Text size={20} style={{ fontWeight: '600' }}>{product.name}</Text>
                            <Text>{product.description}</Text>

                            <View /><View /><View />
                            <Text size={20} color={COLORS.slate[700]} style={{ fontWeight: '700' }}>Penjualan Terbaru</Text>
                            <View />
                            <View style={{ gap: 20 }}>
                                { sales.map((sl, s) => (
                                    <Inline key={s} style={[styles.sales_item, styles.shadow]}>
                                        <View style={{ flexBasis: 10, flexGrow: 1,flexShrink: 1, gap: 10 }}>
                                            <Text size={14} style={{ fontWeight: '600' }}>{sl.invoice_number}</Text>
                                            <View style={{ gap: 6 }}>
                                                <Inline gap={10}>
                                                    <Ionicons name="person-outline" />
                                                    <Text size={12}>{sl.customer.name}</Text>
                                                </Inline>
                                                <Inline gap={10}>
                                                    <Ionicons name="time-outline" />
                                                    <Text size={12}>{dayjs(sl.created_at).format('DD MMMM YYYY, HH:mm:ss')}</Text>
                                                </Inline>
                                            </View>
                                        </View>
                                        <View style={{ gap: 5, alignItems: 'flex-end' }}>
                                            <Text size={20} color={COLORS.primary} style={{ fontWeight: '700' }}>x{sl.items[0].quantity}</Text>
                                            <Text size={11} color={COLORS.slate[500]}>pc(s)</Text>
                                        </View>
                                    </Inline>
                                ))}
                            </View>
                        </View>
                    }
                    { viewing === 'Stok' &&
                        <StockView product={product} user={user}  />
                    }
                    { viewing === 'Komposisi' &&
                        <ProductComposition
                            product={product} user={user}
                        />
                    }
                </View>
            </ScrollView>

            { showHeaderContext &&
                <View style={styles.context_menu}>
                    <Inline gap={10} style={styles.context_menu_item} onPress={() => {
                        setShowHeaderContext(false);
                        navigation.navigate('OwnerProductEdit', { product });
                    }}>
                        <Ionicons name="create-outline" size={20} />
                        <Text style={{ fontWeight: '500' }}>Edit Produk</Text>
                    </Inline>
                    <Inline gap={10} style={styles.context_menu_item} onPress={() => {
                        setShowHeaderContext(false);
                        setDeleting(true);
                    }}>
                        <Ionicons name="trash-outline" size={20} color={COLORS.red[500]} />
                        <Text style={{ fontWeight: '500' }} color={COLORS.red[500]}>Hapus Produk</Text>
                    </Inline>
                </View>
            }

            <Dialog visible={isDeleting} onClose={() => setDeleting(false)}>
                <Dialog.Title>
                    <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Hapus {product.name}?</Text>
                </Dialog.Title>
                <Dialog.Body>
                    <Text>Yakin ingin menghapus {product.name}? Tindakan ini akan menghapus semua data terkait dan tidak dapat dibatalkan.</Text>
                </Dialog.Body>
                <Dialog.Actions>
                    <Button color={COLORS.red[500]} onPress={del}>
                        {isDeletingProc ? <ActivityIndicator color={'#fff'} /> : 'Hapus'}
                    </Button>
                </Dialog.Actions>
            </Dialog>

            { showImage &&
                <ImageViewer 
                    index={imageIndex} setIndex={setImageIndex} 
                    product={product} 
                    setShowImage={setShowImage}
                />
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 20,
        gap: 20,
    },
    image: {
        // width: 60 / 100 * Dimensions.get('screen').width,
        // aspectRatio: 1,
        height: '100%',
        backgroundColor: "#fff"
    },
    context_menu: {
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 10,
        position: 'absolute',
        top: 5,right: 20,
        gap: 10,
    },
    context_menu_item: {
        padding: 5,
        paddingHorizontal: 12,
    },
    sales_item: {
        borderRadius: 12,
        padding: 20,
        backgroundColor: "#fff",
        gap: 10,
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    }
});

export default OwnerProductDetail;