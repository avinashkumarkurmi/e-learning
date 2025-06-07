import { StyleSheet, Text, View, Button, Image,TouchableOpacity, ScrollView, Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { COLORS, FONTS, FONT_SIZES } from "../../constants";
import { fetchStudentInfo, fetchMinCourseDetail } from "../../uitil/user";
import util from "util";
import { logout } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Account({ navigation }) {
  const userState = useSelector((state) => state.reducer.user);
  const dispatch = useDispatch();
  const [userAccountData, setUserAccountData] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  async function setUserAccountDataValue() {
    const { studentId } = userState.userInfo.user.name;
    const studentInfo = await fetchStudentInfo(studentId);

    console.log(userState.userInfo);
    

    const fullStudentInfo = Object.assign({}, userState.userInfo.name, studentInfo);
    // console.log(fullStudentInfo,"fullStudentInfo");
    
    setUserAccountData(fullStudentInfo);

    setUserInfo(userState.userInfo.user);
    try {
      const recentActivity = await fetchMinCourseDetail(userState.userInfo.user.enrollments?.slice(0, 3));

   setRecentActivity(recentActivity);
  } catch (error) {
    console.log(error,"error");
  }

}
    
  
  // Set the tab visible and fetch the data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "flex", height: 63, // Ensures enough space
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        elevation: 10,
        paddingBottom: 10,} });
      
      setUserAccountDataValue();

      return () => parent?.setOptions({ tabBarStyle: { display: "none" } });
    }, [navigation, userState])

    
  );

  const handleChangePassword = () => {
    // Navigate to Change Password screen
    navigation.navigate("ChangePassword");
  };

  const handleChangeProfilePicture = () => {
    // Logic to change profile picture (e.g., open gallery or camera)
    // Navigate to profile picture change screen or implement image picker logic

    // navigation.navigate("ChangeProfile", {
    //   completedCourses: 
    // })
    navigation.navigate("ChangeProfile");
  };

  const handleLogout = async () => {



    Alert.alert("Logout", "Are you sure you want to logout?", [
      {text: "Cancel", style: "cancel"},
      {text: "Logout", onPress: async() => {
        await AsyncStorage.removeItem('userData');
        dispatch(logout());
      }}
    ])

    // await AsyncStorage.removeItem('userData');
    // dispatch(logout());
  };


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <View style={styles.header}>
          <Image
            source={{ uri: userAccountData.profilepictureurl }}
            style={styles.profileImage}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.nameText}>
              {userInfo?.name?.first} {userInfo?.name?.last}
            </Text>
            <Text style={styles.emailText}>{userAccountData.email}</Text>
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
          style={[styles.button, styles.profileButton,{backgroundColor: COLORS.secondary}]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText,{color: COLORS.text}]}>Logout</Text>
        </TouchableOpacity>
{/* 
        <TouchableOpacity 
          style={[styles.button, styles.passwordButton]}
          onPress={handleChangePassword}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity> */}
      </View>

        
      </View>

      <View style={styles.statsContainer}>
          {/* <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}> */}
          <Text style={styles.sectionTitle}>Overall Learning Progress</Text>
          {/* <Text style={styles.sectionSubtitle}>view Complete Courses</Text>
          </View> */}
          
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
            onPress={() => {
              navigation.navigate("CompletedCourses", {
                completedCourses: userInfo.enrollments?.filter(course => 
                  parseFloat(course.completionpercentage) === 100
                )
              });
            }}
            activeOpacity={0.7}
          >
              <Text style={[styles.statNumber, {color: '#fff', fontSize: 24}]}>
                {Math.round(userInfo.enrollments?.reduce((acc, curr) => 
                  acc + parseFloat(curr.completionpercentage), 0) / 
                  (userInfo.enrollments?.length || 1))}%
              </Text>
              <Text style={[styles.statLabel, {color: '#fff', marginTop: 8}]}>Complete</Text>
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
            onPress={() => {
              navigation.navigate("MyLearning");
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.statNumber, {color: '#fff', fontSize: 24}]}>
              {userInfo.enrollments?.length || 0}
            </Text>
            <Text style={[styles.statLabel, {color: '#fff', marginTop: 8}]}>Active</Text>
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
            onPress={() => {
              navigation.navigate('WishList');
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.statNumber, {color: '#fff', fontSize: 24}]}>
              {userInfo.wishlist?.length || 0}
            </Text>
            <Text style={[styles.statLabel, {color: '#fff', marginTop: 8}]}>Saved</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Course Activity</Text>
        {recentActivity?.slice(0, 3).map((course, index) => (
          <View key={index} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.courseTitle}>{course.title.length > 25 ? course.title.substring(0, 25) + '...' : course.title}</Text>
              <Text style={styles.activityDate}>
                {course.duration} hrs
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressTrack}>
                <View 
                  style={[styles.progressFill, 
                    {width: `${parseFloat(userInfo.enrollments[index].completionpercentage)}%`}
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, {width: userInfo.enrollments[index].completionpercentage === 100 ? 48 : undefined}]}>{userInfo.enrollments[index].completionpercentage}%</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

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