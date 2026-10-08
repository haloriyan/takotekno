import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Input, Text } from "ripal-ui";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import config from "../../../../config";
import useUser from "../../../../hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";

const OwnerMoreSupplierAdd = () => {
    const [user] = useUser();
    const navigation = useNavigation();
    const [isSubmitting, setSubmitting] = useState(false);
    const [icon, setIcon] = useState(null);
    const [canSubmit, setCanSubmit] = useState(false);

    const [form, setForm] = useState({
        name: '',
        address: '',
        pic_name: '',
        pic_email: '',
        pic_phone: '',
    });

    useEffect(() => {
        setCanSubmit(form.name !== "");
    }, [form.name]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button circle onPress={save} style={{
                    opacity: canSubmit ? 1 : 0.4,
                }}>
                    <Ionicons name="checkmark" color={'#fff'} size={20} />
                </Button>
            )
        })
    }, [navigation, canSubmit, user, form]);

    const save = async () => {
        if (isSubmitting) return;
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('address', form.address);
            formData.append('pic_name', form.pic_name);
            formData.append('pic_email', form.pic_email);
            formData.append('pic_phone', form.pic_phone);

            if (icon !== null) {
                let iconFileName = icon.split('/').pop();
                let iconMatch = /\\.(\\w+)$/.exec(iconFileName);
                let type = iconMatch ? `image/${iconMatch[1]}` : 'image';
                formData.append('icon', {
                    uri: icon,
                    name: iconFileName,
                    type        
                });
            }

            await axios.post(`${config.base_url}/api/store/supplier/store`, formData, {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            navigation.goBack();
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
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

            <View style={styles.form}>
                <Input label="Nama Supplier" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="Contoh: PT. Maju Jaya" />
                
                <Input label="Alamat" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} placeholder="Alamat lengkap supplier" multiline />
                
                <Input label="Nama PIC" value={form.pic_name} onChangeText={(v) => setForm({ ...form, pic_name: v })} placeholder="Nama penanggung jawab" />
                
                <Input label="Email PIC" value={form.pic_email} onChangeText={(v) => setForm({ ...form, pic_email: v })} placeholder="email@example.com" keyboardType="email-address" />
                
                <Input label="No. Telp PIC" value={form.pic_phone} onChangeText={(v) => setForm({ ...form, pic_phone: v })} placeholder="0812..." keyboardType="phone-pad" />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
        gap: 30,
    },
    form: {
        gap: 15,
    },
    icon_area: {
        width: 128,
        height: 128,
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    }
});

export default OwnerMoreSupplierAdd;
