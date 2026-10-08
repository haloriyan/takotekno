import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Inline, Text } from "ripal-ui";
import config from "../../../../config";
import { Ionicons } from "@expo/vector-icons";

const ImageViewer = ({ index = 0, setIndex, product, setShowImage }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image 
                    source={{uri: `${config.base_url}/storage/${product.store_id}/product_images/${product.id}/${product.images[index].filename}`}}
                    style={{
                        width: '100%',
                        aspectRatio: 3/4
                    }}
                />

                <View style={styles.content_overlay}>
                    <Inline justifyContent={'flex-end'}>
                        <Button circle color="#fff" size={42} onPress={() => {
                            setShowImage(false);
                        }}>
                            <Ionicons name="close" size={20} />
                        </Button>
                    </Inline>
                </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator style={styles.control} contentContainerStyle={{ alignItems: 'center', gap: 10 }}>
                <View />
                { product.images.map((img, i) => (
                    <TouchableOpacity key={i} style={[styles.image_item, index === i ? styles.image_item_active : null]} onPress={() => {
                        setIndex(i);
                    }}>
                        <Image 
                            source={{ uri: `${config.base_url}/storage/${product.store_id}/product_images/${product.id}/${img.filename}`}} 
                            style={styles.image}
                        />
                    </TouchableOpacity>
                ))}
                <View />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
        backgroundColor: "#000000aa",
        justifyContent: 'center'
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    control: {
        maxHeight: 90,
    },
    image: {
        height: 50,
        aspectRatio: 16/9,
        borderRadius: 8,
    },
    image_item: {
        borderWidth: 2,
        borderColor: "#ffffff00",
        borderRadius: 8,
    },
    image_item_active: {
        borderColor: "#fff",
    },
    content_overlay: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
        padding: 40,
        paddingHorizontal: 20,
    }
});

export default ImageViewer;