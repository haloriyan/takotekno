import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import Splash from "./screens/Auth/Splash";
import OwnerNavigator from "./screens/Owner";
import AuthNavigator from "./screens/Auth";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import POSNavigator from "./screens/POS";
import Upgrade from "./screens/Upgrade";
import UpgradeHistory from "./screens/UpgradeHistory";
import { ToastProvider } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import CashierNavigator from "./screens/Cashier/navigator";
import StockistNavigator from "./screens/Stockist/navigator";
import { StatusBar } from "expo-status-bar";
import AppPermissions from "./screens/Permissions";
import Presence from "./screens/Presence";
import { setupNotificationNavigation } from "./lib/navigation/SetupNotification";
import { navigationRef } from "./lib/navigation/navigation";

const Stack = createNativeStackNavigator();

const App = () => {
    useEffect(() => {
        return setupNotificationNavigation();
    }, []);
    return (
        <GestureHandlerRootView>
            <StatusBar style="dark" />
            <ToastProvider
                successIcon={<Ionicons name="checkmark-circle" color={'#fff'} />}
            >
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator initialRouteName="Splash" screenOptions={{
                        contentStyle: {
                            backgroundColor: "#ffffff"
                        }
                    }}>
                        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                        <Stack.Screen name="AuthNavigator" component={AuthNavigator} options={{ headerShown: false }} />
                        <Stack.Screen name="POSNavigator" component={POSNavigator} options={{ headerShown: false }} />

                        <Stack.Screen name="OwnerNavigator" component={OwnerNavigator} options={{ headerShown: false }} />
                        <Stack.Screen name="CashierNavigator" component={CashierNavigator} options={{ headerShown: false }} />
                        <Stack.Screen name="StockistNavigator" component={StockistNavigator} options={{ headerShown: false }} />

                        <Stack.Screen name="Upgrade" component={Upgrade} options={{ headerShown: false }} />
                        <Stack.Screen name="UpgradeHistory" component={UpgradeHistory} options={{
                            headerTitle: "Riwayat Transaksi",
                            headerBackButtonDisplayMode: "minimal"
                        }} />
                        <Stack.Screen name="AppPermissions" component={AppPermissions} options={{
                            headerTitle: "Izin Aplikasi",
                            headerBackButtonDisplayMode: "minimal"
                        }} />
                        <Stack.Screen name="Presence" component={Presence} options={{
                            headerTitle: "Presensi",
                            headerBackButtonDisplayMode: "minimal"
                        }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </ToastProvider>
        </GestureHandlerRootView>
    )
}

export default App;