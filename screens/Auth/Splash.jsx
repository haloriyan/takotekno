import axios from "axios";
import React, { useEffect, useRef } from "react";
import { Animated, Image, ImageBackground, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "ripal-ui";
import config from "../../config";
import LocalStore from "../../lib/LocalStore";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import rand from "../../lib/rand";
import { PushNotifications } from "../../lib/navigation/PushNotification";

// Adjust rotation speed here (in milliseconds) - lower = faster, higher = slower
const ROTATION_SPEED = 1000;

const Splash = ({navigation, route}) => {
    const rotationValue = useRef(new Animated.Value(0)).current;
    const animationRef = useRef(null);

    const fetchDeviceInfo = async () => {
        // const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
        //     projectId: Constants.expoConfig?.extra?.eas?.projectId
        //         ?? Constants.easConfig?.projectId,
        // });
        const pushToken = await PushNotifications();

        return {
            push_token: pushToken,

            platform: Platform.OS,

            device_id: rand(
                111111111111111111111, 
                999999999999999999999
            ).toString(),

            device_name: Device.deviceName,
            device_model: Device.modelName,
            os_version: Device.osVersion,

            app_version: Constants.expoConfig?.version,
        };
    };

    const getDeviceInfo = async () => {
        let info = await LocalStore.getItem('device_info');
        if (info === null) {
            info = await fetchDeviceInfo();
            await LocalStore.setItem('device_info', info);
        }
        return info;
    }

    useEffect(() => {
        // Stop previous animation if it exists
        if (animationRef.current) {
            animationRef.current.stop();
        }

        // Reset rotation value
        rotationValue.setValue(0);

        // Create and start new animation
        const rotateAnimation = Animated.loop(
            Animated.timing(rotationValue, {
                toValue: 1,
                duration: ROTATION_SPEED,
                useNativeDriver: true,
            })
        );
        animationRef.current = rotateAnimation;
        rotateAnimation.start();

        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, [ROTATION_SPEED]);

    const rotation = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    useEffect(() => {
        const init = async () => {
            const deviceInfo = await getDeviceInfo();
            
            const token = await LocalStore.getItem('user_token');
            
            if (token === null) {
                navigation.replace('AuthNavigator');
            }
            try {
                const response = await axios.get(`${config.base_url}/api/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        device: JSON.stringify(deviceInfo)
                    }
                });
                
                const res = response.data;
                let user = res.user;
                
                const userString = JSON.stringify(res.user);

                const bytes = new TextEncoder().encode(userString).length;
                const kb = (bytes / 1024).toFixed(2);

                console.log(`Size: ${bytes} bytes (${kb} KB)`);

                await LocalStore.setItem("user_data", res.user);
                
                if (res.user === null) {
                    navigation.replace('AuthNavigator');
                } else {
                    LocalStore.setItem('user_data', res.user);

                    if (res.onboarding) {
                        navigation.navigate('AuthNavigator', {
                            screen: "Onboarding",
                            params: {
                                user: res.user,
                                token: token,
                            }
                        });
                    } else {
                        
                        if (user.access.role === "owner") {
                            navigation.replace('OwnerNavigator');
                        } else if (user.access.role === "cashier") {
                            navigation.replace('CashierNavigator');
                        } else if (user.access.role === "stockist") {
                            navigation.replace('StockistNavigator');
                        }
                    }
                }
            } catch (err) {
                console.log(err);
                
                navigation.replace('AuthNavigator');
            }
        }

        init();
    }, []);

    return (
        <React.Fragment>
            <View source={require('../../assets/mesh.png')} style={styles.container}>
                <Animated.Image
                    source={require('../../assets/tt.png')}
                    style={[styles.icon, { transform: [{ rotate: rotation }] }]}
                />
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    icon: {
        width: 128,
        height: 128,
    }
})

export default Splash