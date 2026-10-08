import axios from "axios";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Dialog, Inline, Text } from "ripal-ui";
import config from "../../../../config";

const OwnerMoreEmployeeRole = ({ isRoling, setRoling, user, onSuccess, access }) => {
    const [role, setRole] = useState(access?.role);
    const [isLoading, setLoading] = useState(false);

    const submit = async () => {
        if (isLoading) return;
        setLoading(true);

        try {
            const response = await axios.post(`${config.base_url}/api/store/employee/role`, {
                role,
                user_id: access.user.id,
                store_id: access.store_id,
            }, { headers: { Authorization: `Bearer ${user?.token}`}});
            let res = response.data;

            onSuccess(res);
        } catch (err) {
            // 
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog visible={isRoling} onClose={() => {
            setRoling(false);
        }}>
            <Dialog.Title>Ubah Peran</Dialog.Title>
            <Dialog.Body>
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
                <Button onPress={() => submit()} color={COLORS.green[500]}>
                    { isLoading ? <ActivityIndicator size={12} color={'#fff'} /> : <Text color="#fff" style={{ fontWeight: '600' }}>Simpan</Text>}
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
});

export default OwnerMoreEmployeeRole;