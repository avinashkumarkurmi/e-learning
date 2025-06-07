import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, FONT_SIZES } from "../../constants";
import { fetchInstructorNumberOfStudentsEnrolled,fetchListOfEnrollmentCount } from "../../uitil/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutInstructor } from "../../redux/slices/instructorSlice";


const Profile = ({ navigation }) => {
  const instructorState = useSelector((state) => state.reducer.instructor);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [instructorData, setInstructorData] = useState({})
  const [instructorProfile, setInstructorProfile] = useState("");
  const [completedCourses, setCompletedCourses] = useState(null);
  const [totalNumberOfStudentsEnrolled, setTotalNumberOfStudentsEnrolled] = useState(0);
  const [enrollment, setEnrollment] = useState([]);

  const fetchInstructorNumberOfStudentsEnrolledAsync = async (courseIds) => {
    const numberOfStudentsEnrolled = await fetchInstructorNumberOfStudentsEnrolled(courseIds);
    let totalNumberOfStudentsEnrolled = 0;
    numberOfStudentsEnrolled.enrollmentCount.forEach(course => {
      totalNumberOfStudentsEnrolled += parseInt(course.numberofstudentsenrolled);
    })
    setTotalNumberOfStudentsEnrolled(totalNumberOfStudentsEnrolled);
  }

  const fetchStudentEnrollmentAsyn = async (courseIds) => {
    const enrollmentData = await fetchListOfEnrollmentCount(courseIds);
    const filteredData = Object.values(
      enrollmentData.enrollmentCount.reduce((acc, curr) => {
          acc[curr.email] = curr; // Keep only one occurrence per email
          return acc;
      }, {})
  );
      setEnrollment(filteredData);
      setLoading(false);
  };

  useEffect(() => {
    setInstructorData(instructorState.instructorInfo.user);
      const courseIds = instructorState.instructorInfo.user.courses.map(course => course.course.courseId);
      setCompletedCourses(courseIds.length)
      fetchInstructorNumberOfStudentsEnrolledAsync(courseIds)
      setLoading(true);
      fetchStudentEnrollmentAsyn(courseIds);
      setInstructorProfile(instructorState.instructorInfo.user.instructor.info);
  }, [instructorState])

    const handleChangeProfilePicture = () => {
      navigation.navigate("ChnageProfileScreen");
    };

    const handleLogout = async () => {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {text: "Cancel", style: "cancel"},
        {text: "Logout", onPress: async() => {
          await AsyncStorage.removeItem('instructorData');
          dispatch(logoutInstructor());
          // console.log(instructorState,"instructorState");
        }}
      ])
    };

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }} >
        <Text style={{color:COLORS.primary, fontSize: FONT_SIZES.h2, fontWeight:"bold", marginLeft:17}}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.header}>
            <Image
              source={{ uri: instructorProfile.profilepictureurl}}
              style={styles.profileImage}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.nameText}>
                {instructorData.instructor?.name?.first} {instructorData.instructor?.name?.last}
              </Text>
              <Text style={[styles.emailText,{fontSize: FONT_SIZES.h3-5,fontWeight: "bold"}]}>{instructorProfile.qualification}</Text>
              <Text style={styles.emailText}>{instructorProfile.aboutme}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.profileButton]}
            onPress={handleChangeProfilePicture}
          >
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.profileButton,{backgroundColor:COLORS.secondary}]}
            onPress={handleLogout}
          >
            <Text style={[styles.buttonText,{color:COLORS.primary}]}>Logout</Text>
          </TouchableOpacity>
        </View>
        </View>
        <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Overall Instructor Progress</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
            <TouchableOpacity 
              style={[styles.statBox, {
                backgroundColor: COLORS.primary,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }]}
              activeOpacity={0.7}
            >
                <Text style={[styles.statNumber, {color: '#fff', fontSize: 24}]}>
                  {completedCourses}
                </Text>
                <Text style={[styles.statLabel, {color: '#fff', marginTop: 8}]}>Public Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statBox, {
                backgroundColor: COLORS.primary,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.statNumber, {color: '#fff', fontSize: 24}]}>
                {totalNumberOfStudentsEnrolled}
              </Text>
              <Text style={[styles.statLabel, {color: '#fff', marginTop: 8}]}>Total Students Enrolled</Text>
            </TouchableOpacity>
             <TouchableOpacity 
              style={[styles.statBox, {
                backgroundColor: COLORS.primary,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }]}
              activeOpacity={0.7}
            >
               <Text style={[styles.statNumber, {color: '#fff', fontSize: 24}]}>
                {completedCourses=="null" || completedCourses === 0?0:(totalNumberOfStudentsEnrolled/completedCourses).toFixed(2)}
             </Text>
              <Text style={[styles.statLabel, {color: '#fff', marginTop: 8}]}>Average Enrollment</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Top Students</Text>
        <View style={[styles.profileCard,{margin:0, paddingHorizontal:5,paddingVertical:5}]}>
        {loading ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color={COLORS.primary} /></View> : <View></View>}
        {enrollment.length > 0 ? (
          enrollment.map((student,index) => (
                <View key={index} style={styles.studentCard}>
                  <Image source={{ uri: student.profilepictureurl }} style={styles.studentImage} />
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.first} {student.last}</Text>
                    <Text style={styles.studentEmail}>{student.email}</Text>
                  </View>
                </View>
          ))
        ) : <View style={[styles.studentCard,{flex:1, justifyContent:'center', alignItems:'center',height:200}]}><Text style={{color:COLORS.text,fontSize:FONT_SIZES.h3-3, fontFamily:FONTS.primary,}}>No students enrolled</Text></View>}</View></View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {

    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  nameText: {
    fontSize: FONT_SIZES.h2,
    fontFamily: FONTS.primary,
    fontWeight: "bold",
    color: COLORS.text,
  },
  emailText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    opacity: 0.7,
  },
  overallProgress: {
    alignItems: 'center',
  },
  // progressCircle: {
  //   width: 120,
  //   height: 120,
  //   borderRadius: 60,
  //   backgroundColor: COLORS.primary,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 10,
  // },
  progressPercentage: {
    color: '#fff',
    fontSize: FONT_SIZES.h1,
    fontWeight: 'bold',
  },
  progressLabel: {
    color: '#fff',
    fontSize: FONT_SIZES.body,
  },
  statsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 25,
    gap: 15,
  },
  statBox: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1, 
    backgroundColor: COLORS.primary,
  },
  statNumber: {
    fontSize: FONT_SIZES.h2,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: FONT_SIZES.caption,
    marginTop: 5,
    textAlign: 'center',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  studentName: {
    fontSize: FONT_SIZES.medium,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  studentEmail: {
    fontSize: FONT_SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  completion: {
    fontSize: FONT_SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
  },
  noStudentsText: {
    fontSize: FONT_SIZES.small,
    fontWeight: 'bold',
    fontFamily: FONTS.regular,
    color: COLORS.text,
    textAlign: 'center',
    padding: 10,
  },
  recentActivity: {
    marginHorizontal: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    // marginBottom: 15,
  },
  activityCard: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: '500',
    color: COLORS.text,
  },
  activityDate: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.text,
    opacity: 0.7,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.text,
    width:40,
  },
  actionButtons: {
    gap: 10,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  profileButton: {
    backgroundColor: COLORS.primary,
  },
  passwordButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
  }
});

export default Profile;
