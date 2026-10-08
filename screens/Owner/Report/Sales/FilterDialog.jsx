import React, { useEffect, useState } from "react";
import { Button, COLORS, Dialog, Inline, Text, Toggle } from "ripal-ui";
import config from "../../../../config";
import { View } from "react-native";

const FilterDialog = ({ visible, setVisible, filters, setFilters, onReload }) => {
    const [paymentStatus, setPaymentStatus] = useState(filters.paymentStatus);
    const [paymentMethod, setPaymentMethod] = useState(filters.paymentMethod);

    useEffect(() => {
        setFilters(prev => ({
            ...prev, 
            paymentStatus, paymentMethod
        }));
    }, [paymentStatus, paymentMethod]);

    return (
        <Dialog visible={visible} onClose={() => setVisible(false)}>
            <Dialog.Title>Filter</Dialog.Title>
            <Dialog.Body>
                <View style={{ gap: 10 }}>
                    <Text size={11} color={COLORS.slate[500]} style={{ flexGrow: 1 }}>Metode Pembayaran</Text>
                    <Toggle
                        options={config.enums.PAYMENT_METHODS}
                        objectKey={'label'}
                        value={paymentMethod} setValue={setPaymentMethod}
                    />
                </View>
                <View style={{ gap: 10 }}>
                    <Text size={11} color={COLORS.slate[500]} style={{ flexGrow: 1 }}>Status Pembayaran</Text>
                    <Toggle
                        options={config.enums.PAYMENT_STATUSES}
                        objectKey={'label'}
                        value={paymentStatus} setValue={setPaymentStatus}
                    />
                </View>
            </Dialog.Body>
            <Dialog.Actions>
                <Button onPress={() => {
                    onReload();
                    setVisible(false);
                }}>Terapkan</Button>
            </Dialog.Actions>
        </Dialog>
    )
}

export default FilterDialog;