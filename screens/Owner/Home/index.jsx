import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Pressable, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, COLORS, Inline, Text, Toggle } from "ripal-ui";
import useUser from "../../../hooks/useUser";
import axios from "axios";
import config from "../../../config";
import Currency from "../../../lib/Currency";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import dayjs from "dayjs";
import OwnerHomeSales from "./Sales";
import OwnerHomeCustomer from "./Customer";
import LocalStore from "../../../lib/LocalStore";
import { useIsFocused } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import StateView from "../../../components/StateView";

const OwnerHome = ({ navigation, route }) => {
    const [scroll, setScroll] = useState(0);
    const scrollRef = useRef(0);
    const [top, setTop] = useState(-100);

    const paragraphs = [ "Di sebuah desa kecil yang dikelilingi bukit hijau, tinggallah seorang anak bernama Lala. Ia adalah anak yang ceria dan sangat suka menjelajahi tempat-tempat baru. Setiap sore, Lala sering berjalan-jalan di dekat hutan bersama kelinci putih kesayangannya, Mimi.", "Suatu pagi, ketika sedang bermain di bawah pohon tua, Lala melihat sesuatu berkilauan di antara rerumputan. Ia mendekat dan menemukan sebuah kunci kecil berwarna emas. Lala mengangkatnya dan memperhatikan bentuknya dengan penuh rasa ingin tahu.", "Lala membawa kunci itu ke rumah dan menunjukkannya kepada Mimi. Kelinci kecil itu hanya memiringkan kepala seolah-olah juga sedang berpikir. Karena tidak mengetahui kegunaannya, Lala memutuskan untuk mencari tahu dari mana kunci tersebut berasal.", "Keesokan harinya, Lala dan Mimi pergi ke hutan. Mereka berjalan melewati jalan setapak yang dipenuhi daun kering dan bunga liar. Setelah berjalan cukup jauh, Lala melihat sesuatu yang aneh di balik semak-semak.", "Di sana terdapat sebuah pintu kecil yang menyatu dengan batang pohon besar. Pintu itu memiliki lubang kunci berbentuk seperti bintang. Lala segera menyadari bahwa kunci emas yang ditemukannya mungkin cocok dengan pintu tersebut.", "Dengan hati-hati, Lala memasukkan kunci ke dalam lubang. Terdengar suara klik yang lembut. Pintu perlahan terbuka dan memperlihatkan sebuah lorong panjang yang dipenuhi cahaya kebiruan.", "Lala menggandeng Mimi dan memasuki lorong tersebut. Di sepanjang jalan, mereka melihat bunga-bunga bercahaya dan kupu-kupu kecil yang terbang di udara. Semakin jauh mereka berjalan, semakin terang cahaya di depan mereka.", "Akhirnya, mereka tiba di sebuah taman yang sangat indah. Pohon-pohon di sana memiliki daun berwarna keemasan, tetapi sebagian besar bunganya tampak layu. Anehnya, taman yang begitu cantik itu terasa sangat sunyi.", "Tiba-tiba, seekor burung kecil terbang turun dan hinggap di sebuah ranting. Burung itu memandang Lala lalu berkata, \"Akhirnya ada manusia yang datang.\" Lala terkejut karena belum pernah mendengar burung berbicara sebelumnya.", "Burung itu memperkenalkan dirinya sebagai Piko, penjaga taman ajaib. Ia menjelaskan bahwa taman tersebut kehilangan sumber cahayanya setelah Batu Matahari menghilang. Jika batu itu tidak ditemukan, seluruh taman akan menjadi gelap.", "Lala merasa kasihan kepada Piko dan semua penghuni taman. Ia bertanya apakah ada cara untuk mendapatkan kembali Batu Matahari. Piko menjawab bahwa batu tersebut terakhir kali terlihat dibawa ke sebuah gua di balik Bukit Biru.", "Meskipun perjalanan menuju gua cukup jauh, Lala memutuskan untuk membantu. Mimi ikut bersamanya tanpa ragu. Piko kemudian memberikan sebuah daun bercahaya yang dapat digunakan sebagai penerang selama perjalanan.", "Mereka berjalan melewati sungai kecil, padang rumput, dan jembatan kayu tua. Di tengah perjalanan, mereka menemukan seekor anak tupai yang terjebak di antara dua batang pohon. Lala berhenti dan membantu membebaskannya.", "Anak tupai itu sangat berterima kasih dan menunjukkan jalan pintas menuju Bukit Biru. Berkat bantuan tersebut, Lala, Mimi, dan Piko dapat mencapai bukit lebih cepat. Di balik sebuah batu besar, mereka akhirnya menemukan pintu masuk sebuah gua.", "Gua itu sangat gelap dan licin. Lala menggunakan daun bercahaya dari Piko untuk menerangi jalan. Setelah berjalan cukup dalam, mereka melihat cahaya keemasan muncul dari balik bebatuan.", "Ternyata cahaya itu berasal dari Batu Matahari. Namun, batu tersebut berada di sebuah lubang yang cukup dalam. Lala harus berhati-hati agar tidak terpeleset ketika mengambilnya.", "Dengan bantuan Mimi dan Piko, Lala berhasil mengambil Batu Matahari. Mereka kemudian berjalan kembali keluar dari gua. Ketika sampai di taman, Lala segera menyerahkan batu itu kepada Piko.", "Piko meletakkan Batu Matahari di tempat semula. Seketika, cahaya keemasan menyebar ke seluruh taman. Bunga-bunga yang layu kembali bermekaran, pohon-pohon menjadi segar, dan para penghuni taman keluar untuk merayakan kembalinya cahaya.", "Sebagai tanda terima kasih, Piko memberikan Lala sebuah biji emas. Lala kemudian pulang bersama Mimi sebelum matahari terbenam. Ia menanam biji tersebut di halaman rumah dan merawatnya setiap hari. Beberapa minggu kemudian, tumbuhlah pohon kecil dengan bunga bercahaya yang mengingatkan Lala bahwa keberanian dan kebaikan selalu dapat membawa cahaya bagi orang lain." ];

    const [user] = useUser();
    const [isLoading, setLoading] = useState(false);
    const [revenue, setRevenue] = useState(0);
    const [highestVolume, setHighestVolume] = useState([]);
    const [hours, setHours] = useState([]);
    const [viewing, setViewing] = useState('Penjualan');
    const [contents, setContents] = useState([]);
    const [pendingBalance, setPendingBalance] = useState(0);

    const openLink = async url => {
        let result = await WebBrowser.openBrowserAsync(url);
    }

    const load = async () => {
        if (isLoading) return;
        setLoading(true);

        try {
            const response = await axios.get(`${config.base_url}/api/user/home`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            let res = response.data;

            setHighestVolume(res.highest_volume);
            setHours(res.hours);
            setRevenue(res.revenue);
            setContents(res.contents);
            setPendingBalance(res.pending_balance);
            
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
    }, [user]);

    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            if (isFocused) {
                let pendingNotif = await LocalStore.getItem('pending_notif');

                if (pendingNotif !== null) {
                    await LocalStore.deleteItem('pending_notif');

                    if (pendingNotif.action === "sales_paid") {
                        navigation.navigate('ReportNavigator', {
                            screen: "OwnerReport",
                            params: {
                                navigateTo: {
                                    screen: "OwnerReportSalesDetail",
                                    params: {
                                        sales: pendingNotif.payload
                                    }
                                }
                            }
                        });
                    }
                }
            }
        })();
    }, [isFocused]);

    useEffect(() => {
        if (scroll > scrollRef.current) {
            // ke bawah
            if (top < 0 && scroll > 70) {
                setTop(prev => prev + 10);
            }
        } else {
            // ke atas 
            if (top > -150) {
                setTop(prev => prev - 10);
            }
        }
        scrollRef.current = scroll;
    }, [scroll, scrollRef]);

    if (user === null) return;

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} scrollEventThrottle={16} onScroll={e => {
                let pos = e.nativeEvent.contentOffset.y;
                setScroll(pos);
            }} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    load();
                }} />
            }>
                <View style={{...styles.pad, gap: 20 }}>
                    <Inline>
                        <View style={{ flexShrink: 1,flexBasis: 10,flexGrow: 1, gap: 5 }}>
                            <Text size={11}>Halo,</Text>
                            <Text size={16} style={{ fontWeight: '700' }}>{user.name}</Text>
                        </View>
                    </Inline>

                    <Inline style={styles.primary_box}>
                        <View style={{ flexShrink: 1,flexBasis: 10,flexGrow: 1, gap: 5 }}>
                            <Text color="#fff" size={11}>Penjualan Hari Ini</Text>
                            <Text color="#fff" size={20} style={{ fontWeight: '700' }}>{Currency(revenue).encode()}</Text>
                        </View>
                    </Inline>

                    <Inline gap={5}>
                        <Text size={11}>Saldo Tertahan :</Text>
                        <Text>{Currency(pendingBalance).encode()}</Text>
                        <View style={{ flexGrow: 1 }} />
                        <Button accent="secondary" onPress={async () => {
                            let msg = "Halo, saya ingin menarik dana toko saya (ID : " + user?.access?.store?.id + ")";
                            await openLink(`https://wa.me/6285159772902?text=${encodeURIComponent(msg)}`);
                        }}>Tarik</Button>
                    </Inline>
                </View>
                <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10,alignItems: 'center' }}>
                        <View /><View />
                        <Inline style={styles.chip} gap={5} onPress={() => {
                            navigation.navigate('POSNavigator');
                        }}>
                            <Ionicons name="add" size={12} color={COLORS.primary} />
                            <Text size={12} color={COLORS.primary} style={{ fontWeight: '600' }}>Buat Pesanan</Text>
                        </Inline>
                        <Inline style={styles.chip} gap={5} onPress={() => {
                            navigation.navigate('ProductNavigator');
                        }}>
                            <Ionicons name="cube-outline" size={12} color={COLORS.primary} />
                            <Text size={12} color={COLORS.primary} style={{ fontWeight: '600' }}>Tambah Stok</Text>
                        </Inline>
                        <View /><View />
                    </ScrollView>
                </View>

                <View style={styles.pad}>
                    <Text size={14} style={{ fontWeight: '700' }}>Produk Terlaris</Text>
                </View>

                { highestVolume.length === 0 ?
                    <View style={{ paddingVertical: 20,paddingTop: 35 }}>
                        <StateView
                            icon={
                                <Button circle size={64}>
                                    <Ionicons name="bag-outline" size={28} color={'#fff'} />
                                </Button>
                            }
                            title={'Belum ada data'}
                            body={'Tidak ada transaksi hari ini.'}
                            gap={10}
                        />
                    </View>
                    :
                    <View>
                        <ScrollView horizontal contentContainerStyle={{ gap: 20 }} showsHorizontalScrollIndicator={false}>
                            <View />
                            { highestVolume.map((item, i) => (
                                <Pressable key={i} style={styles.product_card}>
                                    <Image 
                                        style={styles.product_card_image}
                                        source={{
                                            uri: `${config.base_url}/storage/${item.product.store_id}/product_images/${item.product_id}/${item.product.images[0].filename}`
                                        }}
                                    />
                                    <Inline gap={10}>
                                        <Text style={{ fontWeight: '700',flexGrow: 1,flexShrink: 1,flexBasis: 100 }}>{item.product.name}</Text>
                                        <Text size={16} color={COLORS.primary} style={{ fontWeight: '600' }}>{item.total_quantity}x</Text>
                                    </Inline>
                                </Pressable>
                            ))}
                            <View />
                        </ScrollView>
                    </View>
                }

                <View style={{ height: 20 }} />
                <View style={{...styles.pad, gap: 20}}>
                    <View style={{ gap: 4 }}>
                        <Text size={14} style={{ fontWeight: '700' }}>Waktu Paling Ramai</Text>
                        <Text size={11} color={COLORS.slate[500]}>Berdasarkan riwayat transaksi 7 hari terakhir.</Text>
                    </View>

                    {hours.length > 0 && (
                        <View style={{ marginTop: 12 }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <BarChart
                                    data={{
                                        labels: hours.map(item => item.time.split("-")[1]),
                                        datasets: [{ data: hours.map(item => item.transactions || 0) }],
                                    }}
                                    width={Math.max(Dimensions.get('window').width - 40, hours.length * 52)}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
                                        style: { borderRadius: 16 },
                                        barPercentage: 1,
                                    }}
                                    style={{ marginVertical: 8, borderRadius: 16, marginLeft: -28 }}
                                />
                            </ScrollView>
                        </View>
                    )}

                    <View />

                    <Toggle
                        options={['Penjualan', 'Pelanggan']}
                        value={viewing} setValue={setViewing}
                    />

                    { viewing === 'Penjualan' &&
                        <OwnerHomeSales user={user} />
                    }

                    { viewing === 'Pelanggan' &&
                        <OwnerHomeCustomer user={user} />
                    }

                    <Inline>
                        <View style={{ gap: 4,flexGrow: 1,flexBasis: 10,flexShrink: 1 }}>
                            <Text size={14} style={{ fontWeight: '700' }}>Insights.</Text>
                            <Text size={11} color={COLORS.slate[500]}>Cari tahu wawasan terbaru.</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('OwnerHomeBlog')}>
                            <Text size={12} color={COLORS.primary} style={{ fontWeight: '700' }}>LAINNYA</Text>
                        </TouchableOpacity>
                    </Inline>
                    
                    { contents.map((cont, c) => (
                        <TouchableOpacity key={c} style={{ gap: 10 }} onPress={() => navigation.navigate('BlogRead', {
                            content: cont,
                        })}>
                            <Image style={styles.blog_image} source={{ uri: cont.cover }} />
                            <Text style={{ fontWeight: '700'}}>{cont.title}</Text>
                            <Inline gap={5}>
                                { cont.categories.map((cat, ca) => (
                                    <Button key={ca} accent="secondary" style={{ padding: 0,paddingHorizontal: 15,height: 30 }}>
                                        <Text size={10} color={COLORS.primary}>{cat.name}</Text>
                                    </Button>
                                ))}
                            </Inline>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* <Inline style={{
                ...styles.header, ...styles.shadow,
                top,
            }}>
                <Text>Header</Text>
            </Inline> */}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: 60,
        flexGrow: 1,
        backgroundColor: "#fff",
        gap: 0,
    },
    pad: {
        padding: 20
    },
    shadow: {
        shadowColor: "#ddd",
        shadowOffset: { width: 1,height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    header: {
        backgroundColor: "#fff",
        position: 'absolute',
        left: 0,right: 0,
        padding: 20,
        paddingTop: 65,
    },
    primary_box: {
        backgroundColor: COLORS.primary,
        padding: 20,
        borderRadius: 12,
    },
    chip: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 999,
        backgroundColor: "#fff",
        padding: 8,
        paddingHorizontal: 12,
    },
    product_card: {
        maxWidth: 35 / 100 * Dimensions.get('screen').width,
        gap: 10,
    },
    product_card_image: {
        backgroundColor: "#eee",
        borderRadius: 8,
        aspectRatio: 1,
        width: '100%'
    },

    blog_image: {
        width: '100%',
        aspectRatio: 5/2,
        borderRadius: 12,
    }
});

export default OwnerHome;