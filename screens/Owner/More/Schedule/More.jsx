import React, { useState } from "react";
import useUser from "../../../../hooks/useUser";
import { Button, COLORS, Inline, Text, Toggle } from "ripal-ui";
import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Grid from "@haloriyan/grid";
import dayjs from "dayjs";
import config from "../../../../config";

const OwnerMoreScheduleDetailMore = ({ navigation, route }) => {
    const [user] = useUser();
    const [item, setItem] = useState(route.params.item);
    const [schedule, setSchedule] = useState(route.params.schedule);
    const [viewing, setViewing] = useState({key: "in", label: "Masuk"});

    const IS_IN_LATE = item?.check_in_diff <= 0;
    const IS_OUT_EARLY = item?.check_out_diff > 0;
    const minutes = Number(item.in_out_diff);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const [image, setImage] = useState(null);

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <Inline>
                    <Button circle color={item.user.color} size={64}>
                        <Ionicons name="person-outline" size={20} color={'#fff'} />
                    </Button>
                    <View style={{ flexShrink: 1, flexBasis: 20,flexGrow: 1,gap: 5}}>
                        <Text size={18} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{item.user.name}</Text>
                        <Inline gap={5}>
                            <Ionicons name="calendar-outline" />
                            <Text size={12}>{schedule?.label}</Text>
                        </Inline>
                    </View>
                    <View style={{ gap: 5 }}>
                        <Text size={11}>Durasi</Text>
                        <Text size={16} style={{ fontWeight: '600' }} color={COLORS.slate[700]}>
                            {hours} jam {remainingMinutes}m
                        </Text>
                    </View>
                </Inline>

                <View style={[styles.card, styles.shadow]}>
                    <Grid gap={10}>
                        <View style={{ gap: 5 }}>
                            <Text size={12}>Masuk</Text>
                            <Text size={18} style={{ fontWeight: '600' }}>
                                {dayjs(item.check_in_at).isValid()
                                    ? dayjs(item.check_in_at).format('HH:mm')
                                    : '-'}
                            </Text>
                            <View />
                            <Text size={11} color={IS_IN_LATE ? COLORS.red[500] : COLORS.green[500]}>
                                {item.check_in_diff} menit <Text>{ IS_IN_LATE ? 'terlambat' : 'lebih cepat'}</Text>
                            </Text>
                        </View>
                        <View style={{ gap: 5 }}>
                            <Text size={12}>Pulang</Text>
                            <Text size={18} style={{ fontWeight: '600' }}>
                                {dayjs(item.check_out_at).isValid()
                                    ? dayjs(item.check_out_at).format('HH:mm')
                                    : '-'}
                            </Text>
                            <View />
                            <Text size={11} color={IS_OUT_EARLY ? COLORS.red[500] : COLORS.green[500]}>
                                {item.check_out_diff} menit <Text>{ IS_OUT_EARLY ? 'lebih awal' : 'lebih lama'}</Text>
                            </Text>
                        </View>
                    </Grid>
                </View>

                <View />

                <Toggle
                    options={[
                        {key: "in", label: "Masuk"},
                        {key: "out", label: "Pulang"}
                    ]}
                    objectKey={"label"}
                    value={viewing} setValue={setViewing}
                />

                <Inline>
                    <TouchableOpacity style={styles.image} onPress={() => {
                        setImage(`${config.base_url}/storage/presence_photos/${schedule.store_id}/${item[`check_${viewing.key}_image`]}`);
                    }}>
                        <Image
                            style={{...styles.image, width: '100%'}}
                            source={{ uri: `${config.base_url}/storage/presence_photos/${schedule.store_id}/${item[`check_${viewing.key}_image`]}` }}
                        />
                    </TouchableOpacity>
                    <View style={{ flexGrow: 1,flexShrink: 1, flexBasis: 1, gap: 5}}>
                        <Inline gap={5}>
                            <Ionicons name="location-outline" />
                            <Text size={11}>Lokasi</Text>
                        </Inline>
                        <View />

                        <Text color={COLORS.slate[800]} style={{ fontWeight: '500' }}>{item[`check_${viewing.key}_address`]}</Text>
                        <Text size={10}>
                            {item[`check_${viewing.key}_latitude`]}, {item[`check_${viewing.key}_longitude`]}
                        </Text>
                    </View>
                </Inline>
            </ScrollView>

            { image !== null &&
                <Pressable style={styles.viewer} onPress={() => setImage(null)}>
                    <Image
                        source={{ uri: image }}
                        style={{
                            width: '100%',
                            aspectRatio: 1,
                        }}
                    />
                    <View />
                    <Button color="#fff" onPress={() => {
                        setImage(null);
                    }}>
                        <Text color={COLORS.slate[700]} style={{ fontWeight: '700' }}>Tutup</Text>
                    </Button>
                </Pressable>
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
        padding: 20,
        borderRadius: 12,
    },
    image: {
        backgroundColor: "#eee",
        borderRadius: 12,
        width: '30%',
        aspectRatio: 1,
    },
    viewer: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
        backgroundColor: "#000000",
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 20,
    }
});

export default OwnerMoreScheduleDetailMore;