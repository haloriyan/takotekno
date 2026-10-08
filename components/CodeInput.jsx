import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { COLORS, Inline, Text } from "ripal-ui";
import config from "../config";

const CodeInput = ({
    length = 4,
    onChange = () => {},
    onCompleted = () => {},
    hide = false,
    inputMode = "keypad",
}) => {
    const [code, setCode] = useState("");

    const { width, height } = useWindowDimensions();

    const shortestSide = Math.min(width, height);
    const isTablet = shortestSide >= 600;

    // Keep keypad from becoming too wide on tablets
    const keypadWidth = Math.min(width * 0.9, 420);
    const gap = 24;
    const buttonSize = (keypadWidth - gap * 2) / 3;

    const numberFont = isTablet ? 32 : 24;
    const codeFont = isTablet ? 64 : 48;
    const dotSize = isTablet ? 18 : 14;
    const dotArea = isTablet ? 32 : 24;

    const handlePress = (num) => {
        if (code.length >= length) return;

        const newCode = code + num;
        setCode(newCode);
        onChange(newCode);

        if (newCode.length === length) {
            onCompleted(newCode);
            setCode("");
        }
    };

    const handleBackspace = () => {
        if (code.length === 0) return;

        const newCode = code.slice(0, -1);
        setCode(newCode);
        onChange(newCode);
    };

    return (
        <View
            style={{
                gap: 20,
                alignItems: "center",
            }}
        >
            {hide ? (
                <Inline
                    justifyContent="center"
                    gap={12}
                    style={{
                        ...styles.input,
                        backgroundColor: "#ffffff00",
                    }}
                >
                    {Array.from({ length }).map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dotArea,
                                {
                                    width: dotArea,
                                    height: dotArea,
                                    borderColor:
                                        code.length > i
                                            ? COLORS.primary
                                            : "#ddd",
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.dot,
                                    {
                                        width: dotSize,
                                        height: dotSize,
                                        backgroundColor:
                                            code.length > i
                                                ? COLORS.primary
                                                : "#ffffff00",
                                    },
                                ]}
                            />
                        </View>
                    ))}
                </Inline>
            ) : (
                <Inline
                    justifyContent="center"
                    gap={10}
                    style={styles.input}
                >
                    {Array.from({ length }).map((_, i) => (
                        <Text
                            key={i}
                            size={codeFont}
                            style={{
                                width: codeFont * 0.7,
                                textAlign: "center",
                                fontWeight: "700",
                            }}
                        >
                            {code[i] ?? ""}
                        </Text>
                    ))}
                </Inline>
            )}

            {/* Keypad */}
            <View
                style={{
                    width: keypadWidth,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    rowGap: gap,
                }}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={[
                            styles.btn,
                            {
                                width: buttonSize,
                                height: buttonSize,
                            },
                        ]}
                        onPress={() => handlePress(num)}
                    >
                        <Text size={numberFont}>{num}</Text>
                    </TouchableOpacity>
                ))}

                {/* Empty placeholder */}
                <View
                    style={{
                        width: buttonSize,
                        height: buttonSize,
                    }}
                />

                <TouchableOpacity
                    style={[
                        styles.btn,
                        {
                            width: buttonSize,
                            height: buttonSize,
                        },
                    ]}
                    onPress={() => handlePress(0)}
                >
                    <Text size={numberFont}>0</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.btn,
                        {
                            width: buttonSize,
                            height: buttonSize,
                        },
                    ]}
                    onPress={handleBackspace}
                >
                    <Ionicons
                        name="backspace-outline"
                        size={isTablet ? 42 : 32}
                        color={COLORS.slate[400]}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    btn: {
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
    },
    input: {
        minHeight: 56,
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        borderRadius: 999,
    },
    dotArea: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        borderWidth: 0.5,
    },
});

export default CodeInput;