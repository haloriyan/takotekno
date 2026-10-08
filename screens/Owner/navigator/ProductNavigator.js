import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import OwnerHome from "../Home";
import OwnerProduct from "../Product";
import OwnerProductAdd from "../Product/Add";
import OwnerProductEdit from "../Product/Edit";
import OwnerCategoryAdd from "../Product/Category/Add";
import OwnerCategoryEdit from "../Product/Category/Edit";
import OwnerProductDetail from "../Product/Detail";
import OwnerProductStockAdd from "../Product/Detail/Stock/Add";

const Stack = createNativeStackNavigator();

const ProductNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="OwnerProduct">
            <Stack.Screen name="OwnerProduct" component={OwnerProduct} options={{ headerShown: false }} />
            <Stack.Screen name="OwnerProductDetail" component={OwnerProductDetail} options={{ 
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Detail Produk",
            }} />
            <Stack.Screen name="OwnerProductAdd" component={OwnerProductAdd} options={{ 
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Tambah Produk",
            }} />
            <Stack.Screen name="OwnerProductEdit" component={OwnerProductEdit} options={{ 
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Edit Produk",
            }} />

            <Stack.Screen name="OwnerProductStockAdd" component={OwnerProductStockAdd} options={{ 
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Tambah Stok Masuk",
            }} />

            <Stack.Screen name="OwnerCategoryAdd" component={OwnerCategoryAdd} options={{ 
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Tambah Kategori",
            }} />
            <Stack.Screen name="OwnerCategoryEdit" component={OwnerCategoryEdit} options={{ 
                headerShown: true,
                headerBackButtonDisplayMode: "minimal",
                headerTitle: "Edit Kategori",
            }} />
        </Stack.Navigator>
    )
}

export default ProductNavigator;