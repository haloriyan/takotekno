import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, COLORS, Input } from "ripal-ui";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import config from "../../../../config";
import useUser from "../../../../hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";

const OwnerMoreCustomerAdd = () => {
    const [user] = useUser();
    const navigation = useNavigation();
    const [isSubmitting, setSubmitting] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        whatsapp: '',
        point: '0',
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
        if (!canSubmit) return;
        if (isSubmitting) return;
        setSubmitting(true);
        try {
            await axios.post(`${config.base_url}/api/store/customer/store`, {
                name: form.name,
                email: form.email,
                whatsapp: form.whatsapp,
                point: parseInt(form.point) || 0,
            }, {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.form}>
                <Input label="Nama Pelanggan" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="Contoh: Budi Santoso" />
                
                <Input label="Email" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} placeholder="email@example.com" keyboardType="email-address" />
                
                <Input label="WhatsApp / No. Telp" value={form.whatsapp} onChangeText={(v) => setForm({ ...form, whatsapp: v })} placeholder="0812..." keyboardType="phone-pad" />
                
                <Input label="Point" value={form.point} onChangeText={(v) => setForm({ ...form, point: v })} placeholder="0" keyboardType="numeric" />
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
});

export default OwnerMoreCustomerAdd;
