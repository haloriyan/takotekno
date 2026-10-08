import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, Inline, Input, Text } from "ripal-ui";
import config from "../../../config";
import { MaterialIcons } from "@expo/vector-icons";

const OwnerHomeBlog = ({ navigation, route }) => {
    const [scroll, setScroll] = useState(0);

    const [isLoading, setLoading] = useState(false);
    const [featured, setFeatured] = useState([]);
    const [sections, setSections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [index, setIndex] = useState(0);

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            const response = await axios.get(`${config.base_url}/api/blog?api=1`);
            let res = response.data;

            setCategories(res.categories);
            setSections(res.sections);
            setFeatured(res.featured);
            
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const controlIndex = (action) => {
        if (action === "next") {
            if (index === featured.length - 1) {
                setIndex(0);
            } else {
                setIndex(prev => prev + 1);
            }
        } else {
            if (index === 0) {
                setIndex(featured.length - 1);
            } else {
                setIndex(prev => prev - 1);
            }
        }
    }

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled={true} scrollEventThrottle={16} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    load();
                }} />
            }>
                <Text size={42} color={COLORS.slate[800]} style={{ fontWeight: '800',padding: 20,paddingBottom: 0 }}>Insights.</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                    <View /><View />
                    { categories.map((cat, c) => (
                        <Pressable key={c} style={[styles.cat_item]} onPress={() => navigation.navigate('OwnerHomeBlogCategory', {
                            category: cat,
                        })}>
                            <Text size={12}>{cat.name}</Text>
                        </Pressable>
                    ))}
                    <View /><View />
                </ScrollView>

                <View style={{ padding: 20, gap: 10 }}>
                    <Text size={28} color={COLORS.slate[800]} style={{ fontWeight: '700',flexGrow: 1,flexShrink: 1 }}>Featured</Text>
                    <View />
                    <TouchableOpacity style={{ gap: 10 }} onPress={() => {
                        navigation.navigate('BlogRead', {
                            content: featured[index],
                        });
                    }}>
                        <Image style={styles.post_image} source={{ uri: featured[index]?.cover }} />
                        <Text size={18} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{featured[index]?.title}</Text>
                    </TouchableOpacity>
                    <Inline>
                        <Inline gap={5}>
                            { featured.map((feat, f) => (
                                <Pressable key={f} style={[styles.dot, f === index ? styles.dot_active : null]}></Pressable>
                            ))}
                        </Inline>
                        <View style={{ flexGrow: 1,flexShrink: 1 }} />
                        <TouchableOpacity onPress={() => controlIndex('prev')}>
                            <MaterialIcons name="west" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => controlIndex('next')}>
                            <MaterialIcons name="east" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                    </Inline>
                </View>
                <View>
                    { sections.map((sec, s) => (
                        <View key={s}>
                            <Inline style={{ padding: 20 }}>
                                <Text size={28} color={COLORS.slate[800]} style={{ fontWeight: '700',flexGrow: 1,flexShrink: 1 }}>{sec.name}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('OwnerHomeBlogCategory', {
                                    category: sec,
                                })}>
                                    <MaterialIcons name="east" size={24} color={COLORS.primary} />
                                </TouchableOpacity>
                            </Inline>
                            <ScrollView horizontal contentContainerStyle={{ gap: 20 }} showsHorizontalScrollIndicator={false}>
                                <View />
                                { sec.posts.map((post, p) => (
                                    <TouchableOpacity key={p} style={styles.post_item} onPress={() => {
                                        navigation.navigate('BlogRead', {
                                            content: post,
                                        });
                                    }}>
                                        <Image style={styles.post_image} source={{ uri: post.cover }} />
                                        <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{post.title}</Text>
                                    </TouchableOpacity>
                                ))}
                                <View />
                            </ScrollView>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: 60,
        backgroundColor: "#fff",
        gap: 20,
    },
    header: {
        backgroundColor: "#fff",
        position: 'absolute',
        left: 0,right: 0,
        padding: 20,
        paddingTop: 65,
        shadowColor: "#ddd",
        shadowOffset: { width: 1,height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    cat_item: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 5,
        paddingHorizontal: 14,
        borderRadius: 99,
    },
    post_item: {
        maxWidth: 40 / 100 * Dimensions.get('screen').width,
        width: 40 / 100 * Dimensions.get('screen').width,
        gap: 10,
    },
    post_image: {
        width: '100%',
        aspectRatio: 16/9,
        backgroundColor: "#eee",
        borderRadius: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: COLORS.slate[400]
    },
    dot_active: {
        borderColor: COLORS.primary,
    }
});

export default OwnerHomeBlog;