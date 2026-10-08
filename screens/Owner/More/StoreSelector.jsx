import React, { useState } from "react";
import useUser from "../../../hooks/useUser";
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import config from "../../../config";
import axios from "axios";
import StateView from "../Product/StateView";
import { Ionicons } from "@expo/vector-icons";

const OwnerMoreStoreSelector = ({ navigation, route }) => {
    const [user] = useUser();
    const [isSwitching, setSwitching] = useState(false);

    const switchAccess = async (access_id) => {
        if (isSwitching) return;
        setSwitching(true);
        try {
            const response = await axios.post(`${config.base_url}/api/user/access`, {
                access_id,
            }, { headers: {Authorization: `Bearer ${user.token}`}});
            let res = response.data;

            navigation.replace('Splash');
        } catch (err) {
            // 
        } finally {
            setSwitching(false);
        }
    }

    if (user === null) return;

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                { user.accesses.map((acc, a) => {
                    let isActive = acc.store.id === user.access.store_id;
                    return (
                        <Inline key={a} gap={15} style={[styles.store_item, isActive ? styles.store_item_active : null]} onPress={() => {
                            switchAccess(acc.id);
                        }}>
                            <View style={styles.icon}>
                                { acc.store.icon === null ?
                                    <Ionicons name="storefront-outline" size={20} color={COLORS.slate[700]} />
                                    :
                                    <Image style={styles.icon} source={{ uri: `${config.base_url}/storage/store_icons/${acc.store.icon}` }} />
                                }
                            </View>
                            <Text 
                                color={isActive ? COLORS.primary : COLORS.slate[700]}
                                style={{ fontWeight: isActive ? '600' : '400' }}
                            >{acc.store.name}</Text>
                            <View style={{ flexGrow: 1 }} />
                            <Button circle size={20} color="#fff" style={{
                                borderWidth: 1,
                                borderColor: isActive ? COLORS.primary : COLORS.slate[300],
                                padding: 0,
                            }}>
                                <Button circle size={12} color={isActive ? COLORS.primary : "#fff"} />
                            </Button>
                        </Inline>
                    )
                })}

                { user?.access?.role === "owner" &&
                    <Button accent="secondary" style={{ width: '100%', gap: 10 }} onPress={() => {
                        navigation.navigate('AuthNavigator', {
                            screen: "Onboarding",
                            params: {
                                user: user,
                                token: user.token,
                                no_welcome: true,
                            }
                        });
                    }}>
                        <Ionicons name="add-outline" color={COLORS.primary} size={20} />
                        <Text color={COLORS.primary} style={{ fontWeight: '600' }}>Toko Baru</Text>
                    </Button>
                }
            </ScrollView>

            { isSwitching &&
                <View style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "#fff",
                    alignItems: 'center',justifyContent: 'center'
                }}>
                    <StateView
                        icon={
                            <ActivityIndicator size={64} color={COLORS.primary} />
                        }
                        title={'Mengalihkan'}
                        body={'Sedang beralih toko, mohon tunggu sebentar...'}
                    />
                </View>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flexGrow: 1,
        padding: 20,
        gap: 20,
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
    icon: {
        width: 42,
        aspectRatio: 1,
        borderRadius: 99,
        backgroundColor: "#eee",
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default OwnerMoreStoreSelector;