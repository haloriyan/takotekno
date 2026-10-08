import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CashierHome from "./Home";
import OwnerReportSalesDetail from "../Owner/Report/Sales/Detail";
import OwnerMoreStoreSelector from "../Owner/More/StoreSelector";

const Stack = createNativeStackNavigator();

const CashierNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CashierHome" component={CashierHome} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="CashierSalesDetail" component={OwnerReportSalesDetail} options={{
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Detail"
            }} />
            <Stack.Screen name="CashierStoreSelector" component={OwnerMoreStoreSelector} options={{
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Pilih Toko"
            }} />
        </Stack.Navigator>
    )
}

export default CashierNavigator;