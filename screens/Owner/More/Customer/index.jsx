import React, { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import useUser from "../../../../hooks/useUser";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import config from "../../../../config";
import Initial from "../../../../lib/Initial";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDebouncedCallback } from "use-debounce";

const OwnerMoreCustomer = ({ navigation, route }) => {
    const [user] = useUser();
    const [isLoading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(1);
    const [raw, setRaw] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [q, setQ] = useState('');

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            if (page === 1) {
                setCustomers([]);
            }
            
            const response = await axios.get(`${config.base_url}/api/store/customer?page=${page}&q=${q}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            setRaw(res.customers);
            setCustomers(prev => [...prev, ...res.customers.data]);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user !== null) {
            load();
        }
    }, [user, page]);

    const debounceSearch = useDebouncedCallback(() => {
        setPage(1);
        load();
    }, 1000);

    // useEffect(() => {
    //     if (isFocused) {
    //         // 
    //     }
    // }, [isFocused]);

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    setPage(1);
                }} />
            }>
                <Inline style={styles.search_box} gap={10}>
                    <Ionicons name="search-outline" size={18} />
                    <TextInput style={styles.search_input} value={q} onChangeText={e => {
                        setQ(e);
                        debounceSearch();
                    }} placeholder="Cari pelanggan" />
                    {
                        q !== "" &&
                        <Pressable onPress={() => {
                            setQ('');
                            debounceSearch();
                        }}>
                            <Ionicons name="close" color={COLORS.slate[800]} size={18} />
                        </Pressable>
                    }
                </Inline>
                <View />
                { customers.map((cust, c) => (
                    <Inline key={c} style={styles.item} onPress={() => {
                        navigation.navigate('OwnerMoreCustomerDetail', {
                            customer: cust,
                        })
                    }}>
                        <Button circle>
                            <Text color="#fff" style={{ fontWeight: '700' }}>{Initial(cust.name)}</Text>
                        </Button>
                        <View style={{ flexGrow: 1,flexBasis: 10,flexShrink: 1, gap: 5 }}>
                            <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{cust.name}</Text>
                            <Inline gap={20}>
                                <Inline gap={5}>
                                    <Ionicons name="bag-outline" />
                                    <Text size={11}>{cust.sales.length} transaksi</Text>
                                </Inline>
                                <Inline gap={5}>
                                    <Text size={11} color={COLORS.primary}>{cust.point} poin</Text>
                                </Inline>
                            </Inline>
                        </View>
                        <MaterialIcons name="east" size={18} color={COLORS.slate[500]} />
                    </Inline>
                ))}

                { raw?.next_page_url !== null &&
                    <>
                    <View />
                    <Button accent="secondary" style={{ width: '100%' }} onPress={() => {
                        setPage(prev => prev + 1);
                    }}>Lainnya</Button>
                    </>
                }
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 20,
        flexGrow: 1,
        gap: 20,
    },
    search_box: {
        backgroundColor: COLORS.slate[100],
        borderRadius: 12,
        padding: 5,
        paddingHorizontal: 15,
    },
    search_input: {
        flexGrow: 1,
        height: 40,
    }
});

export default OwnerMoreCustomer;