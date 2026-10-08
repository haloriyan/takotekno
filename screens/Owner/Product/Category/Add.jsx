import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Input, Switch, Text } from "ripal-ui";
import config from "../../../../config";
import useUser from "../../../../hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";

const OwnerCategoryAdd = ({ navigation, route }) => {
    const [icon, setIcon] = useState(null);
    const [name, setName] = useState('');
    const [pos, setPos] = useState(true);
    const [canSubmit, setCanSubmit] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [user, setUser] = useUser();

    useEffect(() => {
        if (name !== "") {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
    }, [name]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button circle onPress={submit} style={{
                    opacity: canSubmit ? 1 : 0.4,
                }}>
                    <Ionicons name="checkmark" color={'#fff'} size={20} />
                </Button>
            )
        })
    }, [navigation, canSubmit, user, icon, name, pos]);

    const submit = async () => {
        if (isSubmitting) return;
        setSubmitting(true);

        try {
            console.log('submitting', user.token);
            
            let formData = new FormData();
            formData.append('name', name);
            formData.append('pos_available', pos);
            if (icon !== null) {
                console.log('ada icon');
                
                let iconFileName = icon.split('/').pop();
                let iconMatch = /\.(\w+)$/.exec(iconFileName);
                let type = iconMatch ? `image/${iconMatch[1]}` : 'image';
                formData.append('icon', {
                    uri: icon,
                    name: iconFileName,    
                    type        
                });
            }

            const response = await axios.post(`${config.base_url}/api/store/category/store`, {
                name,
                pos_available: pos,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            navigation.goBack();

        } catch (err) {
            console.error(err);
            console.error(err.response.data);
        } finally {
            setSubmitting(false);
        }
    }

    const pickIcon = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
            aspect: [1, 1]
        });

        if (result.canceled) return;

        setIcon(result.assets[0].uri);
    }

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.icon_area} onPress={pickIcon}>
                    { icon === null ?
                        <Ionicons name="image-outline" size={28} color={COLORS.slate[500]} />
                    :
                        <Image 
                            source={{uri: icon}}
                            style={styles.icon_area}
                        />
                    }
                </TouchableOpacity>

                <View style={{ width: '100%',gap: 20  }}>
                    <Input label="Kategori" value={name} onChangeText={e => setName(e)} />
                    <Inline>
                        <View style={{ flexGrow: 1, gap: 6,flexBasis: 10 }}>
                            <Text style={{ fontWeight: '600'}} color={COLORS.slate[800]}>Tampil di POS?</Text>
                            <Text size={11}>Jika tidak aktif maka produk dengan kategori ini tidak akan tampil saat membuat pesanan</Text>
                        </View>
                        <Switch active={pos} setActive={setPos} />
                    </Inline>
                </View>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        // alignItems: 'center',
        // justifyContent: 'center',
        gap: 30,
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    icon_area: {
        width: 128,
        height: 128,
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default OwnerCategoryAdd;