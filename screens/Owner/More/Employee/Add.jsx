import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Dialog, Inline, Input, Text } from "ripal-ui";
import config from "../../../../config";

const OwnerMoreEmployeeAdd = ({ isAdding, setAdding, user, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('cashier');
    const [canSubmit, setCanSubmit] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    const isValidEmail = theEmail => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(theEmail);
    }

    useEffect(() => {
        if (email !== "" && isValidEmail(email)) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
    }, [email]);

    const submit = async () => {
        if (isSubmitting) return;
        setSubmitting(true);

        try {
            const response = await axios.post(`${config.base_url}/api/store/employee/store`, {
                role, email,
            }, { headers: { Authorization: `Bearer ${user.token}` }});
            let res = response.data;

            onSuccess(res);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog visible={isAdding} onClose={() => setAdding(false)}>
            <Dialog.Title>Tambah Karyawan</Dialog.Title>
            <Dialog.Body>
                <View style={{ gap: 4 }}>
                    <Input keyboardType="email-address" label="Email" value={email} onChangeText={e => setEmail(e)} />
                    { isValidEmail(email) &&
                        <Text size={11} color={COLORS.slate[400]}>{email} akan digunakan untuk login ke aplikasi nanti.</Text>
                    }
                </View>
                <Inline gap={10}>
                    <Text size={12} style={{ flexGrow: 1 }}>Peran :</Text>
                    <TouchableOpacity onPress={() => setRole('cashier')} style={[styles.chip, role === 'cashier' ? styles.chip_active : null]}>
                        <Text size={12} color={role === 'cashier' ? COLORS.primary : COLORS.slate[500]} style={{ fontWeight: role === 'cashier' ? '600' : '400' }}>Kasir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRole('stockist')} style={[styles.chip, role === 'stockist' ? styles.chip_active : null]}>
                        <Text size={12} color={role === 'stockist' ? COLORS.primary : COLORS.slate[500]} style={{ fontWeight: role === 'stockist' ? '600' : '400' }}>Staf Gudang</Text>
                    </TouchableOpacity>
                </Inline>
            </Dialog.Body>
            <Dialog.Actions>
                <Button style={{ opacity: canSubmit ? 1 : 0.4 }} onPress={() => submit()}>
                    { isSubmitting ? <ActivityIndicator color={'#fff'} /> : <Text color="#fff" style={{ fontWeight: 600 }}>Tambahkan</Text> }
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

const styles = StyleSheet.create({
    chip: {
        backgroundColor: "#fff",
        padding: 6,
        paddingHorizontal: 15,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: 'center',
        justifyContent: 'center'
    },
    chip_active: {
        borderColor: COLORS.primary,
    },
    shadow: {
        shadowColor: '#ddd',
        shadowOffset: { width: 1, height: 1, },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
});

export default OwnerMoreEmployeeAdd;