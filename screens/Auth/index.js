import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Welcome from "./Welcome";
import Login from "./Login";
import Onboarding from "./Onboarding";
import Logout from "./Logout";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Logout" component={Logout} options={{ headerShown: false }} />
            <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default AuthNavigator;