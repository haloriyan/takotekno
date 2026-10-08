import axios from "axios";
import React, { useEffect, useRef } from "react";
import { Animated, Image, ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "ripal-ui";
import config from "../../config";
import LocalStore from "../../lib/LocalStore";

// Adjust rotation speed here (in milliseconds) - lower = faster, higher = slower
const ROTATION_SPEED = 1000;

const Logout = ({navigation, route}) => {
    const rotationValue = useRef(new Animated.Value(0)).current;
    const animationRef = useRef(null);

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
        (async () => {
            await LocalStore.deleteItem('user_data');
            await LocalStore.deleteItem('user_token');
            navigation.replace('Welcome');
        })();
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

export default Logout