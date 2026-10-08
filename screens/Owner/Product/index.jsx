import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import ProductView from "./ProductView";
import CategoryView from "./CategoryView";
import useUser from "../../../hooks/useUser";
import { Ionicons } from "@expo/vector-icons";

const ProductCategoryToggler = ({ viewing, setViewing }) => {
    return (
        <Inline style={togglerStyles.area} gap={0}>
            <TouchableOpacity style={[togglerStyles.item, viewing === "product" ? togglerStyles.shadow : null]} onPress={() => {
                setViewing('product');
            }}>
                <Text 
                    size={13}
                    color={viewing === "product" ? COLORS.primary : COLORS.slate[500]}
                    style={{ fontWeight: viewing === "product" ? '600' : "500" }}
                >
                    Produk
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[togglerStyles.item, viewing === "category" ? togglerStyles.shadow : null]} onPress={() => {
                setViewing('category');
            }}>
                <Text 
                    size={13}
                    color={viewing === "category" ? COLORS.primary : COLORS.slate[500]}
                    style={{ fontWeight: viewing === "category" ? '600' : "500" }}
                >
                    Kategori
                </Text>
            </TouchableOpacity>
        </Inline>
    )
}

const OwnerProduct = ({ navigation, route }) => {
    const [viewing, setViewing] = useState('product');
    const [user, setUser] = useUser();
    const [categories, setCategories] = useState([]);
    const [canAdd, setCanAdd] = useState(true);

    return (
        <React.Fragment>
            <View style={styles.header}>
                <SafeAreaView edges={['top']} style={styles.inline}>
                    <Inline style={{ flexGrow: 1,flexShrink: 1,flexBasis: 10 }}>
                        <ProductCategoryToggler viewing={viewing} setViewing={setViewing} />
                    </Inline>
                    { canAdd &&
                        <Button circle color="#fff" size={40} style={togglerStyles.shadow} onPress={() => {
                            if (viewing === "product") {
                                navigation.navigate('OwnerProductAdd', {
                                    categories,
                                });
                            } else if (viewing === "category") {
                                navigation.navigate('OwnerCategoryAdd');
                            }
                        }}>
                            <Ionicons name="add-outline" color={COLORS.primary} size={18} />
                        </Button>
                    }
                </SafeAreaView>
            </View>
            { viewing === "product" &&
                <ProductView 
                    user={user} parentSetCategories={setCategories} 
                    canAdd={canAdd} setCanAdd={setCanAdd}
                />
            }
            { viewing === "category" &&
                <CategoryView 
                    user={user} parentSetCategories={setCategories} 
                    canAdd={canAdd} setCanAdd={setCanAdd}
                />
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 5,
    },
    inline: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        padding: 20,
        paddingTop: 10,
        flexGrow: 1,
        backgroundColor: "#fff"
    }
});

const togglerStyles = StyleSheet.create({ 
    area: {
        backgroundColor: "#ecf0f1",
        padding: 5,
        borderRadius: 99,
    },
    item: {
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 99,
    },
    shadow: {
        backgroundColor: "#fff",
        shadowColor: "#ddd",
        shadowOffset: {width: 1,height: 1},
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    }
});

export default OwnerProduct;