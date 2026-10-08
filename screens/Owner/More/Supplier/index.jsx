import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, COLORS, Dialog, Inline, Text } from "ripal-ui";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import config from "../../../../config";
import StateView from "../../Product/StateView";
import { Feather, Ionicons } from "@expo/vector-icons";
import useUser from "../../../../hooks/useUser";

const Item = ({ supplier, setSupplier, setDeleting, navigation, user = null }) => {
    return (
        <View style={styles.item}>
            <View style={styles.item_inner}>
                <Inline gap={15}>
                    <View style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: COLORS.primary[100], alignItems: 'center', justifyContent: 'center' }}>
                        { supplier.icon !== null ?
                            <Image 
                                source={{ uri: `${config.base_url}/storage/supplier_icons/${supplier.icon}` }} 
                                style={{
                                    width: 64,height: 64,
                                    borderRadius: 8,
                                }}
                            />
                            :
                            <Feather name="truck" size={20} color={COLORS.primary} />
                        }
                    </View>
                    <View style={{ flexGrow: 1, flexShrink: 1, gap: 5,flexBasis: 10 }}>
                        <Text style={{ fontWeight: '600' }}>{supplier.name}</Text>
                        <Text size={11}>{supplier.address || '-'}</Text>
                    </View>

                    <Inline gap={10}>
                        <Button circle color={COLORS.primary} onPress={() => {
                            navigation.navigate('OwnerMoreSupplierEdit', { supplier: supplier });
                        }}>
                            <Ionicons name="create-outline" color={'#fff'} size={18} />
                        </Button>

                        <Button circle color={COLORS.red[500]} onPress={() => {
                            setSupplier(supplier);
                            setDeleting(true);
                        }}>
                            <Ionicons name="trash-outline" color={'#fff'} size={18} />
                        </Button>
                    </Inline>
                </Inline>
            </View>
        </View>
    )
}

const OwnerMoreSupplier = ({ user = null }) => {
    const userHook = useUser();
    const currentUser = user || userHook[0];
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [supplier, setSupplier] = useState(null);
    const navigation = useNavigation();

    const [isDeleting, setDeleting] = useState(false);
    const [isDeletingProc, setDeletingProc] = useState(false);

    const load = async () => {
        if (isLoading) return;
        setLoading(true);

        try {
            const response = await axios.get(`${config.base_url}/api/store/supplier`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            let res = response.data;
            setSuppliers(res.suppliers.data);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setLoading(false);
            setLoaded(true);
        }
    }

    useEffect(() => {
        if (isFocused && currentUser !== null) {
            load();
        }
    }, [currentUser, isFocused]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button circle onPress={() => navigation.navigate('OwnerMoreSupplierAdd')}>
                    <Ionicons name="add" color={'#fff'} size={20} />
                </Button>
            )
        })
    }, []);

    const del = async () => {
        if (isDeletingProc) return;
        setDeletingProc(true);

        try {
            const response = await axios.get(`${config.base_url}/api/store/supplier/${supplier.id}/delete`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            
            load();
            setDeleting(false);
            setSupplier(null);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setDeletingProc(false);
        }
    }

    return (
        <React.Fragment>
            { isLoaded && suppliers.length === 0 &&
                <StateView 
                    icon={<Feather name="truck" size={128} color={COLORS.primary} />}
                    title={"Belum ada supplier."}
                    action={
                        <Button onPress={() => navigation.navigate('OwnerMoreSupplierAdd')}>Tambahkan</Button>
                    }
                />
            }
            { isLoaded && suppliers.length > 0 &&
                <ScrollView contentContainerStyle={styles.container} refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={async () => {
                        await load();
                    }} />
                }>
                    { suppliers.map((sup, i) => (
                        <Item 
                            key={sup.id} supplier={sup} 
                            setSupplier={setSupplier} setDeleting={setDeleting} 
                            navigation={navigation} 
                            user={currentUser}
                        />
                    ))}
                </ScrollView>
            }

            { supplier !== null &&
                <Dialog visible={isDeleting} onClose={() => setDeleting(false)}>
                    <Dialog.Title>
                        <Text size={16} style={{ fontWeight: '600' }}>Hapus {supplier.name}</Text>
                    </Dialog.Title>
                    <Dialog.Body>
                        <Text>Yakin ingin menghapus {supplier.name}?</Text>
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
    item: {
        backgroundColor: "#fff",
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
        borderRadius: 20,
    },
    item_inner: {
        padding: 20,
    },
});

export default OwnerMoreSupplier;
