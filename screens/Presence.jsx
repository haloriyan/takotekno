import React, { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { CameraView } from "expo-camera";
import * as Location from "expo-location";
import Grid from "@haloriyan/grid";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import dayjs from "dayjs";
import config from "../config";
import { useToast } from "react-native-toast-notifications";

const Presence = ({ navigation, route }) => {
    const [user] = useUser();
    const cameraRef = useRef(null);
    const [coords, setCoords] = useState(null);
    const [address, setAddress] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const toast = useToast();

    const [timer, setTimer] = useState({
        hour: '00', minute: '00', second: '00',
        date: '00'
    });

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('location not enabled');
        }

        let loc = await Location.getCurrentPositionAsync();
        setCoords(loc.coords);

        let addr = await getAddress(loc.coords.latitude, loc.coords.longitude);
        setAddress(addr);
    }
    const getAddress = async (lat, lng) => {
        const key = "69c4eb2535a89929985911rwtc680fb";
        const endpoint = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=${key}`;
        const response = await axios.get(endpoint);
        const res = response.data;

        return res.display_name;
    }

    useEffect(() => {
        getLocation();
    }, []);

    useEffect(() => {
        let int = setInterval(() => {
            let now = dayjs();
            setTimer(prev => ({
                hour: now.format('HH'),
                minute: now.format('mm'),
                second: now.format('ss'),
                date: now.format('YYYY-MM-DD')
            }));
        }, 1000);
    }, []);

    const check = async () => {
        if (isSubmitting) return;

        setSubmitting(true);
        try {
            let picture = await cameraRef.current.takePictureAsync();
            let photo = picture.uri;

            let formData = new FormData();
            formData.append('latitude', coords.latitude);
            formData.append('longitude', coords.longitude);
            formData.append('address', address);

            let photoFileName = photo.split('/').pop();
            let photoMatch = /\\.(\\w+)$/.exec(photoFileName);
            let type = photoMatch ? `image/${photoMatch[1]}` : 'image';
            formData.append('image', {
                uri: photo,
                name: photoFileName,
                type        
            });

            const response = await axios.post(`${config.base_url}/api/store/schedule/${timer.date}/present`, formData, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;

            Alert.alert(
                'Berhasil!', res.message,
                [{
                    text: "Kembali",
                    onPress: () => {
                        navigation.goBack()
                    }
                }]
            );
        } catch (err) {
            toast.show(err?.response?.data?.message, {
                placement: 'bottom',
                type: "danger",
                offset: 50
            })
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <React.Fragment>
            <CameraView
                ref={cameraRef}
                facing="front"
                style={styles.camera}
            />
            <View style={{ padding: 20, gap: 20 }}>
                <Inline justifyContent={'center'}>
                    <View style={{ gap: 5,flexGrow: 1,flexBasis: 20,flexShrink: 1 }}>
                        <Inline gap={5}>
                            <Ionicons name="time-outline" color={COLORS.slate[500]} />
                            <Text size={12}>Waktu</Text>
                        </Inline>
                        <Text size={20} color={COLORS.slate[700]} style={{ fontWeight: '700' }}>
                            {timer.hour}:{timer.minute}:{timer.second}
                        </Text>
                    </View>
                    <Button onPress={() => check()}>
                        { isSubmitting ? <ActivityIndicator color={'#fff'} size={14} /> : 'Cek-in' }
                    </Button>
                </Inline>
                <View style={{ gap: 5,marginTop: 5 }}>
                    <Inline gap={5}>
                        <Ionicons name="location-outline" color={COLORS.slate[500]} />
                        <Text size={12}>Lokasi</Text>
                    </Inline>
                    <View />
                    <Text>{address ?? '-'}</Text>
                    <Text size={10}>{coords?.latitude ?? '-'}, {coords?.longitude ?? '-'}</Text>
                </View>
            </View>

        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    camera: {
        width: '100%',
        aspectRatio: 1,
    }
})

export default Presence;