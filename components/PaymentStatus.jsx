import { StyleSheet, View } from "react-native";
import { Text, COLORS, Inline } from "ripal-ui";

const PaymentStatus = ({ status, padding = 8, style, textProps }) => {
    let THE_COLOR = "blue";

    if (status === "PAID") {
        THE_COLOR = 'green';
    } else if (status == "PENDING") {
        THE_COLOR = "yellow";
    } else if (status === "EXPIRED" || status === "FAILED" || status === "CANCELLED") {
        THE_COLOR = "red";
    }

    return (
        <Inline gap={0}>
            <View style={{
                ...styles.area,
                backgroundColor: COLORS[THE_COLOR][100],
                padding,
                ...style,
            }}>
                <Text style={{ fontWeight: '700' }} color={COLORS[THE_COLOR][500]} {...textProps}>{status}</Text>
            </View>
        </Inline>
    )
}

const styles = StyleSheet.create({
    area: {
        paddingHorizontal: 10,
        borderRadius: 8,
    }
});
export default PaymentStatus;