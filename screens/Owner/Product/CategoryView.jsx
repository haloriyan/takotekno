import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    PanResponder,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Button, COLORS, Dialog, Inline, Switch, Text } from "ripal-ui";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import config from "../../../config";
import StateView from "./StateView";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Item = ({
    cat,
    index,
    handleMove,
    setCategory,
    setDeleting,
    navigation,
    user = null,
    setScrollEnabled,
}) => {
    const [pos, setPos] = useState(cat.pos_available);
    const [isDragging, setIsDragging] = useState(false);

    const isFirstRender = useRef(true);
    const translateY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onMoveShouldSetPanResponder: () => true,

            onPanResponderTerminationRequest: () => false,

            onPanResponderGrant: () => {
                translateY.setValue(0);

                setIsDragging(true);
                setScrollEnabled(false);
            },

            onPanResponderMove: (_, gestureState) => {
                translateY.setValue(gestureState.dy);
            },

            onPanResponderRelease: (_, gestureState) => {
                const direction =
                    gestureState.dy > 50
                        ? 1
                        : gestureState.dy < -50
                            ? -1
                            : 0;

                handleMove(index, direction);

                setIsDragging(false);
                setScrollEnabled(true);

                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            },

            onPanResponderTerminate: () => {
                setIsDragging(false);
                setScrollEnabled(true);

                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            },
        })
    ).current;

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (user !== null) {
            (async () => {
                try {
                    console.log(
                        `${config.base_url}/api/store/category/${cat.id}/pos?status=${pos}`
                    );

                    await axios.get(
                        `${config.base_url}/api/store/category/${cat.id}/pos?status=${pos}`,
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        }
                    );
                } catch (err) {
                    console.error(err);
                    console.error(err.response?.data);
                }
            })();
        }
    }, [pos, user]);

    return (
        <Animated.View
            style={[
                styles.item,
                {
                    transform: [{ translateY }],
                    zIndex: isDragging ? 100 : 1,
                },
            ]}
        >
            <View style={styles.item_inner}>
                <Inline gap={20}>
                    <View {...panResponder.panHandlers}>
                        <MaterialIcons
                            name="drag-indicator"
                            size={24}
                        />
                    </View>

                    <View
                        style={{
                            flexBasis: 10,
                            flexGrow: 1,
                            flexShrink: 1,
                            gap: 5,
                        }}
                    >
                        <Text style={{ fontWeight: "600" }}>
                            {cat.name}
                        </Text>

                        <Text size={11}>
                            {cat.products.length} Produk
                        </Text>
                    </View>

                    <Inline gap={10}>
                        <Button
                            circle
                            color={COLORS.primary}
                            onPress={() => {
                                navigation.navigate(
                                    "OwnerCategoryEdit",
                                    {
                                        category: cat,
                                    }
                                );
                            }}
                        >
                            <Ionicons
                                name="create-outline"
                                color="#fff"
                                size={18}
                            />
                        </Button>

                        <Button
                            circle
                            color={COLORS.red[500]}
                            onPress={() => {
                                setCategory(cat);
                                setDeleting(true);
                            }}
                        >
                            <Ionicons
                                name="trash-outline"
                                color="#fff"
                                size={18}
                            />
                        </Button>
                    </Inline>
                </Inline>
            </View>

            <Inline style={styles.item_bottom}>
                <Text
                    style={{
                        flexGrow: 1,
                        flexShrink: 1,
                        flexBasis: 10,
                    }}
                >
                    Tampil di POS
                </Text>

                <Switch
                    size={16}
                    active={pos}
                    setActive={setPos}
                />
            </Inline>
        </Animated.View>
    );
};

