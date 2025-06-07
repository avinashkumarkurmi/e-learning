import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONT_SIZES } from "../../constants";

const CourseCard = ({ item, fullScreen }) => {

    
    const [loaded, setLoaded] = useState(false);
    const navigation = useNavigation();


    return (
        <TouchableOpacity
            style={[styles.card, fullScreen ? { width: "100%" ,height: 250} : {}]}
            onPress={() => fullScreen? navigation.navigate("CourseDetails", { courseId: item.courseId }) : navigation.navigate("CourseDetails", { courseId: item.courseid })}
        >
            <Image
                source={{ uri: item.coursethumbnail? item.coursethumbnail : item.thumbnailUrl }}
                style={[styles.image, fullScreen ? { height: 150 } : {},{ opacity: loaded ? 1 : 0 }]}
                onLoad={() => setLoaded(true)}
                contentFit="cover"
            />

            {!loaded && <View style={styles.imagePlaceholder} />}

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title || "Untitled Course"}</Text>
                <Text style={styles.price}>₹{String(item.price)}</Text>
                <Text style={styles.duration}>{String(item.duration)} hr</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 220,
        backgroundColor: COLORS.secondary,
        borderRadius: 15,
        marginRight: 15,
        marginBottom: 15,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    image: {
        // width: autoBatchEnhancer,
        height: 120,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    imagePlaceholder: {
        width: "100%",
        height: 130,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: COLORS.secondary,
        position: "absolute",
    },
    info: {
        padding: 12,
    },
    title: {
        color: COLORS.text,
        fontSize: FONT_SIZES.body,
        fontWeight: "bold",
        marginBottom: 6,
    },
    price: {
        color: COLORS.accent,
        fontSize: FONT_SIZES.h3,
        fontWeight: "600",
    },
    duration: {
        color: COLORS.text,
        fontSize: FONT_SIZES.caption,
        marginTop: 4,
    },
});

export default CourseCard;