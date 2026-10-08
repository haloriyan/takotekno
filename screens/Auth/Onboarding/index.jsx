import React, { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, COLORS, Inline, Text } from "ripal-ui";
import { Ionicons } from "@expo/vector-icons";
import OnboardingWelcome from "./Welcome";
import OnboardingStore from "./Store";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import config from "../../../config";

const Onboarding = ({navigation, route}) => {
    const { user, token } = route.params;
    const [step, setStep] = useState(route?.params?.no_welcome ? 'store' : 'welcome'); // welcome, store, product

    const [storeName, setStoreName] = useState('');
    const [storeIcon, setStoreIcon] = useState(null);

    const submit = async (props) => {
        console.log(token, user);
        
        let formData = new FormData();
        if (storeIcon !== null) {
            let iconFileName = storeIcon.split('/').pop();
            let iconMatch = /\.(\w+)$/.exec(iconFileName);
            let type = iconMatch ? `image/${iconMatch[1]}` : 'image';
            formData.append('icon', {
                uri: storeIcon,
                name: iconFileName,    
                type        
            });
        }

        formData.append('name', storeName);
        formData.append('address', props.address);
        formData.append('latitude', props.latitude);
        formData.append('longitude', props.longitude);
        
        try {
            const response = await axios.post(`${config.base_url}/api/store/onboarding`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const res = response.data;
            
            navigation.replace('Splash');
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
            
        }
    }
    
    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.container}>
                {
                    step === "welcome" &&
                    <OnboardingWelcome setStep={setStep} />
                }
                {
                    step === "store" &&
                    <OnboardingStore 
                        setStep={setStep} 
                        name={storeName} setName={setStoreName} 
                        icon={storeIcon} setIcon={setStoreIcon}
                        submit={submit}
                    />
                }

            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
    },
    
})

export default Onboarding