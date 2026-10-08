import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Inline, Input, Text, Toggle } from "ripal-ui";
import config from "../../config";
import Currency from "../../lib/Currency";
import { Ionicons } from "@expo/vector-icons";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import Initial from "../../lib/Initial";
import Done from "./Done";
import Grid from "@haloriyan/grid";

const Summary = ({ 
    carts, categories, 
    addToCart, minusCart, 
    setShowSummary, user, 
    isPrinting, setPrinting, 
    sales, setSales, 
    paymentMethod, setPaymentMethod,
    paymentStatus, setPaymentStatus,
}) => {
    const [customer, setCustomer] = useState('');
    const [customers, setCustomers] = useState([]);
    const [changeCustomer, setChangeCustomer] = useState(false);
    const [isSearching, setSearching] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [isDone, setDone] = useState(false);
    const [changePayment, setChangePayment] = useState(false);

    const debounceCustomerSearch = useDebouncedCallback(() => {
        searchCustomer();
    }, 1000);

    const searchCustomer = async () => {
        if (isSearching) return;

        setSearching(true);
        try {
            const response = await axios.get(`${config.base_url}/api/store/customer/search?q=${customer}&limit=3`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            let res = response.data;
            setCustomers(res.customers);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setSearching(false);
        }
    }

    useEffect(() => {
        if (customer !== "" && customer !== null) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
    }, [customer]);

    useEffect(() => {
        if (paymentMethod.key === "CASH") {
            setPaymentStatus({ key: "PAID", label: "Lunas", icon: "qr-code-outline" });
        }
    }, [paymentMethod])

    const placeOrder = async () => {
        if (isSubmitting) return;
        setSubmitting(true);

        try {
            const response = await axios.post(`${config.base_url}/api/pos/place`, {
                customer,
                payment_method: paymentMethod.key,
                payment_status: paymentStatus.key,
            }, {
                headers: { Authorization: `Bearer ${user.token}`}
            });
            let res = response.data;
            

            setSales(res.sales);
            setDone(true);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setSubmitting(false);
        }
    }

    if (isDone) return (
        <Done 
            sales={sales} setSales={setSales}
            setDone={setDone} setShowSummary={setShowSummary} 
            isPrinting={isPrinting} setPrinting={setPrinting}
        />
    )

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Inline>
                <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '600', flexGrow: 1 }}>Ringkasan</Text>
                <TouchableOpacity onPress={() => setShowSummary(false)}>
                    <Ionicons name="close-outline" size={24} />
                </TouchableOpacity>
            </Inline>
            <View style={{ gap: 20 }}>
                <Input 
                    label="Pelanggan" 
                    value={
                        typeof customer === 'string' ? customer : customer.name
                    }
                    onChangeText={e => {
                        setCustomers([]);
                        setCustomer(e);
                        debounceCustomerSearch();
                    }}
                />
            </View>
            
            { customers.length > 0 &&
                <View style={{ gap: 10 }}>
                    { customers.map((cust, c) => (
                        <Inline gap={10} key={c} onPress={() => {
                            setCustomers([]);
                            setCustomer(cust);
                        }}>
                            <Button circle size={42}>
                                <Text color="#fff" style={{ fontWeight: '700' }}>{Initial(cust.name)}</Text>
                            </Button>
                            <Text color={COLORS.slate[800]} style={{ flexGrow: 1,fontWeight: '600' }}>{cust.name}</Text>
                            <Button style={{ height: 38 }}>Pilih</Button>
                        </Inline>
                    ))}
                </View>
            }
            { !changePayment ?
                <Inline>
                    <View style={{ flexBasis: 10, flexGrow: 1,flexShrink: 1,gap: 5 }}>
                        <Text size={12} color={COLORS.slate[500]}>Pembayaran</Text>
                        <Text>{paymentMethod.label}</Text>
                    </View>
                    <Button accent="secondary" style={{ height: 36,padding: 0 }} onPress={() => {
                        setChangePayment(true);
                    }}>Ubah</Button>
                </Inline>
                :
                <View style={{ gap: 10 }}>
                    <Text size={12} color={COLORS.slate[500]}>Pilih Pembayaran</Text>
                    <Grid col={2}>
                        { config.enums.PAYMENT_METHODS.filter(item => item.key !== null).map((meth, m) => {
                            let isSelected = paymentMethod.key === meth.key;
                            return (
                                <Inline key={m} style={[styles.payment_item, isSelected ? styles.payment_item_active : null]} onPress={() => {
                                    setPaymentMethod(meth);
                                    setChangePayment(false);
                                }}>
                                    <Ionicons 
                                        name={meth.icon}
                                        size={32}
                                        color={isSelected ? COLORS.primary : COLORS.slate[500]}
                                    />
                                    <Text 
                                        color={isSelected ? COLORS.primary : COLORS.slate[500]}
                                        style={{ fontWeight: isSelected ? '700' : '400' }}
                                    >
                                        {meth.label}
                                    </Text>
                                </Inline>
                            )
                        })}
                    </Grid>
                </View>
            }

            { paymentMethod.key === 'CASH' &&
                <Inline>
                    <Text size={12} color={COLORS.slate[500]} style={{ flexGrow: 1 }}>Status Pembayaran</Text>
                    <Toggle
                        // options={config.enums.PAYMENT_STATUSES}
                        options={config.enums.PAYMENT_STATUSES.filter(item => item.key !== null)}
                        objectKey={'label'}
                        value={paymentStatus} setValue={setPaymentStatus}
                    />
                </Inline>
            }

            <View />
            <Text size={12} color={COLORS.slate[500]}>Item(s)</Text>
            { carts.map((cart, c) => {
                if (!cart.is_composition) {
                    // let cantMore = (cart.stock.quantity <= 0);
                    let productHasntQuantity = cart.stock.quantity <= 0;
                    let validStock = true;
                    let cantMore = false;

                    cart.children.map((chi, c) => {
                        if (validStock) {
                            if (chi.stock.quantity <= chi.composition.quantity) {
                                validStock = false;
                            }
                        }
                    })

                    if (productHasntQuantity || !validStock) {
                        cantMore = true;
                    }

                    return (
                        <Inline key={c} gap={15}>
                            <Image 
                                style={{
                                    ...styles.product_image,
                                    width: 80,
                                }} 
                                source={{ uri: `${config.base_url}/storage/${cart.product.store_id}/product_images/${cart.product.id}/${cart.product.images[0].filename}` }}
                            />
                            <View style={{ flexBasis: 10, flexGrow: 1, gap: 4 }}>
                                <Text size={16} color={COLORS.slate[800]}>{cart.product.name}</Text>
                                <Inline gap={5}>
                                    <Ionicons name="cube" size={11} color={COLORS.slate[400]} />
                                    <Text size={11} color={COLORS.slate[400]}>{cart.stock.label}</Text>
                                </Inline>
                                <View /><View />
                                <Text size={12} color={COLORS.primary}>{Currency(cart.total_price).encode()}</Text>
                            </View>

                            <Inline gap={20}>
                                <TouchableOpacity style={styles.qty_btn} onPress={() => {
                                    minusCart(cart.id);
                                }}>
                                    <Ionicons name="remove-outline" />
                                </TouchableOpacity>
                                <Text color={COLORS.slate[800]} size={16} style={{ fontWeight: '500' }}>
                                    { cart.quantity }
                                </Text>
                                <TouchableOpacity style={{
                                    ...styles.qty_btn,
                                    opacity: cantMore ? 0 : 1,
                                }} onPress={() => {
                                    if (cantMore) return;

                                    let done = false;
                                    
                                    categories.map((cat, c) => {
                                        cat.products.map((prod, p) => {
                                            if (prod.id === cart.product_id && done == false) {
                                                done = true;
                                                addToCart(prod);
                                            }
                                        });
                                    });
                                }}>
                                    <Ionicons name="add-outline" />
                                </TouchableOpacity>
                            </Inline>
                        </Inline>
                    )
                }
            })}

            <View style={{ flexGrow: 1 }} />

            <Button
                style={{
                    width: '100%',
                    opacity: canSubmit ? 1 : 0.6
                }}
                onPress={placeOrder}
            >Buat Pesanan</Button>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 20,
        flexGrow: 1,
    },
    product_image: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: "#eee",
        borderRadius: 12,
    },
    qty_btn: {
        width: 28,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center'
    },
    payment_item: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 15,
        gap: 10,
    },
    payment_item_active: {
        borderColor: COLORS.primary,
    }
});

export default Summary;