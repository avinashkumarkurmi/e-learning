import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, ScrollView, Image } from "react-native";
import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {fetchMinCourseDetail, fetchCourseProgress} from "../../uitil/user";
import { COLORS, FONT_SIZES, FONTS } from "../../constants";

export default function MyLearning({ navigation }) {
  const [myLearning, setMyLearning] = useState([]);
  const userState = useSelector((state) => state.reducer.user);


  

  function getFormattedCourses(data) {
    return data.map(item => ({
      courseid: item.courseid,
      title: ""  // Empty title
    }));
  }

  function mergeCourseData(enrolledCourses = [], allCourses = []) {
    if (!Array.isArray(enrolledCourses) || !Array.isArray(allCourses)) {
        return [];
    }
    
    const courseDataMap = {};
    enrolledCourses.forEach(course => {
        courseDataMap[course.courseid] = course;
    });


    
    return allCourses.map(course => {
        const matchedCourse = courseDataMap[course.courseid] || {};
        return {
            ...course,
            completionpercentage: matchedCourse.completionpercentage || null,
            enrollmentdate: matchedCourse.enrollmentdate || null
        };
    });
}

  
  const getSearchItems = async (coursesId) => {
      // setLoading(true);

      
      try {
        const courses = await fetchMinCourseDetail(coursesId); // Fetch course data by coursesId
        if (courses.length === 0) {
            setMyLearning([]);
          null;
        } else {
          const formattedCourses = courses.map(course => ({
            ...course,
            id: course.id || course.course_id || Math.random().toString(),
          }));
          const data = mergeCourseData(userState.userInfo.user.enrollments,formattedCourses)
          setMyLearning(data)
          // console.log(data);
          
        }


      } catch (error) {
        console.error('Error fetching courses:', error);
        setNoResults(true);
        
        setShowSeacrchResult(true);
      } finally {
        setLoading(false);
      }
    };



  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "flex",height: 63, // Ensures enough space
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        elevation: 10,
        paddingBottom: 10,} });
        
      const courses = getFormattedCourses(userState.userInfo.user.enrollments);
      // fetchCourseDetailAsync(courses[0].courseid, userState.userInfo.user.name.studentId);
      // console.log("courses",userState);
      

      getSearchItems(courses);
      return () => parent?.setOptions({ tabBarStyle: { display: "none" } });
    }, [navigation, userState.userInfo.user.enrollments])


    
  );

  


    return (
      <>
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 15, paddingTop: 10 }}>
          <View style={{
            marginBottom: 20,
            alignItems: "center", 
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <View>
              <Text style={{
                marginBottom: 5,
                color: COLORS.primary,
                fontSize: FONT_SIZES.h1,
                fontFamily: FONTS.primary,
                fontWeight: "bold",
              }}>
                My Learning
              </Text>
              <Text style={{
                color: COLORS.text,
                fontSize: FONT_SIZES.body,
                fontFamily: FONTS.secondary,
              }}>
                Continue your learning journey
              </Text>
            </View>
          </View>

          <FlatList
            data={myLearning}
            keyExtractor={(item) => item.courseid.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("CourseDetails", { courseId: item.courseid });
                }}
                style={{
                  flexDirection: "row",
                  marginBottom: 15,
                  backgroundColor: COLORS.secondary,
                  borderRadius: 10,
                  padding: 10,
                  overflow: "hidden",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.border
                }}
              >
                <Image
                  source={{ uri: item.coursethumbnail }}
                  style={{ width: 60, height: 60, borderRadius: 5 }}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ fontSize: FONT_SIZES.h3, fontWeight: "bold", color: COLORS.text }}>{item.title}</Text>
                  <Text style={{ fontSize: FONT_SIZES.body, color: COLORS.text, marginTop: 5 }}>
                    {item.description.length > 50
                      ? item.description.substring(0, 50) + "..."
                      : item.description}
                  </Text>
                  <Text style={{ fontSize: FONT_SIZES.caption, color: COLORS.text, marginTop: 5 }}>
                    {item.duration} hrs
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between'}}>
                    <Text style={{ fontSize: FONT_SIZES.caption, color: COLORS.primary, fontWeight: "500" }}>
                      Completion: {item.completionpercentage}%
                    </Text>
                    <Text style={{ fontSize: FONT_SIZES.caption, color: COLORS.text }}>
                      Enrolled: {new Date(item.enrollmentdate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                    <View 
                      style={{
                        height: 3,
                        flex: 1,
                        backgroundColor: COLORS.border,
                        borderRadius: 5
                      }}
                    >
                      <View 
                        style={{
                          width: `${item.completionpercentage}%`,
                          height: '100%',
                          backgroundColor: COLORS.primary,
                          borderRadius: 5
                        }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  courseId: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  completion: {
    fontSize: 16,
    color: "#555",
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
