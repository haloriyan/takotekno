import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import OwnerMore from "../More";
import OwnerMoreSupplier from "../More/Supplier";
import OwnerMoreSupplierAdd from "../More/Supplier/Add";
import OwnerMoreSupplierEdit from "../More/Supplier/Edit";
import OwnerMoreCustomer from "../More/Customer";
import OwnerMoreCustomerAdd from "../More/Customer/Add";
import OwnerMoreCustomerEdit from "../More/Customer/Edit";
import OwnerMoreStore from "../More/Store";
import OwnerMoreEmployee from "../More/Employee";
import OwnerMoreStoreSelector from "../More/StoreSelector";
import OwnerMoreCustomerDetail from "../More/Customer/Detail";
import OwnerMoreReview from "../More/Review";
import OwnerMoreSchedule from "../More/Schedule";
import OwnerMoreScheduleCreate from "../More/Schedule/Create";
import OwnerMoreScheduleDetail from "../More/Schedule/Detail";
import OwnerMoreScheduleDetailMore from "../More/Schedule/More";

const Stack = createNativeStackNavigator();

const HEADER_CONFIG = {
    headerBackButtonDisplayMode: "minimal"
};

const MoreNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="OwnerMore">
            <Stack.Screen name="OwnerMore" component={OwnerMore} options={{ headerShown: false }} />

            <Stack.Screen name="OwnerMoreStore" component={OwnerMoreStore} options={{
                ...HEADER_CONFIG,
                headerTitle: "Toko",
            }} />
            <Stack.Screen name="OwnerMoreStoreSelector" component={OwnerMoreStoreSelector} options={{
                ...HEADER_CONFIG,
                headerTitle: "Pilih Toko",
            }} />

            <Stack.Screen name="OwnerMoreEmployee" component={OwnerMoreEmployee} options={{
                ...HEADER_CONFIG,
                headerTitle: "Karyawan",
            }} />
            <Stack.Screen name="OwnerMoreCustomer" component={OwnerMoreCustomer} options={{ 
                ...HEADER_CONFIG,
                headerTitle: "Pelanggan",
            }} />
            <Stack.Screen name="OwnerMoreCustomerDetail" component={OwnerMoreCustomerDetail} options={{ 
                ...HEADER_CONFIG,
                headerTitle: "Detail Pelanggan",
            }} />
            <Stack.Screen name="OwnerMoreCustomerAdd" component={OwnerMoreCustomerAdd} options={{ 
                ...HEADER_CONFIG,
                headerTitle: "Tambah Pelanggan",
            }} />
            <Stack.Screen name="OwnerMoreCustomerEdit" component={OwnerMoreCustomerEdit} options={{ 
                ...HEADER_CONFIG,
                headerTitle: "Edit Pelanggan",
            }} />
            <Stack.Screen name="OwnerMoreSupplier" component={OwnerMoreSupplier} options={{ 
                ...HEADER_CONFIG,
                headerTitle: "Supplier",
            }} />
            <Stack.Screen name="OwnerMoreSupplierAdd" component={OwnerMoreSupplierAdd} options={{ 
                ...HEADER_CONFIG,
                headerTitle: "Tambah Supplier",
            }} />
            <Stack.Screen name="OwnerMoreSupplierEdit" component={OwnerMoreSupplierEdit} options={{ 
                ...HEADER_CONFIG,
                headerTitle: "Edit Supplier",
            }} />
            <Stack.Screen name="OwnerMoreReview" component={OwnerMoreReview} options={{
                ...HEADER_CONFIG,
                headerTitle: "Ulasan",
            }} />
            <Stack.Screen name="OwnerMoreSchedule" component={OwnerMoreSchedule} options={{
                ...HEADER_CONFIG,
                headerTitle: "Jadwal",
            }} />
            <Stack.Screen name="OwnerMoreScheduleCreate" component={OwnerMoreScheduleCreate} options={{
                ...HEADER_CONFIG,
                headerTitle: "Buat Jadwal",
            }} />
            <Stack.Screen name="OwnerMoreScheduleDetail" component={OwnerMoreScheduleDetail} options={{
                ...HEADER_CONFIG,
                headerTitle: "Detail",
            }} />
            <Stack.Screen name="OwnerMoreScheduleDetailMore" component={OwnerMoreScheduleDetailMore} options={{
                ...HEADER_CONFIG,
                headerTitle: "Detail",
            }} />
        </Stack.Navigator>
    )
}

export default MoreNavigator;