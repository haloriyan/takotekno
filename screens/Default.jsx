import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Inline, Text } from "ripal-ui";

const Default = ({ navigation, route }) => {
    const [scroll, setScroll] = useState(0);
    const scrollRef = useRef(0);
    const [top, setTop] = useState(-100);

    const paragraphs = [ "Di sebuah desa kecil yang dikelilingi bukit hijau, tinggallah seorang anak bernama Lala. Ia adalah anak yang ceria dan sangat suka menjelajahi tempat-tempat baru. Setiap sore, Lala sering berjalan-jalan di dekat hutan bersama kelinci putih kesayangannya, Mimi.", "Suatu pagi, ketika sedang bermain di bawah pohon tua, Lala melihat sesuatu berkilauan di antara rerumputan. Ia mendekat dan menemukan sebuah kunci kecil berwarna emas. Lala mengangkatnya dan memperhatikan bentuknya dengan penuh rasa ingin tahu.", "Lala membawa kunci itu ke rumah dan menunjukkannya kepada Mimi. Kelinci kecil itu hanya memiringkan kepala seolah-olah juga sedang berpikir. Karena tidak mengetahui kegunaannya, Lala memutuskan untuk mencari tahu dari mana kunci tersebut berasal.", "Keesokan harinya, Lala dan Mimi pergi ke hutan. Mereka berjalan melewati jalan setapak yang dipenuhi daun kering dan bunga liar. Setelah berjalan cukup jauh, Lala melihat sesuatu yang aneh di balik semak-semak.", "Di sana terdapat sebuah pintu kecil yang menyatu dengan batang pohon besar. Pintu itu memiliki lubang kunci berbentuk seperti bintang. Lala segera menyadari bahwa kunci emas yang ditemukannya mungkin cocok dengan pintu tersebut.", "Dengan hati-hati, Lala memasukkan kunci ke dalam lubang. Terdengar suara klik yang lembut. Pintu perlahan terbuka dan memperlihatkan sebuah lorong panjang yang dipenuhi cahaya kebiruan.", "Lala menggandeng Mimi dan memasuki lorong tersebut. Di sepanjang jalan, mereka melihat bunga-bunga bercahaya dan kupu-kupu kecil yang terbang di udara. Semakin jauh mereka berjalan, semakin terang cahaya di depan mereka.", "Akhirnya, mereka tiba di sebuah taman yang sangat indah. Pohon-pohon di sana memiliki daun berwarna keemasan, tetapi sebagian besar bunganya tampak layu. Anehnya, taman yang begitu cantik itu terasa sangat sunyi.", "Tiba-tiba, seekor burung kecil terbang turun dan hinggap di sebuah ranting. Burung itu memandang Lala lalu berkata, \"Akhirnya ada manusia yang datang.\" Lala terkejut karena belum pernah mendengar burung berbicara sebelumnya.", "Burung itu memperkenalkan dirinya sebagai Piko, penjaga taman ajaib. Ia menjelaskan bahwa taman tersebut kehilangan sumber cahayanya setelah Batu Matahari menghilang. Jika batu itu tidak ditemukan, seluruh taman akan menjadi gelap.", "Lala merasa kasihan kepada Piko dan semua penghuni taman. Ia bertanya apakah ada cara untuk mendapatkan kembali Batu Matahari. Piko menjawab bahwa batu tersebut terakhir kali terlihat dibawa ke sebuah gua di balik Bukit Biru.", "Meskipun perjalanan menuju gua cukup jauh, Lala memutuskan untuk membantu. Mimi ikut bersamanya tanpa ragu. Piko kemudian memberikan sebuah daun bercahaya yang dapat digunakan sebagai penerang selama perjalanan.", "Mereka berjalan melewati sungai kecil, padang rumput, dan jembatan kayu tua. Di tengah perjalanan, mereka menemukan seekor anak tupai yang terjebak di antara dua batang pohon. Lala berhenti dan membantu membebaskannya.", "Anak tupai itu sangat berterima kasih dan menunjukkan jalan pintas menuju Bukit Biru. Berkat bantuan tersebut, Lala, Mimi, dan Piko dapat mencapai bukit lebih cepat. Di balik sebuah batu besar, mereka akhirnya menemukan pintu masuk sebuah gua.", "Gua itu sangat gelap dan licin. Lala menggunakan daun bercahaya dari Piko untuk menerangi jalan. Setelah berjalan cukup dalam, mereka melihat cahaya keemasan muncul dari balik bebatuan.", "Ternyata cahaya itu berasal dari Batu Matahari. Namun, batu tersebut berada di sebuah lubang yang cukup dalam. Lala harus berhati-hati agar tidak terpeleset ketika mengambilnya.", "Dengan bantuan Mimi dan Piko, Lala berhasil mengambil Batu Matahari. Mereka kemudian berjalan kembali keluar dari gua. Ketika sampai di taman, Lala segera menyerahkan batu itu kepada Piko.", "Piko meletakkan Batu Matahari di tempat semula. Seketika, cahaya keemasan menyebar ke seluruh taman. Bunga-bunga yang layu kembali bermekaran, pohon-pohon menjadi segar, dan para penghuni taman keluar untuk merayakan kembalinya cahaya.", "Sebagai tanda terima kasih, Piko memberikan Lala sebuah biji emas. Lala kemudian pulang bersama Mimi sebelum matahari terbenam. Ia menanam biji tersebut di halaman rumah dan merawatnya setiap hari. Beberapa minggu kemudian, tumbuhlah pohon kecil dengan bunga bercahaya yang mengingatkan Lala bahwa keberanian dan kebaikan selalu dapat membawa cahaya bagi orang lain." ];

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

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container} scrollEventThrottle={16} onScroll={e => {
                let pos = e.nativeEvent.contentOffset.y;
                setScroll(pos);
            }}>
                { paragraphs.map((par, p) => (
                    <Text size={15} lineHeight={28} key={p}>{par}</Text>
                ))}
            </ScrollView>

            <Inline style={{
                ...styles.header,
                top,
            }}>
                <Text>Header</Text>
            </Inline>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 120,
        flexGrow: 1,
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
    }
});

export default Default;