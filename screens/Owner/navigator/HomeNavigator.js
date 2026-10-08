import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import OwnerHome from "../Home";
import BlogRead from "../Home/BlogRead";
import OwnerHomeBlog from "../Home/Blog";
import OwnerHomeBlogCategory from "../Home/BlogCategory";

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="OwnerHome">
            <Stack.Screen name="OwnerHome" component={OwnerHome} options={{ headerShown: false }} />
            <Stack.Screen name="OwnerHomeBlog" component={OwnerHomeBlog} options={{ headerShown: false }} />
            <Stack.Screen name="OwnerHomeBlogCategory" component={OwnerHomeBlogCategory} options={{ headerShown: false }} />
            <Stack.Screen name="BlogRead" component={BlogRead} options={{ 
                headerBackButtonDisplayMode: "minimal"
            }} />
        </Stack.Navigator>
    )
}

export default HomeNavigator;