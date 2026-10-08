import { Ionicons } from "@expo/vector-icons";
import Grid from "@haloriyan/grid";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";

const OwnerMoreScheduleDetail = ({ navigation, route }) => {
    const [schedule, setSchedule] = useState(route.params.schedule);
    const [showContext, setShowContext] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button circle color="#fff" onPress={() => {
                    setShowContext(true);
                }}>
                    <Ionicons name="ellipsis-horizontal-outline" color={COLORS.slate[600]} size={20} />
                </Button>
            )
        });
    }, [navigation]);

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} onTouchStart={e => setShowContext(false)}>
                <Grid gap={10}>
                    <Inline style={[styles.card, styles.shadow]}>
                        <View style={{ flexGrow: 1,flexBasis: 10,flexShrink: 1, gap: 5}}>
                            <Text size={24} style={{ fontWeight: '800' }}>{schedule.check_in_count}</Text>
                            <Text size={11}>Telah Hadir</Text>
                        </View>
                        <Ionicons name="people-outline" size={24} color={COLORS.slate[500]} />
                    </Inline>
                    <Inline style={[styles.card, styles.shadow]}>
                        <View style={{ flexGrow: 1,flexBasis: 10,flexShrink: 1, gap: 5}}>
                            <Text size={24} style={{ fontWeight: '800' }} color={
                                schedule.avg_in >= 0 ? COLORS.green[500] : COLORS.red[500]
                            }>{schedule.avg_in}m</Text>
                            <Text size={11}>Ketepatan Waktu</Text>
                        </View>
                        <Ionicons name="time-outline" size={24} color={COLORS.slate[500]} />
                    </Inline>
                </Grid>

                <View />

                <View style={{ gap: 20 }}>
                    { schedule.users.map((item, i) => (
                        <Inline key={i} style={[styles.card, styles.shadow]} gap={10} onPress={() => {
                            navigation.navigate('OwnerMoreScheduleDetailMore', {
                                item: item,
                                schedule: schedule,
                            });
                        }}>
                            <Button circle color={item.user.color}>
                                <Ionicons name="person-outline" size={16} color={'#fff'} />
                            </Button>
                            <View style={{ flexGrow: 1,flexBasis: 100,flexShrink: 1 }}>
                                <Text style={{ fontWeight: '700' }}>{item.user.name}</Text>
                            </View>
                            <View style={{ gap: 5,width: '20%' }}>
                                <Text size={11}>Masuk</Text>
                                <Text size={18} style={{ fontWeight: '600' }}>
                                    {dayjs(item.check_in_at).isValid()
                                        ? dayjs(item.check_in_at).format('HH:mm')
                                        : '-'}
                                </Text>
                            </View>
                            <View />
                            <View style={{ gap: 5,width: '20%' }}>
                                <Text size={11}>Pulang</Text>
                                <Text size={18} style={{ fontWeight: '600' }}>
                                    {dayjs(item.check_out_at).isValid()
                                        ? dayjs(item.check_out_at).format('HH:mm')
                                        : '-'}
                                </Text>
                            </View>
                        </Inline>
                    ))}
                </View>
            </ScrollView>

            { showContext &&
                <View style={[styles.context_menu, styles.shadow]}>
                    <Inline style={styles.context_menu_item} gap={10}>
                        <Ionicons name="trash-outline" color={COLORS.red[500]} />
                        <Text size={12} style={{ fontWeight: '600' }}>Hapus</Text>
                    </Inline>
                </View>
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
    context_menu: {
        backgroundColor: "#fff",
        position: 'absolute',
        top: 20,right: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    context_menu_item: {
        padding: 8,
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        gap: 10,
    }
});

export default OwnerMoreScheduleDetail;