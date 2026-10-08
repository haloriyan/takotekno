import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import HomeNavigator from "./navigator/HomeNavigator";
import MoreNavigator from "./navigator/MoreNavigator";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ProductNavigator from "./navigator/ProductNavigator";
import POSNavigator from "../POS";
import ReportNavigator from "./navigator/ReportNavigator";

const Tab = createBottomTabNavigator();

const OwnerNavigator = () => {
    const navigation = useNavigation();

    return (
        <Tab.Navigator initialRouteName="HomeNavigator">
            <Tab.Screen name="HomeNavigator" component={HomeNavigator} options={{ 
                headerShown: false,
                tabBarLabel: "Home",
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="home-outline" size={size} color={color}  />
                )
            }} />
            <Tab.Screen name="ProductNavigator" component={ProductNavigator} options={{ 
                headerShown: false,
                tabBarLabel: "Produk",
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="cube-outline" size={size} color={color}  />
                )
            }} />
            <Tab.Screen
                name="POSNavigatorBtn"
                component={POSNavigator}
                options={{
                    headerShown: true,
                    tabBarLabel: "Buat Order",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-outline" size={size} color={color} />   
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        navigation.navigate('POSNavigator');
                        e.preventDefault(); // prevent navigation
                    },
                }}  
            />
            <Tab.Screen name="ReportNavigator" component={ReportNavigator} options={{ 
                headerShown: false,
                tabBarLabel: "Laporan",
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="bar-chart-outline" size={size} color={color}  />
                )
            }} />
            <Tab.Screen name="MoreNavigator" component={MoreNavigator} options={{ 
                headerShown: false,
                tabBarLabel: "Menu",
                tabBarIcon: ({color, size}) => (
                    <MaterialIcons name="more-horiz" size={size} color={color}  />
                )
            }} />
        </Tab.Navigator>
    )
}

export default OwnerNavigator
