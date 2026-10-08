import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, COLORS, Inline, Text } from "ripal-ui";
import useUser from "../../../hooks/useUser";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import config from "../../../config";
import StateView from "../Product/StateView";
import dayjs from "dayjs";
import { useIsFocused } from "@react-navigation/native";

const OwnerMore = ({ navigation, route }) => {
    const [user, setUser, reloadUser] = useUser();
    const [store, setStore] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (user !== null) {
            setStore(user.access.store);
        }
    }, [user]);

    useEffect(() => {
        if (isFocused) {
            reloadUser();
        }
    }, [isFocused]);

    if (user === null || store === null) return;

    return (
        <React.Fragment>
            <View style={styles.top} />

            <ScrollView style={styles.content} contentContainerStyle={styles.container}>
                <SafeAreaView edges={['top']} style={{ gap: 10 }}>
                    <Inline style={{padding: 20}} gap={15}>
                        <Button circle size={64} color="#fff">
                            { store.icon === null ?
                                <Ionicons name="storefront-outline" size={24} color={COLORS.blue[600]} />
                                :
                                <Image style={styles.photo} source={{ uri: `${config.base_url}/storage/store_icons/${store.icon}` }} />
                            }
                        </Button>
                        <View style={{ flexBasis: 50,flexGrow: 1,flexShrink: 1,gap: 6}}>
                            <Text color="#fff" size={18} style={{ fontWeight: '600' }}>{store.name}</Text>
                            { store.package !== "basic" &&
                                <Text color="#fff" size={11}>{store.package.toUpperCase()} hingga {dayjs(store?.plan?.expired_at).format('DD MMM YYYY')}</Text>
                            }
                        </View>
                        <Button color="#fff" style={{ gap: 10 }} onPress={() => {
                            navigation.navigate('OwnerMoreStoreSelector');
                        }}>
                            <Ionicons name="sync-outline" size={16} />
                        </Button>
                    </Inline>
                </SafeAreaView>
                <View style={styles.inner_content}>
                    {/* <Text>{JSON.stringify(store.package)}</Text> */}
                    { store.package === "basic" ?
                        <Inline style={styles.upgrade_banner}>
                            <View style={{ flexGrow: 1,flexBasis: 10,gap: 5}}>
                                <Text color="#fff" size={14} style={{ fontWeight: '600' }}>Tingkatkan untuk Akses Lebih</Text>
                                <Text color="#fff" size={12} lineHeight={12 * 1.35}>Lebih banyak produk, karyawan, dan unduh laporan.</Text>
                            </View>
                            <Button color="#fff" onPress={() => {
                                navigation.navigate('Upgrade');
                            }}>
                                <Text color={COLORS.blue[600]} size={12} style={{ fontWeight: '700' }}>Upgrade</Text>
                            </Button>
                        </Inline>
                        :
                        <Inline style={styles.upgrade_banner}>
                            <View style={{ flexGrow: 1,flexBasis: 10,gap: 5}}>
                                <Text color="#fff" size={14} style={{ fontWeight: '600' }}>Akses {store.package.toUpperCase()} lebih lama!</Text>
                                <Text color="#fff" size={12} lineHeight={12 * 1.35}>Jaga performa toko tetap dengan paket {store.package.toUpperCase()}.</Text>
                            </View>
                            <Button color="#fff" onPress={() => {
                                navigation.navigate('Upgrade');
                            }}>
                                <Text color={COLORS.blue[600]} size={12} style={{ fontWeight: '700' }}>Perpanjang</Text>
                            </Button>
                        </Inline>
                    }
                    <View style={styles.group}>
                        <Inline gap={10}>
                            <Ionicons name="cube-outline" />
                            <Text size={12}>Master Data</Text>
                        </Inline>
                        <View style={styles.group_card}>
                            <Inline gap={10} style={styles.group_item} onPress={() => {
                                navigation.navigate('OwnerMoreStore');
                            }}>
                                <Ionicons name="storefront-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Pengaturan Toko</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                            <Inline gap={10} style={styles.group_item} onPress={() => {
                                navigation.navigate('OwnerMoreSupplier')
                            }}>
                                <Feather name="truck" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Supplier</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                            <Inline gap={10} style={styles.group_item} onPress={() => {
                                navigation.navigate('OwnerMoreEmployee');
                            }}>
                                <Ionicons name="people-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Karyawan & Hak Akses</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                            <Inline gap={10} style={styles.group_item} onPress={() => {
                                navigation.navigate('OwnerMoreSchedule');
                            }}>
                                <Ionicons name="calendar-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Jadwal & Absensi</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                        </View>
                    </View>

                    <View style={styles.group}>
                        <Inline gap={10}>
                            <Ionicons name="bar-chart-outline" />
                            <Text size={12}>Berkembang</Text>
                        </Inline>
                        <View style={styles.group_card}>
                            <Inline gap={10} style={styles.group_item} onPress={() => {
                                navigation.navigate('OwnerMoreCustomer');
                            }}>
                                <Ionicons name="people-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Pelanggan</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                            <Inline gap={10} style={styles.group_item} onPress={() => {
                                navigation.navigate('OwnerMoreReview');
                            }}>
                                <Ionicons name="chatbubbles-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Ulasan</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                        </View>
                    </View>

                    {/* <View style={styles.group}>
                        <Inline gap={10}>
                            <Ionicons name="bar-chart-outline" />
                            <Text size={12}>Marketing</Text>
                        </Inline>
                        <View style={styles.group_card}>
                            <Inline gap={10} style={styles.group_item}>
                                <Ionicons name="home-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Dashboard</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                            <Inline gap={10} style={styles.group_item}>
                                <Ionicons name="home-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Dashboard</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                            <Inline gap={10} style={styles.group_item}>
                                <Ionicons name="home-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Dashboard</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                        </View>
                    </View> */}

                    <View style={styles.group}>
                        {/* <Inline gap={10}>
                            <Ionicons name="cube-outline" />
                            <Text size={12}>Master Data</Text>
                        </Inline> */}
                        <View style={styles.group_card}>
                            <Inline gap={10} style={styles.group_item} onPress={() => {
                                navigation.navigate('AppPermissions');
                            }}>
                                <Ionicons name="settings-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Izin Aplikasi</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                            <Inline gap={10} style={styles.group_item} onPress={async () => {
                                const phone = "6285159772902";
                                const message = "Halo, saya membutuhkan bantuan mengenai aplikasi Takotoko.";

                                const whatsappUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
                                const browserUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

                                try {
                                    const canOpenWhatsApp = await Linking.canOpenURL(whatsappUrl);

                                    if (canOpenWhatsApp) {
                                        await Linking.openURL(whatsappUrl);
                                    } else {
                                        await Linking.openURL(browserUrl);
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            }}>
                                <Ionicons name="call-outline" size={20} />
                                <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '500' }}>Butuh Bantuan?</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                        </View>
                    </View>

                    <View style={styles.group}>
                        <View style={styles.group_card}>
                            <Inline gap={10} style={styles.group_item} onPress={() => navigation.navigate('AuthNavigator', {
                                screen: "Logout"
                            })}>
                                <Ionicons name="log-out-outline" size={20} color={COLORS.red[500]} />
                                <Text size={14} color={COLORS.red[500]} style={{ fontWeight: '500' }}>Logout</Text>
                                <View style={{ flexGrow: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color={COLORS.slate[400]} />
                            </Inline>
                        </View>
                    </View>
                </View>
            </ScrollView>
            
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    top: {
        backgroundColor: COLORS.blue[600],
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: "center",
        height: 350,
    },
    top_icon: {
        width: 64,
        height: 64,
        backgroundColor: "#fff",
    },
    content: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
        zIndex: 1,
    },
    container: {
        flexGrow: 1,
        gap: 10,
    },
    inner_content: {
        backgroundColor: "rgb(242, 242, 242)",
        padding: 20,
        paddingVertical: 30,
        flexGrow: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        gap: 30,
    },
    group: {
        gap: 12,
    },
    group_card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 15,
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    group_item: {
        padding: 12,
        paddingHorizontal: 24,
    },
    store_item: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 15,
    },
    store_item_active: {
        borderColor: COLORS.primary,
    },
    upgrade_banner: {
        backgroundColor: COLORS.blue[600],
        borderRadius: 12,
        padding: 20,
    },
    photo: {
        width: 64,
        height: 64,
        borderRadius: 99,
    }
});

export default OwnerMore;