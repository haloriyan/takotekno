import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import POSHome from "./Home";

const Stack = createNativeStackNavigator();

const POSNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="POSHome" component={POSHome} options={{ 
                headerShown: false,
                // headerTitle: "Buat Order"
                contentStyle: {
                    backgroundColor: "#fff"
                }
            }} />
        </Stack.Navigator>
    )
}

export default POSNavigator;