import React, { useEffect, useState } from "react";
import { Dimensions, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import useUser from "../../../../hooks/useUser";
import axios from "axios";
import config from "../../../../config";
import { Ionicons } from "@expo/vector-icons";
import Grid from "@haloriyan/grid";
import dayjs from "dayjs";

const OwnerMoreReview = ({ navigation, route }) => {
    const [user] = useUser();
    const [reviews, setReviews] = useState([]);
    const [raw, setRaw] = useState(null);
    const [page, setPage] = useState(1);
    const [isLoading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [avg, setAvg] = useState(0);

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            if (page === 1) {
                setReviews([]);
            }

            const response = await axios.get(`${config.base_url}/api/store/review?page=${page}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            setReviews(prev => [...prev, ...res.reviews.data]);
            setRaw(res.reviews);
            setCount(res.count);
            setAvg(res.avg);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user !== null) {
            load();
        }
    }, [user, page]);

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    setPage(1);
                }} />
            }>
                <Grid col={2} gap={10}>
                    <Inline style={[styles.card, styles.shadow]} gap={20}>
                        <View style={styles.card_icon}>
                            <Ionicons name="star-outline" size={32} />
                        </View>
                        <View style={{ flexBasis: 10, flexGrow: 1, flexShrink: 1, gap: 5 }}>
                            <Text size={11}>Avg. Rating</Text>
                            <Text size={24} color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{avg}</Text>
                        </View>
                    </Inline>
                    <Inline style={[styles.card, styles.shadow]} gap={20}>
                        <View style={styles.card_icon}>
                            <Ionicons name="chatbubbles-outline" size={32} />
                        </View>
                        <View style={{ flexBasis: 10, flexGrow: 1, flexShrink: 1, gap: 5 }}>
                            <Text size={11}>Ulasan</Text>
                            <Text size={24} color={COLORS.slate[700]} style={{ fontWeight: '600' }}>{count}</Text>
                        </View>
                    </Inline>
                </Grid>

                <View />

                <Text color={COLORS.slate[600]} style={{ fontWeight: '600' }}>Ulasan Terbaru</Text>
                <View style={{ gap: 20 }}>
                    { reviews.map((rev, r) => (
                        <View key={r} style={[styles.card, styles.shadow, { gap: 10 }]}>
                            <Inline>
                                <Text style={{ fontWeight: '800' }}>{rev.customer.name}</Text>
                                <View style={{ flexGrow: 1 }} />
                                <Inline gap={5}>
                                    { [1, 1, 1, 1, 1].map((star, s) => {
                                        return (
                                            <Ionicons 
                                                name={s < rev.rate ? 'star' : 'star-outline'}
                                                color={COLORS.yellow[500]} 
                                                size={16}
                                            />
                                        )
                                    }) }
                                </Inline>
                            </Inline>

                            <Text>{rev.body ?? '-' }</Text>
                            <View />
                            <Inline>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('ReportNavigator', {
                                        screen: "OwnerReport",
                                        params: {
                                            navigateTo: {
                                                screen: "OwnerReportSalesDetail",
                                                params: {
                                                    sales: rev.sales
                                                }
                                            }
                                        }
                                    })
                                }}>
                                    <Text size={12} color={COLORS.primary} style={{ fontWeight: '700' }}>{rev.sales.invoice_number}</Text>
                                </TouchableOpacity>
                                <View style={{ flexGrow: 1 }} />
                                <Text size={11} color={COLORS.slate[500]} align={'right'}>
                                    {dayjs(rev.created_at).format('DD MMM YYYY, HH:mm')}
                                </Text>
                            </Inline>
                        </View>
                    ))}

                    { raw?.next_page_url !== null &&
                        <>
                        <View />
                        <Button accent="secondary" style={{ width: '100%' }} onPress={() => {
                            setPage(prev => prev + 1);
                        }}>Lainnya</Button>
                        </>
                    }
                </View>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        gap: 20,
        backgroundColor: "#fff",
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        flexGrow: 1,
        flexShrink: 1,
    },
    card_icon: {
        width: 32,
        height: 32,
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default OwnerMoreReview;