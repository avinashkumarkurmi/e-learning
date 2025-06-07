import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native"; // If navigation is needed
import styles from "./styles"; // Ensure you have the correct styles imported

const CourseCard = ({ item }) => {
    const [loaded, setLoaded] = useState(false);
    const navigation = useNavigation(); // If navigation is not passed as a prop

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("CourseDetails", { courseId: item.courseid })}
        >
            {/* Smooth Image Loading with Fade-in */}
            <FastImage
                source={{ uri: item.coursethumbnail }}
                style={[styles.image, { opacity: loaded ? 1 : 0 }]}
                onLoad={() => setLoaded(true)}
                resizeMode={FastImage.resizeMode.cover}
            />
            {!loaded && <View style={styles.imagePlaceholder} />} {/* Placeholder While Loading */}

            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.duration}>{item.duration} hours</Text>
            </View>
        </TouchableOpacity>
    );
};

export default CourseCard;
