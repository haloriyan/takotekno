import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import OwnerReport from "../Report";
import OwnerReportSalesDetail from "../Report/Sales/Detail";
import OwnerReportMovementDetail from "../Report/Movement/Detail";

const Stack = createNativeStackNavigator();

const ReportNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="OwnerReport">
            <Stack.Screen name="OwnerReport" component={OwnerReport} options={{ headerShown: false }} />
            <Stack.Screen name="OwnerReportSalesDetail" component={OwnerReportSalesDetail} options={{ 
                headerTitle: "Penjualan",
                headerBackButtonDisplayMode: "minimal"
            }} />
            <Stack.Screen name="OwnerReportMovementDetail" component={OwnerReportMovementDetail} options={{ 
                headerTitle: "Pergerakan Stok",
                headerBackButtonDisplayMode: "minimal"
            }} />
        </Stack.Navigator>
    )
}

export default ReportNavigator;