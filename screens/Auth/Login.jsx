import React, { useState } from "react";
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Dialog, Inline, Input, Text } from "ripal-ui";
import bg from "../../assets/login.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import config from "../../config";
import CodeInput from "../../components/CodeInput";
import LocalStore from "../../lib/LocalStore";

const Login = ({navigation, route}) => {
    const [email, setEmail] = useState('');
    const [viewing, setViewing] = useState('form');
    const [isSubmitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const submit = async (em = null) => {
        if (isSubmitting) return;
        setSubmitting(true);

        try {
            if (em !== null) {
                setEmail(em);
            }
            
            const response = axios.post(`${config.base_url}/api/user/login`, {
                email: em ?? email,
            });
            const res = (await response).data;

            setViewing('otp');
            setSubmitting(false);
        } catch (err) {
            console.error(err);
            console.error(err.response.data);
        }
    }
    const validateOtp = async code => {
        try {
            const response = await axios.post(`${config.base_url}/api/user/otp`, {
                email, code
            });
            const res = response.data;
            let user = res.user;

            if (res.status === 200) {
                await LocalStore.setItem('user_data', res.user);
                await LocalStore.setItem('user_token', res.token);

                if (res.onboarding) {
                    console.log('onboarding');
                    
                    navigation.replace('AuthNavigator', {
                        screen: "Onboarding",
                        params: {
                            user: res.user,
                            token: res.token,
                        }
                    });
                } else {
                    if (user.access.role === "owner") {
                        navigation.replace('OwnerNavigator');
                    } else if (user.access.role === "cashier") {
                        navigation.replace('CashierNavigator');
                    } else if (user.access.role === "stockist") {
                        navigation.replace('StockistNavigator');
                    }
                }
            } else {
                setErrorMessage(res.message);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                <SafeAreaView style={{ gap: 30 }} edges={['top']}>
                    <Inline>
                        <Inline gap={10} onPress={() => {
                            if (viewing === "form") {
                                navigation.goBack();
                            } else {
                                setViewing('form');
                            }
                        }}>
                            <Ionicons name="arrow-back-outline" size={18} color={COLORS.slate[500]} />
                            <Text color={COLORS.slate[500]} size={12}>Kembali</Text>
                        </Inline>
                    </Inline>

                    <View />

                    {
                        viewing === "form" &&
                        <View style={{ gap: 10 }}>
                            <Text size={28} color={COLORS.slate[800]} style={{fontWeight: '700'}}>Masuk.</Text>
                            <Text>Masukkan email untuk login atau membuat akun jika ini sesi pertamamu.</Text>
                        </View>
                    }
                    {
                        viewing === "otp" &&
                        <View style={{ gap: 10 }}>
                            <Text size={28} color={COLORS.slate[800]} style={{fontWeight: '700'}}>Verifikasi OTP</Text>
                            <Text>Ketik 4 digit kode OTP yang telah dikirim melalui email.</Text>
                        </View>
                    }

                    <View style={{ gap: 20 }}>
                        {
                            viewing === "form" &&
                            <>
                                <Input label="Email" value={email} onChangeText={e => setEmail(e)} />
                                <Button style={{flexGrow: 1,height: 50,opacity: email !== "" ? 1 : 0.6}} onPress={submit}>
                                    {
                                        isSubmitting ?
                                        <ActivityIndicator color={'#fff'} />
                                        :
                                        'Berikutnya'
                                    }
                                </Button>

                                { config.dev &&
                                    <View style={{ gap: 10 }}>
                                        <Text>Login sebagai :</Text>
                                        <Inline style={{ flexWrap: 'wrap'}} gap={10}>
                                            <Button accent="secondary" onPress={() => {
                                                submit('takotekno.com@gmail.com');
                                            }}>Owner</Button>
                                            <Button accent="secondary" onPress={() => {
                                                submit('kasir@gmail.com');
                                            }}>Kasir</Button>
                                            <Button accent="secondary" onPress={() => {
                                                submit('gudang@gmail.com');
                                            }}>Gudang</Button>
                                        </Inline>
                                    </View>
                                }
                            </>
                        }
                        {
                            viewing === "otp" &&
                            <CodeInput onCompleted={code => validateOtp(code)} />
                        }
                    </View>

                </SafeAreaView>
            </ScrollView>

            <Dialog visible={errorMessage !== ""} onClose={() => setErrorMessage('')}>
                <Dialog.Title>{errorMessage}</Dialog.Title>
            </Dialog>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flexGrow: 1,
    }
})

export default Login