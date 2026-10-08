import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS, Inline, Input, Text } from "ripal-ui";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import axios from "axios";

const OnboardingStore = ({ setStep, name, setName, icon, setIcon, submit }) => {
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [address, setAddress] = useState('');

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
            aspect: [1,1],
            allowsEditing: true,
        });

        if (result.canceled) return;

        setIcon(result.assets[0].uri);
    }

    const getAddress = async (lat, lng) => {
        const key = "69c4eb2535a89929985911rwtc680fb";
        const endpoint = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=${key}`;
        const response = await axios.get(endpoint);
        const res = response.data;

        return res.display_name;
    }

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('location not enabled');
                
                return;
            }

            let theLocation = await Location.getCurrentPositionAsync({});
            let lat = theLocation.coords.latitude;
            let lng = theLocation.coords.longitude;
            setLocation(theLocation);
            setLatitude(lat);
            setLongitude(lng);

            let theAddress = await getAddress(lat, lng);
            setAddress(theAddress);
            
        }

        getLocation();
    }, []);

    return (
        <>
            <Text size={32} style={{fontWeight: '800'}} color={COLORS.slate[800]}>Berikan sedikit detail dari tokomu.</Text>
            <View />
            <TouchableOpacity style={[styles.icon, styles.icon_area]} onPress={pickImage}>
                {
                    icon === null ?
                    <>
                    <Ionicons name="image-outline" size={24} />
                    <Text size={11}>Logo</Text>
                    </>
                    :
                    <Image style={styles.icon} source={{uri: icon}} />
                }
            </TouchableOpacity>
            <View style={{ flexGrow: 0, flexShrink: 1,width: '100%',marginTop: 10}}>
                <Input label="Tokomu namanya apa?" value={name} onChangeText={e => setName(e)} containerStyle={{flexGrow: 0, width: '100%'}}  />
            </View>

            <Inline style={styles.action_area}>
                {/* <Text size={11} >Langkah 1 dari 2</Text> */}
                <View style={{ flexGrow: 1 }} />
                <Inline gap={10} onPress={() => submit({
                    latitude, longitude, address
                })}>
                    <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Buka Toko</Text>
                    <Ionicons name="arrow-forward-outline" size={18} />
                </Inline>
            </Inline>
        </>
    )
}

const styles = StyleSheet.create({
    icon_box: {
        width: '20%',
        aspectRatio: 1/1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    action_area: {
        position: 'absolute',
        bottom: 30,left: 20,right: 20,
    },
    icon_area: {
        backgroundColor: COLORS.slate[200],
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    icon: {
        width: 128,
        height: 128,
        borderRadius: 12,
    }
})

export default OnboardingStore;