const CategoryView = ({ user = null, canAdd, setCanAdd }) => {
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const [isLoading, setLoading] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [categoriesMapStack, setCategoriesMapStack] = useState([]);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const [isDeleting, setDeleting] = useState(false);
    const [isDeletingProc, setDeletingProc] = useState(false);

    const load = async () => {
        if (isLoading) return;

        setLoading(true);

        try {
            const response = await axios.get(
                `${config.base_url}/api/store/category`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            const res = response.data;

            setCategories(res.categories);
            setCanAdd(res.can_add);

            const mapStack = [];

            res.categories.map((cat) => {
                mapStack.push({
                    id: cat.id,
                });
            });

            setCategoriesMapStack(mapStack);
        } catch (err) {
            console.error(err);
            console.error(err.response?.data);
        } finally {
            setLoading(false);
            setLoaded(true);
        }
    };

    useEffect(() => {
        if (isFocused && user !== null) {
            console.log("hehe");

            load();
        }
    }, [user, isFocused]);

    const handleMove = async (index, direction) => {
        if (direction === 0) return;

        const newStack = [...categoriesMapStack];

        const targetIndex = index + direction;

        if (
            targetIndex < 0 ||
            targetIndex >= newStack.length
        ) {
            return;
        }

        [
            newStack[index],
            newStack[targetIndex],
        ] = [
            newStack[targetIndex],
            newStack[index],
        ];

        setCategoriesMapStack(newStack);

        try {
            await axios.post(
                `${config.base_url}/api/store/category/reposition`,
                {
                    categories: newStack,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            await load();
        } catch (err) {
            console.error(err);
        }
    };

    const del = async () => {
        if (isDeletingProc) return;

        setDeletingProc(true);

        try {
            await axios.get(
                `${config.base_url}/api/store/category/${category.id}/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            await load();

            setDeleting(false);
            setCategory(null);
        } catch (err) {
            console.error(err);
            console.error(err.response?.data);
        } finally {
            setDeletingProc(false);
        }
    };

    return (
        <React.Fragment>
            {isLoaded && categories.length === 0 && (
                <StateView
                    icon={
                        <Ionicons
                            name="pricetags-outline"
                            size={128}
                            color={COLORS.primary}
                        />
                    }
                    title="Belum ada kategori."
                    action={
                        <Button
                            onPress={() =>
                                navigation.navigate(
                                    "OwnerCategoryAdd"
                                )
                            }
                        >
                            Tambahkan
                        </Button>
                    }
                />
            )}

            {isLoaded && categories.length > 0 && (
                <ScrollView
                    scrollEnabled={scrollEnabled}
                    contentContainerStyle={styles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={async () => {
                                await load();
                            }}
                        />
                    }
                >
                    {categories.map((cat, index) => (
                        <Item
                            key={cat.id}
                            cat={cat}
                            index={index}
                            handleMove={handleMove}
                            setCategory={setCategory}
                            setDeleting={setDeleting}
                            navigation={navigation}
                            user={user}
                            setScrollEnabled={setScrollEnabled}
                        />
                    ))}
                </ScrollView>
            )}

            {category !== null && (
                <Dialog
                    visible={isDeleting}
                    onClose={() => setDeleting(false)}
                >
                    <Dialog.Title>
                        <Text
                            size={16}
                            style={{
                                fontWeight: "600",
                            }}
                        >
                            Hapus {category.name}
                        </Text>
                    </Dialog.Title>

                    <Dialog.Body>
                        <Text>
                            Yakin ingin menghapus{" "}
                            {category.name}?
                        </Text>
                    </Dialog.Body>

                    <Dialog.Actions>
                        {isDeletingProc ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Button
                                color={COLORS.red[500]}
                                onPress={del}
                            >
                                Hapus
                            </Button>
                        )}
                    </Dialog.Actions>
                </Dialog>
            )}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        backgroundColor: "#fff",
        gap: 20,
    },

    item: {
        backgroundColor: "#fff",
        shadowColor: "#ddd",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        borderRadius: 20,
        elevation: 3,
    },

    item_inner: {
        padding: 20,
    },

    item_bottom: {
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        padding: 15,
        paddingHorizontal: 20,
    },
});

export default CategoryView;