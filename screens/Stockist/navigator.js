import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import StockistHome from "./Home";
import OwnerReportMovementDetail from "../Owner/Report/Movement/Detail";
import StockistAdd from "./Add";
import StockistOpname from "./Opname";
import OwnerMoreStoreSelector from "../Owner/More/StoreSelector";

const Stack = createNativeStackNavigator();

const StockistNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="StockistHome" component={StockistHome} options={{ headerShown: false }} />
            <Stack.Screen name="StockistDetail" component={OwnerReportMovementDetail} options={{ 
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Detail"
            }} />
            <Stack.Screen name="StockistAdd" component={StockistAdd} options={{ 
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Tambah Stok"
            }} />
            <Stack.Screen name="StockistOpname" component={StockistOpname} options={{ 
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Opname Stok"
            }} />
            <Stack.Screen name="StockistStoreSelector" component={OwnerMoreStoreSelector} options={{
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Pilih Toko"
            }} />
        </Stack.Navigator>
    )
}

export default StockistNavigator;