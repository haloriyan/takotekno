import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Input, Text } from "ripal-ui";
import * as ImagePicker from "expo-image-picker";
import useUser from "../../../hooks/useUser";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import Grid from "@haloriyan/grid";
import axios from "axios";
import config from "../../../config";
import Gemini from "../../../lib/Gemini";
import Currency from "../../../lib/Currency";

const OwnerProductEdit = ({ navigation, route }) => {
    const { product } = route?.params;
    const [user, setUser] = useUser();

    const [name, setName] = useState(product?.name || "");
    const [description, setDescription] = useState(product?.description || "");
    const [price, setPrice] = useState(product?.price);
    const [point, setPoint] = useState(product?.point);
    const [images, setImages] = useState(product?.images || []);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(product?.categories || []);
    const [canSubmit, setCanSubmit] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [gettingLabels, setGettingLabels] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.base_url}/api/store/category`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setCategories(response.data.categories);
            } catch (err) {
                console.error(err);
            }
        };

        if (user?.token) {
            fetchCategories();
        }
    }, [user]);

    useEffect(() => {
        if (name !== "" && !gettingLabels) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
    }, [name, gettingLabels]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button circle onPress={submit} style={{
                    opacity: canSubmit ? 1 : 0.4,
                }}>
                    {isSubmitting ? <ActivityIndicator color={'#fff'} size={20} /> : <Ionicons name="checkmark" color={'#fff'} size={20} />}
                </Button>
            )
        });
    }, [navigation, canSubmit, isSubmitting, user, name, description, categories, images, price, point]);

    const controlPoint = (action) => {
        if (action === 'increase') {
            setPoint(prev => prev + 10);
        } else {
            if (point > 0) {
                if (point > 10) {
                    setPoint(prev => prev - 10);
                } else {
                    setPoint(prev => 0);
                }
            }
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
                if (image.uri && image.uri.startsWith('content://')) { // only upload if it's a local file
                    formData.append("images[]", {
                        uri: image.uri,
                        name: image.fileName || `image_${index}.jpg`,
                        type: image.mimeType || "image/jpeg",
                    });
                    
                    if (image.fileName) {
                        imagesPayload[image.fileName] = {
                            labels: image.labels || []
                        };
                    }
                }
            });

            formData.append('images_payload', JSON.stringify(imagesPayload));

            const response = await axios.post(`${config.base_url}/api/store/product/${product.id}/update`, formData, {
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

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            aspect: [1, 1],
            allowsMultipleSelection: true,
            selectionLimit: 5 - images.length,
            base64: true,
        });

        if (result.canceled) return;

        setGettingLabels(true);
        
        const newAssets = result.assets.map((res, idx) => ({
            uri: res.uri,
            fileName: res.fileName || `image_${Date.now()}_${idx}.${res.uri.split(".").pop() || "jpg"}`,
            mimeType: res.mimeType || "image/jpeg",
            labels: [],
            loading: true,
            key: `img_${Date.now()}_${idx}`,
        }));

        setImages((prev) => [...prev, ...newAssets]);

        for (const asset of newAssets) {
            try {
                let geminiResponse = await Gemini([
                    {
                        parts: [
                            {
                                text: "Give labels for this image in this EXACT JSON format :\n" +
                                      "```json \n" +
                                      '{"labels": ["LABEL1", "LABEL2"] }' +
                                      "```\n" +
                                      "Pay high attention in the details like colors, text, brands, or anything else and DONT MIND about outside the object"
                            },
                            {
                                inlineData: {
                                    mimeType: asset.mimeType,
                                    data: result.assets[newAssets.indexOf(asset)].base64,
                                }
                            }
                        ]
                    }
                ], 0.4);

                setImages((prev) => prev.map(img => 
                    img.key === asset.key 
                        ? { ...img, labels: geminiResponse.labels, loading: false } 
                        : img
                ));
            } catch (err) {
                console.error(err);
                setImages((prev) => prev.map(img => 
                    img.key === asset.key ? { ...img, loading: false } : img
                ));
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

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ gap: 20 }}>
                    <Input label="Nama Produk" value={name} onChangeText={(e) => setName(e)} error={error === "name"} />
                    {error === "name" && <Text size={11} color={COLORS.red[500]} style={{ marginTop: 4, marginLeft: 4 }}>Nama produk wajib diisi</Text>}
                    <Input label="Deskripsi Produk" value={description} onChangeText={(e) => setDescription(e)} multiline />
                    <Input
                        label="Harga Jual"
                        value={Currency(price).encode()}
                        onChangeText={e => {
                            let val = Currency(e ?? 0).decode() ?? 0;
                            
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
                            <TouchableOpacity style={styles.qty_btn} onPress={() => controlPoint('decrease')}>
                                <Ionicons name="remove" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.qty_btn} onPress={() => controlPoint('increase')}>
                                <Ionicons name="add" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                        </Inline>
                    } />
                </View>

                <View style={{ gap: 20 }}>
                    <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: "600" }}>Gambar Produk</Text>

                    <Grid col={3} gap={10}>
                        {images.map((img, i) => (
                            <View key={i} style={styles.image_area}>
                                 <Image
                                     source={{ uri: img.uri || `${config.base_url}/storage/${product.store_id}/product_images/${product.id}/${img.filename}` }}
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

                <View style={{ gap: 20 }}>
                    <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: "600" }}>Kategori</Text>

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

export default OwnerProductEdit;
