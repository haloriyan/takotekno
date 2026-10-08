import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Image, StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import * as FileSystem from "expo-file-system/legacy";
import config from "../../config";
import axios from "axios";
import Gemini from "../../lib/Gemini";
import { useToast } from "react-native-toast-notifications";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import rand from "../../lib/rand";
import { Ionicons } from "@expo/vector-icons";

const Scanner = ({ user, carts, addToCart, categories, setScanning }) => {
    const [facing, setFacing] = useState('back');
    const [camPerm, reqCamPerm] = useCameraPermissions();
    const cameraRef = useRef(null);
    const [scannedImages, setScannedImages] = useState([]);
    const toast = useToast();
    const { width } = useWindowDimensions();

    const uriToBase64 = async uri => {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return base64;
    }

    const takePicture = async () => {
        console.log('a');
        
        let result = await cameraRef.current.takePictureAsync();
        console.log('b', result.uri);
        
        const imageId = rand(111, 999);
        
        setScannedImages(prev => [...prev, {
            id: imageId,
            uri: result.uri,
            format: result.format,
            labels: null,
        }]);

        console.log('c');
        let base64 = await uriToBase64(result.uri);
        try {
            let geminiResponse = await Gemini([
                {
                    parts: [
                        {
                            text: "Give labels for this image in this EXACT JSON format :\n" +
                                    "```json \n" +
                                    '{"labels": ["LABEL1", "LABEL2"] }' +
                                    "```\n" +
                                    "IMPORTANT NOTES : \n"+
                                    "- Pay high attention in the details like colors, text, brands, or anything else and DONT MIND about outside the object" 
                        },
                        {
                            inlineData: {
                                mimeType: `image/${result.format}`,
                                data: base64,
                            }
                        }
                    ]
                }
            ], 0.4);

            const response = await axios.post(`${config.base_url}/api/store/product/scan`, {
                labels: geminiResponse.labels,
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            let res = response.data;
            let productResult = res.products;

            categories.map((cat, c) => {
                cat.products.map((prod, p) => {
                    productResult.map((item, i) => {
                        if (prod.id === item.id) {
                            addToCart(prod);
                            toast.show(`${prod.name} ditambahkan ke keranjang`, {
                                placement: 'bottom',
                                type: "success",
                                offset: 50
                            })
                            console.log(prod.name, " added to cart");
                        }
                    });
                });
            });

            setScannedImages(prev => 
                prev.map(img => 
                    img.id === imageId 
                        ? { ...img, labels: geminiResponse.labels }
                        : img
                )
            );
        } catch (err) {
            console.error(err);
            setScannedImages(prev =>
                prev.map(img =>
                    img.id === imageId
                        ? { ...img, labels: [] }
                        : img
                )
            );
        }
    }

    return (
        <View>
            <CameraView
                ref={cameraRef}
                facing={facing}
                style={{
                    ...styles.camera,
                    borderRadius: 12,
                }}
            />
            <LinearGradient colors={["rgba(45, 45, 45, 0.2)", "rgba(45, 45, 45, 0.5)"]} style={styles.top}> 
                <BlurView intensity={30} style={styles.top_inner}>
                    <Inline>
                        <View style={{ gap: 5, flexBasis: 10,flexGrow: 1 }}>
                            <Text color="#fff" style={{ fontWeight: '600' }}>Scan Produk</Text>
                            <Text size={12} color="#fff" lineHeight={16}>
                                Ambil foto produk di depanmu untuk menambahkan ke keranjang
                            </Text>
                        </View>
                        <Button circle color="#fff" onPress={() => {
                            setScanning(false);
                        }}>
                            <Ionicons name="close-outline" size={18} />
                        </Button>
                    </Inline>
                </BlurView>
            </LinearGradient>

            <View style={styles.bawah}>
                <Inline gap={10}>
                    { scannedImages.map((img, i) => {
                        if (img.labels === null) {
                            return (
                                <View key={i}>
                                    <Image style={styles.scanned_image} source={{uri: img.uri}} />
                                    <View style={{ ...styles.overlay, backgroundColor: '#00000030' }}>
                                        <ActivityIndicator color={'#fff'} />
                                    </View>
                                </View>
                            )
                        }
                    })}
                </Inline>
                <Button style={{ height: 48,paddingHorizontal: 50 }} onPress={() => takePicture()}>
                    Potret
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    camera: {
        width: '100%',
        height: Dimensions.get('screen').height,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        borderRadius: 12,
    },
    top: {
        position: 'absolute',
        top: 0,left: 0,right: 0, 
        overflow: 'hidden', 
    },
    top_inner: {
        padding: 20,
        paddingTop: 60,
    },
    bawah: {
        position: 'absolute',
        bottom: 140,left: 20,right: 20,
        alignItems: 'center',
        gap: 20
    },
    scanned_image: {
        width: 64,
        height: 64,
        borderRadius: 8,
    },
    overlay: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default Scanner;