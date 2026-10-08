import React, { useEffect, useState } from "react";
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from "react-native";
import useUser from "../../hooks/useUser";
import { Button, COLORS, Dialog, Inline, Text } from "ripal-ui";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import DatePicker from "@react-native-community/datetimepicker";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import config from "../../config";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const Item = ({ prod, isSelecting, setSelecting, selectedProducts, setSelectedProducts }) => {
    const navigation = useNavigation();
    let isSelected = selectedProducts.findIndex(item => item.id === prod.id);

    const toggleProduct = () => {
        let theSelectedProducts = [...selectedProducts];
        if (isSelected >= 0) {
            theSelectedProducts.splice(isSelected, 1);
        } else {
            theSelectedProducts.push(prod);
        }
        setSelectedProducts(theSelectedProducts);
        if (theSelectedProducts.length === 0) {
            setSelecting(false);
        }
    }

    return (
        <Inline style={[styles.item]} gap={20} onPress={() => {
            // toggleProduct();
            if (isSelecting) {
                toggleProduct();
            } else {
                navigation.navigate('StockistDetail', {
                    product: prod,
                })
            }
        }} onLongPress={() => {
            if (!isSelecting) {
                setSelecting(true);
                toggleProduct();
            }
        }}>
            { isSelecting &&
                <Button circle size={16} color="#fff" style={{
                    borderWidth: 1,
                    borderColor: isSelected >= 0 ? COLORS.primary : '#ddd'
                }}>
                    <Button circle size={10} color={isSelected >= 0 ? COLORS.primary : "#fff" } />
                </Button>
            }
            <Image style={styles.product_image} source={{ uri: `${config.base_url}/storage/${prod.store_id}/product_images/${prod.id}/${prod.images[0].filename}` }} />
            <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 10,gap: 10 }}>
                <Text color={COLORS.slate[800]} style={{ fontWeight: '700' }}>{prod.name}</Text>
                { !isSelecting &&
                    <Inline gap={20}>
                        <View style={{ gap: 4}}>
                            <Inline gap={5}>
                                <Ionicons name="download-outline" />
                                <Text size={11}>Masuk</Text>
                            </Inline>

                            <Text style={{ fontWeight: '600' }}>{prod.inbound}</Text>
                        </View>
                        <View style={{ gap: 4}}>
                            <Inline gap={5}>
                                <Ionicons name="download-outline" style={{ transform: [{ rotate: '180deg' }] }} />
                                <Text size={11}>Keluar</Text>
                            </Inline>

                            <Text style={{ fontWeight: '600' }}>{prod.outbound}</Text>
                        </View>
                        <View style={{ gap: 4}}>
                            <Inline gap={5}>
                                <Ionicons name="sync-outline" />
                                <Text size={11}>Opname</Text>
                            </Inline>

                            <Text style={{ fontWeight: '600' }}>{prod.opname}</Text>
                        </View>
                    </Inline>
                }
            </View>
            <View style={{ gap: 5 }}>
                <Text size={10}>Tersedia</Text>
                <Text size={20} color={COLORS.primary} style={{ fontWeight: '800' }}>{prod.quantity}</Text>
            </View>
        </Inline>
    )
}

