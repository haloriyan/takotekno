import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Input, Text } from "ripal-ui";
import * as ImagePicker from "expo-image-picker";
import useUser from "../../../hooks/useUser";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import Grid from "@haloriyan/grid";
import axios from "axios";
import config from "../../../config";
import Gemini from "../../../lib/Gemini";
import Currency from "../../../lib/Currency";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";

const OwnerProductAdd = ({ navigation, route }) => {
    const { categories } = route?.params;
    const [user, setUser] = useUser();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("-");
    const [price, setPrice] = useState(0);
    const [point, setPoint] = useState(0);
    const [images, setImages] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [gettingLabels, setGettingLabels] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    
    const handleKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height - 80);
    }
    const handleKeyboardDidHide = () => {
        setKeyboardHeight(0);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
        return () => Keyboard.removeAllListeners(handleKeyboardDidShow);
    }, []);
    useEffect(() => {
        Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);
        return () => Keyboard.removeAllListeners(handleKeyboardDidHide);
    }, []);

    const STEPS = [
        {
            title: "Informasi Produk",
            body: "Berikan informasi dasar mengenai produkmu",
        },
        {
            title: "Gambar",
            body: "Unggah hingga 5 gambar dari produk yang kamu tambahkan",
        },
        {
            title: "Kategori",
            body: "Pilih kategori yang sesuai untuk memudahkan",
        },
    ];

    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        if (name !== "" && images.length > 0 && !gettingLabels) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
    }, [name, images, gettingLabels]);

    const controlQty = action => {
        if (action === 'decrease') {
            if (point > 10) {
                setPoint(prev => Math.ceil(prev) - 10);
            } else {
                setPoint(1);
            }
        } else {
            setPoint(prev => Math.ceil(prev) + 10);
        }
    }

    const submit = async () => {
        if (isSubmitting || gettingLabels) return;

        setSubmitting(true);
        try {
            let formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('categories', JSON.stringify(selectedCategories));
            formData.append('price', price);
            formData.append('point', point);
            
            let imagesPayload = {};
            images.forEach((image, index) => {
                formData.append("images[]", {
                    uri: image.uri,
                    name: image.fileName || `image_${index}.${image.uri.split(".").pop() || "jpg"}`,
                    type: image.mimeType || "image/jpeg",
                });
                
                if (image.fileName) {
                    imagesPayload[image.fileName] = {
                        labels: image.labels || []
                    };
                }
            });

            formData.append('images_payload', JSON.stringify(imagesPayload));

            const response = await axios.post(`${config.base_url}/api/store/product/store`, formData, {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            let res = response.data;

            navigation.goBack();
        } catch (err) {
            console.log(err);
            console.error(err.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    const pickImage = async () => {
        if (images.length >= 5) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.5,
            aspect: [1, 1],
            allowsMultipleSelection: true,
            selectionLimit: 5 - images.length,
        });

        if (result.canceled) return;

        setGettingLabels(true);

        const newAssets = [];

        for (let idx = 0; idx < result.assets.length; idx++) {
            const res = result.assets[idx];

            const converted = await ImageManipulator.manipulateAsync(
                res.uri,
                [],
                {
                    compress: 0.8,
                    format: ImageManipulator.SaveFormat.JPEG,
                }
            );

            newAssets.push({
                uri: converted.uri,
                fileName: `image_${Date.now()}_${idx}.jpg`,
                mimeType: "image/jpeg",
                labels: [],
                loading: true,
                key: `img_${Date.now()}_${idx}`,
            });
        }

        setImages((prev) => [...prev, ...newAssets]);

        for (const asset of newAssets) {
            try {
                const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                console.log(asset.mimeType);

                const geminiResponse = await Gemini([
                    {
                        parts: [
                            {
                                text:
                                    "Give labels for this image in this EXACT JSON format :\n" +
                                    "```json\n" +
                                    '{"labels": ["LABEL1", "LABEL2"] }' +
                                    "\n```\n" +
                                    "Pay high attention in the details like colors, text, brands, or anything else and DONT MIND about outside the object",
                            },
                            {
                                inlineData: {
                                    mimeType: asset.mimeType,
                                    data: base64,
                                },
                            },
                        ],
                    },
                ], 0.4);

                setImages((prev) =>
                    prev.map((img) =>
                        img.key === asset.key
                            ? {
                                    ...img,
                                    labels: geminiResponse.labels,
                                    loading: false,
                                }
                            : img
                    )
                );
            } catch (err) {
                console.error(err);

                setImages((prev) =>
                    prev.map((img) =>
                        img.key === asset.key
                            ? { ...img, loading: false }
                            : img
                    )
                );
            }
        }

        setGettingLabels(false);
    };

    const removeImage = (index) => {
        let theImages = [...images];
        theImages.splice(index, 1);
        setImages(theImages);
    };

    const toggleCategory = (category) => {
        setSelectedCategories((prev) => {
            if (prev.some((item) => item.id === category.id)) {
                return prev.filter((item) => item.id !== category.id);
            }

            return [...prev, category];
        });
    };

    const validateStep = (index) => {
        switch (index) {
            case 0:
                return name !== "";
            case 1:
                return true;
            case 2:
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (!validateStep(stepIndex)) {
            setError(stepIndex === 0 ? "name" : null);
            setTimeout(() => setError(null), 5000);
            return;
        }

        if (stepIndex === STEPS.length - 1) {
            if (canSubmit) {
                submit();
            }
        } else {
            setStepIndex((prev) => prev + 1);
        }
    };

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ gap: 20, display: stepIndex === 0 ? "flex" : "none" }}>
                    <View>
                        <Input label="Apa nama produknya?" value={name} onChangeText={(e) => setName(e)} error={error === "name"} />
                        {error === "name" && <Text size={11} color={COLORS.red[500]} style={{ marginTop: 4, marginLeft: 4 }}>Nama produk wajib diisi</Text>}
                    </View>
                    <Input label="Jelaskan mengenai produk ini" value={description} onChangeText={(e) => setDescription(e)} multiline onFocus={() => {
                        if (description === "-") {
                            setDescription("");
                        }
                    }} onBlur={() => {
                        if (description === "") {
                            setDescription("-");
                        }
                    }} />
                    <Input
                        label="Harga Jual"
                        value={Currency(price).encode()}
                        onChangeText={e => {
                            let val = Currency(e || 0).decode() ?? 0;
                            if (isNaN(val)) {
                                val = 0;
                            }
                            
                            setPrice(val);
                        }}
                        keyboardType="numeric"
                    />
                    <Input label="Loyalty Point" value={point.toString()} onChangeText={e => {
                        let val = parseInt(e);
                        if (isNaN(val)) {
                            val = 1;
                        }
                        setPoint(val);
                    }} keyboardType="numeric" right={
                        <Inline gap={10}>
                            <TouchableOpacity style={styles.qty_btn} onPress={() => controlQty('decrease')}>
                                <Ionicons name="remove" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.qty_btn} onPress={() => controlQty('increase')}>
                                <Ionicons name="add" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                        </Inline>
                    } />
                </View>

                <View style={{ gap: 20, display: stepIndex === 1 ? "flex" : "none" }}>
                    <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: "600" }}>Pilih Gambar Produk</Text>

                    <Grid col={3} gap={10}>
                        {images.map((img, i) => (
                            <View key={i} style={styles.image_area}>
                                <Image
                                    source={{ uri: img.uri }}
                                    style={styles.image_item}
                                />

                                {img.loading && (
                                    <View style={styles.image_loading}>
                                        <ActivityIndicator color={"#fff"} />
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={styles.image_remove}
                                    onPress={() => removeImage(i)}
                                >
                                    <Ionicons
                                        name="remove"
                                        color={"#fff"}
                                        size={18}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {images.length < 5 && (
                            <TouchableOpacity
                                style={[
                                    styles.image_area,
                                    styles.image_input,
                                ]}
                                onPress={pickImage}
                            >
                                <Ionicons
                                    name="images-outline"
                                    size={24}
                                />
                            </TouchableOpacity>
                        )}
                    </Grid>
                </View>

                <View style={{ gap: 20, display: stepIndex === 2 ? "flex" : "none" }}>
                    <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: "600" }}>Pilih Kategori</Text>

                    <Inline gap={5} style={{ flexWrap: 'wrap' }}>
                        {categories.map((cat) => {
                            const active = selectedCategories.some((item) => item.id === cat.id);

                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => toggleCategory(cat)}
                                    style={[
                                        styles.chip,
                                        active && styles.chip_active,
                                    ]}
                                >
                                    <Text
                                        size={12}
                                        color={
                                            active
                                                ? "#fff"
                                                : COLORS.primary
                                        }
                                    >
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </Inline>
                    
                    <View />

                    { selectedCategories.length > 0 &&
                        <View style={{ gap: 10 }}>
                            <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: "600" }}>Kategori Dipilih</Text>
                            <View style={{ gap: 10 }}>
                                { selectedCategories.map((cat, c) => (
                                    <Inline key={c} gap={10}>
                                        <Text>{cat.name}</Text>
                                        <View style={{ flexGrow: 1 }} />
                                        <Button circle size={26} accent="secondary" color={COLORS.red[500]} onPress={() => toggleCategory(cat)}>
                                            <Ionicons name="remove" color={COLORS.red[500]} size={18} />
                                        </Button>
                                    </Inline>
                                ))}
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>

            <Inline style={{
                ...styles.bottom,
                position: keyboardHeight > 0 ? 'absolute' : 'relative',
                bottom: keyboardHeight,
                left: 0,right: 0,
            }} gap={10}>
                <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 10,gap: 4 }}>
                    <Text color={COLORS.slate[800]} style={{ fontWeight: "600" }}>
                        {STEPS[stepIndex].title}
                    </Text>
                    <Text size={11}>{STEPS[stepIndex].body}</Text>
                </View>

                {stepIndex > 0 && (
                    <Button circle size={42} color={COLORS.slate[300]} onPress={() => {
                        setStepIndex((prev) => prev - 1);
                    }}>
                        <MaterialIcons name="west" />
                    </Button>
                )}

                { stepIndex !== STEPS.length - 1 ?
                    <Button circle size={42} onPress={handleNext}>
                        <MaterialIcons name="east" color={"#fff"} />
                    </Button>
                    :
                    <Button onPress={handleNext} style={{
                        opacity: canSubmit ? 1 : 0.6,
                    }}>
                        { isSubmitting ? 
                            <ActivityIndicator color={'#fff'} /> 
                        :
                            <Text size={12} color="#fff" style={{ fontWeight: '600' }}>Tambahkan</Text>
                        }
                    </Button>
                }
            </Inline>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
        flexGrow: 1,
        backgroundColor: "#fff",
        gap: 20,
    },
    bottom: {
        backgroundColor: "#fff",
        padding: 10,
        paddingHorizontal: 20,
    },
    image_area: {
        flexGrow: 1,
        flexShrink: 1,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        position: "relative",
    },
    image_input: {
        borderWidth: 1,
        borderColor: "#ddd",
    },
    image_item: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    image_remove: {
        backgroundColor: COLORS.red[500],
        position: "absolute",
        top: 10,
        right: 10,
        width: 24,
        height: 24,
        aspectRatio: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    image_loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    },
    chip: {
        padding: 8,
        paddingHorizontal: 15,
        borderRadius: 999,
        borderWidth: 0.5,
        borderColor: COLORS.primary,
    },
    chip_active: {
        backgroundColor: COLORS.primary,
    },
    qty_btn: {
        padding: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 8,
    },
});

export default OwnerProductAdd;