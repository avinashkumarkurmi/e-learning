import { Edit } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, FONT_SIZES } from "../../constants";
import  util  from "util";

const AllCourses = ({ navigation }) => {
    const [courses, setCourses] = useState([]);
    const [name, setName] = useState("");
    const instructorState = useSelector((state) => state.reducer.instructor);
    
    useEffect(() => {
        console.log(instructorState,"instructorState");
        
        setCourses(instructorState.instructorInfo?.user?.courses);
        const firstName = instructorState.instructorInfo?.user?.instructor?.name?.first
        setName(firstName)
    }, [instructorState]);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ViewCourseScreen", { course: item.course })}>
            <Image source={{ uri: item.course.courseThumbnail }} style={styles.thumbnail} />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.course.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.course.description}</Text>
                <View style={styles.editContainor}>
                    <Text style={styles.price}>₹{item.course.price}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("EditCourses", { course: item.course })}>
                    <View style={[styles.editButton,{backgroundColor: COLORS.secondary,paddingVertical: 8,
                                                                            paddingHorizontal: 12,
                                                                            borderRadius: 10,
                                                                            alignSelf: "center",
                                                                            marginTop: 8,}]}>
                        <Text style={[styles.editButtonText,{color: COLORS.primary,
                                                                        fontSize: FONT_SIZES.text,
                                                                        fontWeight: "500",}]}>Edit</Text>
                    </View>

                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            
            <Text style={styles.header}>Welcome {name},</Text>
            <Text style={{color:COLORS.text,fontSize:FONT_SIZES.text, marginLeft:10, fontFamily:FONTS.primary}}>All Your Courses</Text>
            {courses.length > 0 ? (
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.course.courseId.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
            ) : (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:COLORS.text,fontSize:FONT_SIZES.h3-3, fontFamily:FONTS.primary,}}>You Have No Courses</Text>
                    {/* <TouchableOpacity style={styles.createCourseButton} onPress={() => navigation.navigate("AddCourseScreenStack")}>
                        <Text style={[styles.createCourseButtonText]}>Create Course</Text>
                    </TouchableOpacity> */}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 10,
        marginBottom: 30,
    },
    header: {
        fontSize: FONT_SIZES.h2,
        fontWeight: "bold",
        color:COLORS.primary,
        // textAlign: "center",
        marginLeft:10,
        // marginVertical: 10,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: COLORS.background,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginBottom: 15,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.text
    },
    description: {
        fontSize: 14,
        color: COLORS.text,
        marginVertical: 5,
    },
    price: {
        fontSize: FONT_SIZES.body,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    createCourseButton:{
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        alignSelf: "center",
        marginTop: 8,
    },
    editContainor:{
        flexDirection:'row',
        width:"100%",
        justifyContent: 'space-between',
        alignItems:'center'
    },
    createCourseButtonText:{
        color: COLORS.secondary,
        fontSize: FONT_SIZES.text,
        fontWeight: "500",
    },


});

export default AllCourses;
