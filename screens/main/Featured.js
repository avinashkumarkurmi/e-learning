import { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Animated, Text, View, ScrollView, StyleSheet } from "react-native";
import { fetchPopularCourses, fetchReactCourses, fetchJavaScriptCourses } from "../../uitil/user";
import CourseCard from "../../components/userDefine/CourseCard";
import { COLORS, FONTS, FONT_SIZES } from "../../constants";


function Featured({ navigation }) {
    
    const [popularCourses, setPopularCourses] = useState([]);
    const [reactCourses, setReactCourses] = useState([]);
    const [javaScriptCourses, setJavaScriptCourses] = useState([]);
    const scrollY = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            const parent = navigation.getParent();
            parent?.setOptions({ tabBarStyle: { display: "flex", position: 'absolute',
                height: 63, // Ensures enough space
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                backgroundColor: 'white',
                elevation: 10,

                paddingBottom: 10, } });
            return () => parent?.setOptions({ tabBarStyle: { display: "none" } });
        }, [navigation])
    );

    useEffect(() => {
        async function fetchPopularCoursesAsync() {
            try {
                const courses = await fetchPopularCourses();
                setPopularCourses(courses);
            } catch (error) {
                console.error("Error fetching popular courses:", error);
            }
        }
        
        async function fetchRandomCoursesAsync() {
            try {
                const courses = await fetchReactCourses();
                setReactCourses(courses);
            } catch (error) {
                console.error("Error fetching react courses:", error);
            }
        }
        async function fetchJavaScriptCoursesAsync() {
            try {
                const courses = await fetchJavaScriptCourses();
                setJavaScriptCourses(courses);
            } catch (error) {
                console.error("Error fetching react courses:", error);
            }
        }
        fetchPopularCoursesAsync();
        fetchRandomCoursesAsync()
        fetchJavaScriptCoursesAsync()
    }, [navigation]);

    return (
        <Animated.ScrollView
            style={styles.root}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                useNativeDriver: true,
            })}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.userGreet1}>Hello Avinash</Text>
                <Text style={styles.userGreet2}>Have a Nice Learning Experience</Text>
                
            </View>
            <View style={styles.couresContainer}>
            <Text style={styles.titleOfCouresContainer}>Popular Courses</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            
                {popularCourses.map((item) => (
                    <CourseCard key={item.courseid.toString()} item={item} navigation={navigation} fullScreen={false}/>
                ))}
            </ScrollView>
            </View>

            <View style={styles.couresContainer}>
            <Text style={styles.titleOfCouresContainer}>React Courses</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            
                {reactCourses.map((item) => (
                    <CourseCard key={item.courseid.toString()} item={item} navigation={navigation} />
                ))}
            </ScrollView>
            </View>

            <View style={styles.couresContainer}>
            <Text style={styles.titleOfCouresContainer}>JavaScript Courses</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            
                {javaScriptCourses.map((item) => (
                    <CourseCard key={item.courseid.toString()} item={item} navigation={navigation} />
                ))}
            </ScrollView>
            </View>
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.background,  // Clean white/light gray
    },
    header: {
        // backgroundColor: COLORS.S, // Soft blue for a modern header
        paddingHorizontal: 20,
        paddingTop: 17,
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    
        marginBottom: 10,
    },
    userGreet1: {
        color: COLORS.primary, // Deep blue for emphasis
        fontSize: FONT_SIZES.h1,
        fontFamily: FONTS.primary,
        fontWeight: "bold",
    },
    userGreet2: {
        color: COLORS.text, // Dark gray for readability
        fontSize: FONT_SIZES.body,
        fontFamily: FONTS.secondary,
    },
    couresContainer:{
        paddingHorizontal: 10,
        marginBottom: 29
        // backgroundColor: "green",
       
    },
    titleOfCouresContainer: {
        color: COLORS.text, // White for contrast
        fontSize: (FONT_SIZES.h3 - 2),
        fontFamily: FONTS.primary,
        fontWeight: "bold",
        marginVertical: 5,
        // marginBottom: 10,
    },
    horizontalScroll: {
        height: 250,
        // paddingHorizontal: 10,
    },
});

export default Featured;
