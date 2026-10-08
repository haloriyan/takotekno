import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, COLORS, Dialog, Inline, Text } from "ripal-ui";
import Initial from "../../../../lib/Initial";
import axios from "axios";
import config from "../../../../config";
import useUser from "../../../../hooks/useUser";
import Currency from "../../../../lib/Currency";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import Grid from "@haloriyan/grid";

const OwnerMoreCustomerDetail = ({ navigation, route }) => {
    const [customer, setCustomer] = useState(route.params?.customer);
    const [user] = useUser();
    const [sales, setSales] = useState([]);
    const [showHeaderContext, setShowHeaderContext] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const [isDeletingProc, setDeletingProc] = useState(false);
    const [products, setProducts] = useState([]);

    const load = async () => {
        try {
            const response = await axios.get(`${config.base_url}/api/store/customer/${customer.id}/detail`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            let res = response.data;

            setSales(res.sales);
            setCustomer(res.customer);
            setProducts(res.products);
            
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        }
    }

    useEffect(() => {
        if (user !== null) {
            load();
        }
    }, [user]);

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
        navigation.setOptions({
            headerTitle: customer.name,
        })
    }, [navigation, customer]);

    const del = async () => {
        if (isDeletingProc) return;
        setDeletingProc(true);

        try {
            await axios.get(`${config.base_url}/api/store/customer/${customer.id}/delete`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            
            navigation.goBack();
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setDeletingProc(false);
        }
    }

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} onScroll={e => {
                setShowHeaderContext(false);
            }}>
                <View style={{ alignItems: 'center', gap: 5 }}>
                    <Button circle size={64}>
                        <Text size={18} color="#fff" style={{ fontWeight: '800' }}>{Initial(customer.name)}</Text>
                    </Button>
                    <View />
                    <Text size={18} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{customer.name}</Text>
                    <Text size={11}>{customer.point} poin</Text>
                </View>

                <View />

                <Text color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Favorit</Text>
                { products.length > 0 ?
                    <Grid col={3}>
                        <View style={{ alignItems: 'center', gap: 5 }}>
                            <Image
                                style={{ backgroundColor: "#eee",width: '100%',aspectRatio: 1,borderRadius: 12 }}
                                source={{ uri: `${config.base_url}/storage/${products[0].product.store_id}/product_images/${products[0].product.id}/${products[0].product.images[0].filename}`} }
                            />
                            <View /><View />
                            <Text color={COLORS.slate[800]} style={{ fontWeight: '700' }}>{products[0].product.name}</Text>
                            <Text size={11}>{products[0].total_quantity} pc(s)</Text>
                        </View>
                        <View style={{ alignItems: 'center', gap: 5 }}>
                            <Image
                                style={{ backgroundColor: "#eee",width: '100%',aspectRatio: 1,borderRadius: 12 }}
                                source={{ uri: `${config.base_url}/storage/${products[0].product.store_id}/product_images/${products[1].product.id}/${products[1].product.images[0].filename}`} }
                            />
                            <View /><View />
                            <Text color={COLORS.slate[800]} style={{ fontWeight: '700' }}>{products[1].product.name}</Text>
                            <Text size={11}>{products[1].total_quantity} pc(s)</Text>
                        </View>
                        <View style={{ alignItems: 'center', gap: 5 }}>
                            <Image
                                style={{ backgroundColor: "#eee",width: '100%',aspectRatio: 1,borderRadius: 12 }}
                                source={{ uri: `${config.base_url}/storage/${products[0].product.store_id}/product_images/${products[2].product.id}/${products[2].product.images[0].filename}`} }
                            />
                            <View /><View />
                            <Text color={COLORS.slate[800]} style={{ fontWeight: '700' }}>{products[2].product.name}</Text>
                            <Text size={11}>{products[2].total_quantity} pc(s)</Text>
                        </View>
                    </Grid>
                    :
                    <Text align={'center'}>Belum ada produk favorit</Text>
                }

                <View />

                <Text color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Transaksi terbaru</Text>
                <View style={[styles.card, styles.shadow]}>
                    { sales.map((sale, s) => (
                        <Inline key={s}>
                            <View style={{ flexGrow: 1, flexShrink: 1,flexBasis: 10, gap: 5 }}>
                                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{sale.invoice_number}</Text>
                                <Text size={11} color={COLORS.primary}>{Currency(sale.total_price).encode()}</Text>
                            </View>
                            <Text size={10} color={COLORS.slate[400]}>
                                {dayjs(sale.created_at).fromNow()}
                            </Text>
                        </Inline>
                    ))}
                </View>
            </ScrollView>

            { showHeaderContext &&
                <View style={[styles.context_menu, styles.shadow]}>
                    {/* <Inline gap={10} style={styles.context_menu_item} onPress={() => {
                        setShowHeaderContext(false);
                        navigation.navigate('OwnerProductEdit', { product });
                    }}>
                        <Ionicons name="create-outline" size={20} />
                        <Text style={{ fontWeight: '500' }}>Edit Produk</Text>
                    </Inline> */}
                    <Inline gap={10} style={styles.context_menu_item} onPress={() => {
                        setShowHeaderContext(false);
                        setDeleting(true);
                    }}>
                        <Ionicons name="trash-outline" size={20} color={COLORS.red[500]} />
                        <Text style={{ fontWeight: '500' }} color={COLORS.red[500]}>Hapus</Text>
                    </Inline>
                </View>
            }

            { isDeleting &&
                <Dialog visible={isDeleting} onClose={() => setDeleting(false)}>
                    <Dialog.Title>
                        <Text size={16} style={{ fontWeight: '600' }}>Hapus {customer.name}</Text>
                    </Dialog.Title>
                    <Dialog.Body>
                        <Text>Yakin ingin menghapus {customer.name}?</Text>
                    </Dialog.Body>
                    <Dialog.Actions>
                        { isDeletingProc ? <ActivityIndicator color={'#fff'} /> : <Button color={COLORS.red[500]} onPress={del}>Hapus</Button>}
                    </Dialog.Actions>
                </Dialog>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        backgroundColor: "#fff",
        gap: 20,
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 10,
        zIndex: 10,
        padding: 20,
        gap: 20,
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
});

export default OwnerMoreCustomerDetail;