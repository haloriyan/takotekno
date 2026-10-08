import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { COLORS, Inline, Text } from "ripal-ui";
import useUser from "../../../../hooks/useUser";
import axios from "axios";
import config from "../../../../config";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { Table } from "@coligo/react-native-table";

const OwnerReportMovementDetail = ({ navigation, route }) => {
    const { product } = route.params;
    const [user] = useUser();
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [raw, setRaw] = useState(null);
    const [movements, setMovements] = useState([]);
    const [startDate, setStartDate] = useState(
        dayjs(route.params.startDate)
    );
    const [endDate, setEndDate] = useState(
        dayjs(route.params.endDate)
    );
    
    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            const response = await axios.get(
                `${config.base_url}/api/store/report/movement-detail/${product.id}?start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}&page=${page}`
            , {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
            
            setMovements(res.movements);
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
    }, [user]);

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: "#fff" }}>
                <Inline alignItems="flex-start" style={{ padding: 20 }}>
                    <View style={styles.image}>
                        { product.images.length === 0 ?
                            <Ionicons name="image-outline" color={COLORS.slate[800]} size={20} />
                            :
                            <Image style={styles.image} source={{ uri: `${config.base_url}/storage/${product.store_id}/product_images/${product.id}/${product.images[0].filename}` }} />
                        }
                    </View>
                    <View style={{ flexGrow: 1,flexBasis: 10,flexShrink: 1,gap: 12 }}>
                        <Text size={18} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{product.name}</Text>
                        <Inline gap={10}>
                            <View style={{ flexGrow: 1,flexBasis: 10,flexShrink: 1,gap: 5 }}>
                                <Text size={12}>Masuk</Text>
                                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{product.movement_in ?? product.inbound}</Text>
                            </View>
                            <View style={{ flexGrow: 1,flexBasis: 10,flexShrink: 1,gap: 5 }}>
                                <Text size={12}>Keluar</Text>
                                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{product.movement_out ?? product.outbound}</Text>
                            </View>
                            <View style={{ flexGrow: 1,flexBasis: 10,flexShrink: 1,gap: 5 }}>
                                <Text size={12}>Opname</Text>
                                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{product.movement_opn ?? product.opname}</Text>
                            </View>
                        </Inline>
                    </View>
                </Inline>

                <View style={{ width: '100%',padding: 20, }}>
                     <Table
                         data={movements}
                         columns={[
                            { label: "Tanggal", key: "date", render: (item, rowData) => (
                                <Text>{dayjs(item).format('DD MMM YYYY')}</Text>
                            ) },
                            { label: "Masuk", key: "in" },
                            { label: "Keluar", key: "out" },
                            { label: "Opname", key: "opn" },
                        ]}
                        keyExtractor={'date'}
                        borderStyle={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            showHorizontalHeader: true,
                        }}
                        cellPadding={{
                            paddingVertical: 10,
                        }}
                    />
                </View>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flexGrow: 1,
    },
    image: {
        borderRadius: 12,
        width: 86,
        height: 86,
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center"
    }
});

export default OwnerReportMovementDetail;