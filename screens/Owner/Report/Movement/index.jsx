import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TextInput, View, Share, Pressable } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import config from "../../../../config";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useDebounce } from "use-debounce";
import Slug from "../../../../lib/Slug";
import dayjs from "dayjs";

const OwnerReportMovement = ({ user, startDate, endDate, isLoading, setLoading, setOnReload, setOnDownload, q, setQ }) => {
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();

    const [qDebounce] = useDebounce(q, 1000);

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            console.log(q);
            
            const response = await axios.get(`${config.base_url}/api/store/report/movement?q=${q}&start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}`, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;

            setProducts(res.products);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [qDebounce]);

    useEffect(() => {
        if (user) {
            load();
        }
    }, [user]);

    const downloadReport = async () => {
        const timestamp = dayjs().format('DD_MMMM_YYYY_HH:mm:ss');
        const filename = "Pergerakan_Stok_" + Slug(user.access.store.name, '_') + "-Exported_at_" + timestamp + ".xlsx";
        const fileUri = FileSystem.cacheDirectory + filename;
        let endpoint = `${config.base_url}/api/store/report/movement/export?start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}`;
        let download = await FileSystem.downloadAsync(
            endpoint, fileUri, {
                headers: { Authorization: `Bearer ${user.token}`}
            }
        );
        
        await Sharing.shareAsync(fileUri);
    }

    useEffect(() => {
        setOnReload(
            () => 
                () => {
                    load();
                }
        );
        setOnDownload(
            () => 
                () => {
                    downloadReport();
                }
        );
    }, []);

    return (
        <View style={{ padding: 20, gap: 15 }}>
            <Inline style={[styles.header, styles.shadow]} gap={10}>
                <Ionicons name="search-outline" size={20} color={COLORS.slate[500]} />
                <TextInput style={styles.header_search} value={q} placeholder="Cari" onChangeText={e => {
                    setQ(e);
                }} />
                <Button color={COLORS.green[500]} style={{
                    marginVertical: 10,
                    padding: 0,
                    height: 38, gap: 10
                }} onPress={() => {
                    downloadReport();
                }}>
                    <Feather name="download" color={'#fff'} />
                    <Text size={12} color="#fff" style={{ fontWeight: '700' }}>Unduh</Text>
                </Button>
            </Inline>

            { products.map((prod, p) => (
                <Inline key={p} style={styles.item} onPress={() => {
                    navigation.navigate('OwnerReportMovementDetail', {
                        product: prod,
                        startDate, endDate
                    })
                }}>
                    <View style={styles.image}>
                        { prod.images.length === 0 ?
                            <Ionicons name="image-outline" size={20} color={COLORS.slate[800]} />
                            :
                            <Image
                                source={{ uri: `${config.base_url}/storage/${prod.store_id}/product_images/${prod.id}/${prod.images[0].filename}` }}
                                style={styles.image}
                            />
                        }
                    </View>
                    <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 10,gap: 8 }}>
                        <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{prod.name}</Text>
                        <Inline gap={10}>
                            <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 10,gap: 2 }}>
                                <Inline gap={5}>
                                    <Ionicons name="download-outline" />
                                    <Text size={11}>Masuk</Text>
                                </Inline>
                                <Text style={{ fontWeight: '600' }}>{prod.movement_in}</Text>
                            </View>
                            <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 10,gap: 2 }}>
                                <Inline gap={5}>
                                    <Ionicons name="download-outline" style={{ transform: [{ rotate: '180deg' }] }} />
                                    <Text size={11}>Keluar</Text>
                                </Inline>
                                <Text style={{ fontWeight: '600' }}>{prod.movement_out}</Text>
                            </View>
                            <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 10,gap: 2 }}>
                                <Text size={11}>Opname</Text>
                                <Text style={{ fontWeight: '600' }}>{prod.movement_opn}</Text>
                            </View>
                        </Inline>
                    </View>
                </Inline>
            ))}
            <View style={{ height: 80 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#ddd",
        shadowOffset: { width: 1,height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: "#eee",
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        borderRadius: 9999,
    },
    header_search: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 100,
        height: 48
    },
    shadow: {
        elevation: 8,
        shadowColor: '#ddd',
        shadowOffset: { width: 1, height: 1, },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
});

export default OwnerReportMovement;