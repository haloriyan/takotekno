import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "ripal-ui";

const StateView = ({ title, body = null, action = null, icon = null }) => {
    return (
        <View style={errorStyles.area}>
            { icon !== null && 
                <>
                {icon}
                <View />
                </>
            }
            <Text size={20} style={{ fontWeight: '600' }}>{title}</Text>
            { body !== null && 
                <Text size={12} align={'center'}>{body}</Text>
            }
            { action !== null && action}
        </View>
    );
}

const errorStyles = StyleSheet.create({
    area: {
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        gap: 20,
    }
});

export default StateView;