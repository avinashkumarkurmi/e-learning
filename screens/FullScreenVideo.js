import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { Ionicons } from "@expo/vector-icons";

export default function FullScreenVideo({ route }) {
    const { videoUrl } = route.params;
    const videoRef = useRef(null);



    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={{ uri: videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                shouldPlay
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    controlOverlay: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -25 }, { translateY: -25 }],
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 50,
        padding: 10,
    },
});
