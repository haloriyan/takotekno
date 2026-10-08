import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { COLORS, Text } from "ripal-ui";
import config from "../../../config";

const BlogRead = ({ navigation, route }) => {
    // const { content } = route.params;
    const [content, setContent] = useState(route?.params?.content);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: content.title
        })
    }, [content]);

    const load = async () => {
        try {
            const response = await axios.get(`${config.base_url}/api/blog/${content.slug}?api=1`);
            let res = response.data;

            setContent(res.post);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            // 
        }
    }

    useEffect(() => {
        if (!content?.slides) {
            load();
        }
    }, [content]);

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <Image style={styles.cover} source={{ uri: content.cover }} />
                <View style={{ padding: 20, gap: 20 }}>
                    <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '800' }}>{content.title}</Text>
                    <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '300' }} lineHeight={28}>{content.body}</Text>
                    <View />
                    { content?.slides?.map((sli, s) => (
                        <View key={s} style={{ gap: 10 }}>
                            <Text size={17} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{sli.title}</Text>
                            <Text size={14} color={COLORS.slate[800]} style={{ fontWeight: '300' }} lineHeight={26}>{sli.body}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flexGrow: 1,
        gap: 20,
    },
    cover: {
        width: '100%',
        aspectRatio: '16/9',
    }
})

export default BlogRead;