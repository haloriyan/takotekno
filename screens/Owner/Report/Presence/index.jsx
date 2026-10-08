import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import config from "../../../../config";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { Table } from '@coligo/react-native-table';
import Grid from "@haloriyan/grid";

const OwnerReportPresence = ({ user, setOnReload, startDate, endDate, isLoading, setLoading }) => {
    const [dates, setDates] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [tableData, setTableData] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const rootRef = useRef(null);
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            const response = await axios.get(`${config.base_url}/api/store/report/presence?start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}`, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
            setDates(res.dates);

            setTableData(res.table_data);

            let theTableColumns = [
                {label: "Nama", key: "name", width: 140, render: item => <Text size={13} color="#fff">{item}</Text>}
            ];
            res.table_columns.forEach((col, c) => {
                theTableColumns.push({
                    ...col,
                    render: item => <Button circle 
                        color={item.status ? COLORS.green[500] : item.status === null ? COLORS.slate[200] : COLORS.red[500]} 
                        style={{
                            borderRadius: 89
                        }}
                        size={20}
                        onPress={e => {
                            const { locationX, locationY, pageX, pageY } = e.nativeEvent;
                            rootRef.current?.measure((fx, fy, width, height, px, py) => {
                                const left = pageX - px + locationX + 12;
                                const top = pageY - py + locationY + 12;

                                setContextMenu({
                                    top: Math.max(12, Math.min(top, screenHeight - 150)),
                                    left: Math.max(12, Math.min(left, screenWidth - 200)),
                                    item,
                                });
                            });
                        }}
                    >
                        <Ionicons 
                            size={16}
                            name={item.status ? "checkmark" : item.status === null ? "remove" : "close-outline"}
                            color={item.status === null ? COLORS.slate[700] : "#fff"}
                        />
                    </Button>
                })
            });
            
            setTableColumns(theTableColumns);
            
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [startDate, endDate]);
    

    return (
        <View ref={rootRef} style={styles.container}>
            <View style={{ paddingHorizontal: 20,marginTop: 20 }}>
                <Grid col={3}>
                    <Inline gap={10}>
                        <Button circle size={10} style={{ borderRadius: 4 }} color={COLORS.green[500]}></Button>
                        <Text size={12}>Masuk</Text>
                    </Inline>
                    <Inline gap={10}>
                        <Button circle size={10} style={{ borderRadius: 4 }} color={COLORS.red[500]}></Button>
                        <Text size={12}>Absen</Text>
                    </Inline>
                    <Inline gap={5}>
                        <Button circle size={10} style={{ borderRadius: 4 }} color={COLORS.slate[500]}></Button>
                        <Text size={12}>Tidak ada jadwal</Text>
                    </Inline>
                </Grid>
            </View>
            { tableData !== null &&
                <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20 }} onScroll={e => {
                        // let pos = e.nativeEvent.contentOffset.x;
                    }}>
                        <View />
                        <Table
                            borderStyle={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                showHorizontalHeader: true
                            }}
                            cellPadding={{
                                paddingVertical: 10,
                            }}
                            columns={tableColumns}
                            data={tableData}
                            keyExtractor={"name"}
                        />
                        <View />
                    </ScrollView>
                    <View style={{
                        position: "absolute",
                        left: 0,
                        paddingLeft: 20,
                        width: 136,
                        backgroundColor: "#fff"
                    }}>
                        <View style={{ paddingVertical: 10,borderBottomWidth: 1,borderBottomColor: "#ddd" }}>
                            <Text size={14} style={{ fontWeight: '700' }}>Nama</Text>
                        </View>
                        { tableData.map((data, d) => (
                            <View key={d} style={{ paddingVertical: 12 }}>
                                <Text size={14}>{data.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            }

            { contextMenu !== null &&
                <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                    <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={() => setContextMenu(null)} />
                    <View style={{
                        position: "absolute",
                        top: contextMenu.top,
                        left: contextMenu.left,
                        width: 180,
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 4,
                        overflow: "hidden",
                        padding: 14,
                        gap: 10,
                    }}>
                        { contextMenu?.item.schedule === null ?
                            <Text>Tidak ada jadwal</Text>
                            :
                            <>
                            <Inline gap={5}>
                                <Text size={12}>Masuk</Text>
                                <View style={{ flexGrow: 1 }} />
                                <Text style={{ fontWeight: '600' }}>{ contextMenu?.item.schedule.check_in_at ? dayjs(contextMenu?.item.schedule.check_in_at).format('HH:mm') : '-' }</Text>
                            </Inline>
                            <Inline gap={5}>
                                <Text size={12}>Pulang</Text>
                                <View style={{ flexGrow: 1 }} />
                                <Text style={{ fontWeight: '600' }}>{ contextMenu?.item.schedule.check_out_at ? dayjs(contextMenu?.item.schedule.check_out_at).format('HH:mm') : '-' }</Text>
                            </Inline>
                            </>
                        }
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // padding: 20,
        gap: 20,
        flexGrow: 1
    },
    item: {
        gap: 10,
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 1,
    },
    schedule_item: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        gap: 5,
    },
    context_menu: {
        position: "absolute",
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    }
})

export default OwnerReportPresence;