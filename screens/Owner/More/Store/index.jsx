import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Input, Text, Toggle } from "ripal-ui";
import useUser from "../../../../hooks/useUser";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import config from "../../../../config";
import * as ImagePicker from "expo-image-picker";
import * as WebBrowser from "expo-web-browser";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import LocalStore from "../../../../lib/LocalStore";
import MapView, { Marker } from "react-native-maps";

const OwnerMoreStore = ({ navigation, route }) => {
    const [user, setUser] = useUser();
    const [store, setStore] = useState(null);
    const [icon, setIcon] = useState(null);
    const [canSubmit, setCanSubmit] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [address, setAddress] = useState('');
    const [showMap, setShowMap] = useState(false);
    const mapRef = useRef(null);

    const getAddress = async (lat, lng) => {
        const key = "69c4eb2535a89929985911rwtc680fb";
        const endpoint = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=${key}`;
        const response = await axios.get(endpoint);
        const res = response.data;

        return res.display_name;
    }

    useEffect(() => {
        mapRef?.current?.animateToRegion({
            latitude, longitude,
            latitudeDelta: 0.005,
			longitudeDelta: 0.005,
        });
    }, [latitude, longitude]);

    useEffect(() => {
        if (user !== null) {
            if (store === null) {
                
                let theStore = user?.access.store;
                setStore(theStore);
                setLatitude(theStore.latitude);
                setLongitude(theStore.longitude);
                setAddress(theStore.address);
            }
        }
    }, [user]);

    useEffect(() => {
        if (store?.name !== "") {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
    }, [store]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button circle onPress={submit} style={{
                    opacity: canSubmit ? 1 : 0.4,
                }}>
                    <Ionicons name="checkmark" color={'#fff'} size={20} />
                </Button>
            )
        })
    }, [navigation, store, icon, latitude, longitude, address]);

    const openLink = async url => {
        let result = await WebBrowser.openBrowserAsync(url);
        return "ok";
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.7,
            aspect: [1, 1],
            allowsEditing: true,
        });

        if (result.canceled) return;

        setIcon(result.assets[0].uri);
        setStore(prev => ({...prev, icon: null}));
    }

    const submit = async () => {
        try {
            let formData = new FormData();
            console.log(address, latitude, longitude);
            
            formData.append('name', store.name);
            formData.append('address', address);
            formData.append('latitude', latitude);
            formData.append('longitude', longitude);

            if (icon !== null) {
                let iconFileName = icon.split('/').pop();
                let iconMatch = /\.(\w+)$/.exec(iconFileName);
                let type = iconMatch ? `image/${iconMatch[1]}` : 'image';
                formData.append('icon', {
                    uri: icon,
                    name: iconFileName,    
                    type        
                });
            }

            const response = await axios.post(`${config.base_url}/api/store/update`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            const me = await axios.get(`${config.base_url}/api/user/me`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // await LocalStore.setItem('user_data', me.data.user);
            // setUser(me.data.user);

            Alert.alert('Berhasil menyimpan!', res.message, [
                { text: "Kembali", onPress: () => navigation.replace('Splash')}
            ]);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        }
    }

    const INV_METHODS = {
        fifo: {
            description: "Stok Lama Dipakai Dulu",
            example: "Contoh: ada stok datang hari Senin dan stok datang hari Rabu. Saat ada penjualan, stok hari Senin yang dipakai dulu.",
        },
        lifo: {
            description: "Stok Baru Dipakai Dulu",
            example: "Contoh: ada stok datang hari Senin dan stok datang hari Rabu. Saat ada penjualan, stok hari Rabu yang dipakai dulu.",
        },
        cheapest: {
            description: "Stok yang Paling Murah Dipakai Dulu",
            example: "Contoh: ada stok dengan harga beli Rp 8.000 dan Rp 10.000. Maka stok dengan harga beli Rp 8.000 dipakai dulu.",
        },
    }

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('location not enabled');
            
            return;
        }

        let theLocation = await Location.getCurrentPositionAsync({});
        let lat = theLocation.coords.latitude;
        let lng = theLocation.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        let theAddress = await getAddress(lat, lng);
        setAddress(theAddress);
        console.log(theAddress, lat, lng);
        
    }

    if (user === null || store === null) return;

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <Inline justifyContent={'center'}>
                    <TouchableOpacity style={styles.icon} onPress={pickImage}>
                        {
                            store?.icon === null ?
                            <>
                            { icon === null ?
                                <Ionicons name="storefront-outline" size={24} color={COLORS.slate[800]} />
                                :
                                <Image style={styles.icon} source={{ uri: icon }} />
                            }
                            </>
                            :
                            <Image style={styles.icon} source={{ uri: `${config.base_url}/storage/store_icons/${store?.icon}` }} />
                        }
                    </TouchableOpacity>
                </Inline>
                <View />
                <View>
                    <Input label="Nama Toko" value={store?.name} onChangeText={e => {
                        setStore(prev => ({...prev, name: e}));
                    }} />
                </View>

                <View style={[styles.group, styles.shadow]}>
                    <Inline>
                        <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 10, gap: 5 }}>
                            <Text style={{ fontWeight: '700' }}>Alamat</Text>
                            { !showMap &&
                                <Text size={12}>{address ?? '-'}</Text>
                            }
                        </View>
                        { showMap ?
                            <Inline gap={5}>
                                <Button accent="tertiary" onPress={() => {
                                    getLocation();
                                }}>Dapatkan Lokasi</Button>
                                <Button onPress={() => {
                                    setShowMap(false);
                                }}>
                                    Simpan
                                </Button>
                            </Inline>
                            :
                            <Button accent="secondary" onPress={() => {
                                setShowMap(true);
                            }}>Ubah</Button>
                        }
                    </Inline>
                    
                    { showMap &&
                        <View style={{ gap: 15 }}>
                            <View style={{ height: 250,marginTop: 20 }}>
                                <MapView
                                    ref={mapRef}
                                    style={{
                                        flex: 1
                                    }}
                                    initialRegion={{
                                        latitude: Number(latitude),
                                        longitude: Number(longitude),
                                        latitudeDelta: 0.005,
                                        longitudeDelta: 0.005,
                                    }}
                                >
                                    <Marker 
                                        key={`${latitude}-${longitude}-${address}`}
                                        title={store.name}
                                        description={address}
                                        coordinate={{
                                            latitude: Number(latitude),
                                            longitude: Number(longitude)
                                        }} 
                                        draggable={true}
                                        onDragStart={() => {
                                            console.log('DRAG START');
                                        }}
                                        onDragEnd={async e => {
                                            let coords = e.nativeEvent.coordinate;
                                            setLatitude(coords.latitude);
                                            setLongitude(coords.longitude);
                                            let addr = await getAddress(coords.latitude, coords.longitude);
                                            
                                            setAddress(addr);
                                        }}
                                        tracksViewChanges={true}
                                    />
                                </MapView>
                            </View>
                            <Text size={12}>{address}</Text>
                        </View>
                    }

                    <View /><View /><View /><View />
                    <Input 
                        label="Jarak Maksimal Absensi"
                        right={
                            <Text>meter</Text>
                        }
                        keyboardType="numeric"
                        value={store?.max_radius_attendance.toString()}
                        onChangeText={e => {
                            setStore(prev => ({...prev, max_radius_attendance: Number(e)}));
                        }}
                    />
                </View>

                <View style={[styles.group, styles.shadow ]}>
                    <Text style={{ fontWeight: '700' }}>Inventory Method</Text>
                    <View /><View />
                    <Toggle
                        options={['FIFO', 'LIFO', 'CHEAPEST']}
                        value={store.inventory_method}
                        onChange={value => {
                            setStore(prev => ({...prev, inventory_method: value}));
                        }}
                    />
                    <View /><View />
                    <Text size={12} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{INV_METHODS[store.inventory_method.toLowerCase()].description}</Text>
                    <Text size={12} color={COLORS.slate[500]} lineHeight={16}>
                        {INV_METHODS[store.inventory_method.toLowerCase()].example}
                    </Text>
                </View>

                <View style={[styles.shadow, styles.group]}>
                    <Text style={{ fontWeight: '700' }}>Hapus Akun</Text>
                    <Text size={12} color={COLORS.slate[500]}>Kirim permintaan untuk menghapus akun dan semua data yang terkait.</Text>
                    <View /><View />
                    <Button color={COLORS.red[100]} style={{ width: '100%' }} onPress={() => {
                        openLink(`${config.base_url}/delete-account`)
                    }}>
                        <Text color={COLORS.red[500]} style={{ fontWeight: '700' }}>Ajukan Permintaan</Text>
                    </Button>
                </View>

            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
        gap: 20,
    },
    icon: {
        width: 86,
        aspectRatio: 1,
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#eee",
    },
    shadow: {
        elevation: 3,
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
    },
    group: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        gap: 5
    }
});

export default OwnerMoreStore;