const StockistHome = ({ navigation, route }) => {
    const [user] = useUser();

    const [isLoading, setLoading] = useState(false);
    const [isSelecting, setSelecting] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [q, setQ] = useState('');
    const [raw, setRaw] = useState(null);
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [tempDate, setTempDate] = useState(dayjs());
    const [date, setDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'days'));
    const [endDate, setEndDate] = useState(dayjs());
    const [tempStartDate, setTempStartDate] = useState(dayjs().subtract(7, 'days'));
    const [tempEndDate, setTempEndDate] = useState(dayjs());
    const pickerDefaultStyles = useDefaultStyles();
    const [showCalendar, setShowCalendar] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [hasCheckedOut, setHasCheckedOut] = useState(false);

    const load = async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            if (page === 1) {
                setProducts([]);
                setRaw(null);
            }
            const response = await axios.get(`${config.base_url}/api/stockist/home?q=${q}&page=${page}&start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            // setProducts(res.products);
            setRaw(res.products);
            setProducts(prev => [...prev, ...res.products.data]);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setLoading(false);
        }
    }

    const presenceCheck = async () => {
        try {
            const response = await axios.get(`${config.base_url}/api/store/schedule/${dayjs().format('YYYY-MM-DD')}/check`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;

            setHasCheckedIn(res.has_checked_in);
            setHasCheckedOut(res.has_checked_out);
            
        } catch (err) {
            console.error(err);
        }
    }

    const isFocused = useIsFocused();

    useEffect(() => {
        if (user !== null && isFocused) {
            setSelectedProducts([]);
            setSelecting(false);
            load();
            presenceCheck();
        }
    }, [user, page, isFocused]);

    const debounceSearch = useDebouncedCallback(() => {
        load();
    }, 500);

    if (user === null) return null;

    return (
        <React.Fragment>
            <Inline style={styles.header} gap={15}>
                { user.access.store.icon !== null ?
                    <Image
                        source={{ uri: `${config.base_url}/storage/store_icons/${user.access.store.icon}` }}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 99,
                        }}
                    />
                    :
                    <Button circle>
                        <Ionicons name="storefront-outline" color={'#fff'} size={16} />
                    </Button>
                }

                <Pressable style={{ flexGrow: 1,flexShrink: 1,flexBasis: 100, gap: 2 }} onPress={() => {
                    navigation.navigate('StockistStoreSelector');
                }}>
                    <Inline gap={5}>
                        <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{user.name}</Text>
                        <Ionicons name="chevron-down-outline" size={14} />
                    </Inline>
                    <Text size={12}>{user.access.store.name}</Text>
                </Pressable>

                <View style={{ flexGrow: 1 }} />
                <Button accent="tertiary" color="#fff" style={{ borderWidth: 1,borderColor: "#ddd",height: 32,padding: 0 }} onPress={() => {
                    if (isSelecting) {
                        setSelectedProducts([]);
                    }
                    setSelecting(!isSelecting);
                }}>
                    <Text size={12} style={{ fontWeight: '700' }}>{isSelecting ? 'Batal' : 'Pilih'}</Text>
                </Button>
                <Button circle color={COLORS.red[100]} style={{ borderRadius: 8 }} onPress={() => {
                    navigation.replace('AuthNavigator', {
                        screen: "Logout"
                    });
                }}>
                    <Ionicons name="log-out-outline" size={18} color={COLORS.red[500]} />
                </Button>
            </Inline>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    load();
                }} />
            }>
                <Inline style={{ padding: 20 }}>
                    <View style={{ flexGrow: 1, flexBasis: 10, flexShrink: 1, gap: 5 }}>
                        <Inline gap={5}>
                            <Ionicons name="calendar-outline" />
                            <Text size={11}>Tanggal</Text>
                        </Inline>
                        <Text size={12} color={COLORS.slate[800]} style={{ fontWeight: '700' }}>
                            {date.format('DD MMMM YYYY')}
                        </Text>
                    </View>

                    <Button accent="tertiary" onPress={() => setShowCalendar(true)}>Ubah</Button>
                </Inline>

                <View style={{ padding: 20,paddingTop: 0 }}>
                    <Inline style={styles.search} gap={0}>
                        <Button circle accent="tertiary">
                            <Ionicons name="search-outline" size={18} color={COLORS.slate[500]} />
                        </Button>
                        <TextInput style={styles.search_input} value={q} onChangeText={e => {
                            setQ(e);
                            debounceSearch();
                        }} placeholder="Cari produk" />
                        { q !== "" &&
                            <Button circle accent="tertiary" onPress={() => {
                                setQ('');
                                debounceSearch();
                            }}>
                                <Ionicons name="close-outline" size={18} color={COLORS.slate[500]} />
                            </Button>
                        }
                    </Inline>
                </View>

                <View style={{ gap: 30,padding: 20,paddingTop: 10 }}>
                    { products.map((prod, p) => (
                        <Item 
                            key={p} prod={prod} 
                            isSelecting={isSelecting} setSelecting={setSelecting}
                            selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts}
                        />
                    ))}
                </View>

                { raw?.next_page_url !== null &&
                    <Button accent="secondary" style={{ width: '100%' }} onPress={() => {
                        setPage(prev => prev + 1);
                    }}>Lainnya</Button>
                }
                <View style={{ height: 80 }} />
            </ScrollView>

            { showCalendar && 
                <Dialog visible={showCalendar} onClose={() => setShowCalendar(false)}>
                    <Dialog.Title>Rentang Tanggal</Dialog.Title>
                    <Dialog.Body>
                        {/* <DateTimePicker
                            styles={{
                                ...pickerDefaultStyles,
                                selected: {
                                    backgroundColor: COLORS.primary,
                                }
                            }}
                            mode="range"
                            startDate={tempStartDate}
                            endDate={tempEndDate}
                            onChange={({startDate, endDate}) => {
                                setTempStartDate(dayjs(startDate));
                                setTempEndDate(dayjs(endDate));
                            }}
                        /> */}
                        <DatePicker
                            value={date.toDate()}
                            onValueChange={(e, theDate) => {
                                setTempDate(dayjs(theDate));
                            }}
                            mode="date"
                            display="spinner"
                        />
                    </Dialog.Body>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            // setStartDate(tempStartDate);
                            // setEndDate(tempEndDate);
                            setDate(tempDate);
                            setShowCalendar(false);
                        }}>Selesai</Button>
                    </Dialog.Actions>
                </Dialog>
            }
            <Inline style={[styles.bottom]}>
                { isSelecting ?
                    <Button style={{ gap: 10, ...styles.shadow }} color={'#fff'} onPress={() => {
                        navigation.navigate('StockistOpname', {
                            products: selectedProducts,
                        });
                    }}>
                        <Ionicons name="sync-outline" color={COLORS.slate[700]} size={18} />
                        <Text size={14} color={COLORS.slate[700]} style={{ fontWeight: '600' }}>Opname</Text>
                    </Button>
                    :
                    <>
                    { !hasCheckedIn ?
                        <Button style={{ gap: 10 }} color={COLORS.green[500]} onPress={() => {
                            navigation.navigate('Presence');
                        }}>
                            <Ionicons name="time-outline" color={'#fff'} size={18} />
                            <Text size={12} color="#fff" style={{ fontWeight: '600' }}>Absen Masuk</Text>
                        </Button>
                        :
                        <>
                        { !hasCheckedOut &&
                            <Button style={{ gap: 10 }} color={COLORS.green[500]} onPress={() => {
                                navigation.navigate('Presence');
                            }}>
                                <Ionicons name="time-outline" color={'#fff'} size={18} />
                                <Text size={12} color="#fff" style={{ fontWeight: '600' }}>Absen Pulang</Text>
                            </Button>
                        }
                        </>
                    }
                    </>
                }
                <View style={{ flexGrow: 1 }} />
                <Button style={{ gap: 6 }} onPress={() => {
                    let theSelectedProducts = [...selectedProducts];
                    theSelectedProducts.map((item, i) => {
                        theSelectedProducts[i]['new_stock'] = {
                            quantity: 10,
                            cost_price: item.price,
                        };
                    });

                    navigation.navigate('StockistAdd', {
                        products: theSelectedProducts,
                    });
                }}>
                    <Ionicons name="add-outline" color={'#fff'} size={18} />
                    <Text size={14} color="#fff" style={{ fontWeight: '600' }}>Tambah Stok</Text>
                </Button>
            </Inline>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        padding: 15,
        paddingHorizontal: 20,
        paddingTop: 65,
    },
    container: {
        flexGrow: 1,
        backgroundColor: "#fff"
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    item: {
        backgroundColor: "#fff",
        // padding: 20,
        // borderRadius: 12,
    },
    product_image: {
        width: 64,
        height: 64,
        backgroundColor: "#eee",
        borderRadius: 12,
    },
    search: {
        backgroundColor: COLORS.slate[100],
        borderRadius: 99,
        paddingHorizontal: 10,
    },
    search_input: {
        height: 48,
        flexGrow: 1,
    },
    bottom: {
        position: 'absolute',
        bottom: 0,left: 0,right: 0,
        padding: 20,
        paddingBottom: 40,
    }
});

export default StockistHome;