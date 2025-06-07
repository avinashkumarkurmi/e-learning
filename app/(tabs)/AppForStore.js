import { createBottomTabNavigator, TransitionPresets  } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, useSelector } from 'react-redux';
import { TouchableOpacity, View, Text, Animated, ActivityIndicator,Platform } from "react-native";
import { COLORS } from "../../constants";
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../../redux/slices/userSlice';
import { setUser as setInstructorUser } from '../../redux/slices/instructorSlice';
// Main screens
import Featured from '../../screens/main/Featured';
import Search from '../../screens/main/Search';
import MyLearning from '../../screens/main/MyLearning';
import WishList from '../../screens/main/WishList';
import Account from '../../screens/main/Account';
import SearchCourses from "../../screens/SearchCourses";
import CourseDetails from "../../screens/CourseDetails";
import InstructorProfile from "../../screens/InstructorProfile";
import FullScreenVideo from "../../screens/FullScreenVideo";
import CompletedCourses from "../../screens/CompletedCourses";
import ChangeProfile from "../../screens/ChangeProfile";
import Cart from "../../screens/Cart";
import PaymentScreen from "../../screens/PaymentScreen";

// Auth screens
import SignupScreen from '../../screens/SignupScreen';
import LoginScreen from '../../screens/LoginScreen';
import InstructorLoginScreen from "../../screens/InstructorLoginScreen";

// Instructor screens
import AddCourse from "../../instructorScreens/main/AddCourse";
import AllCourses from "../../instructorScreens/main/AllCourses";
import EditCourse from "../../instructorScreens/main/EditCourse";
import Profile from "../../instructorScreens/main/Profile";
import ViewCourse from "../../screens/ViewCourse"
// import ChangeProfile from '../../screens/ChangeProfile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const FeaturedStack = () => (
  <Stack.Navigator
   >
    <Stack.Screen 
      name="FeaturedMain" 
      component={Featured} 
      options={{ title: 'Featured', headerShown: false }}  
    />
    <Stack.Screen 
      name="SearchCourses" 
      component={SearchCourses} 
      options={{ headerShown: false }} 
    />

<Stack.Screen 
      name="CourseDetails" 
      component={CourseDetails} 
      options={{ headerShown: false
 , title: "Course Details", }} 
    />
    <Stack.Screen 
      name="InstructorProfile" 
      component={InstructorProfile} 
      options={{ headerShown: false
, title: "Instructor Profile"}} 
    />
    <Stack.Screen 
      name="FullScreenVideo" 
      component={FullScreenVideo} 
      options={{ headerShown: false }}
    />
            <Stack.Screen 
      name="CompletedCourses" 
      component={CompletedCourses} 
      options={{ headerShown: false
, title:'Completed Courses'}} 
    />
    <Stack.Screen 
      name="ChangeProfile" 
      component={ChangeProfile} 
      options={{ headerShown: false
, title:"Change Profile"}} 
    />
    <Stack.Screen 
      name="Cart" 
      component={Cart} 
      options={{ headerShown: false
, }} 
    />
   <Stack.Screen 
  name="PaymentScreen" 
  component={PaymentScreen} 
  options={{ 
    headerShown: false
,
    headerLeft: () => null // Hides the back button
    ,title:"Payment Screen"
  }} 
/>

  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SearchMain" 
      component={Search} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="SearchCourses" 
      component={SearchCourses} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="CourseDetails" 
      component={CourseDetails} 
      options={{ headerShown: false
 , title: "Course Details"}} 
    />
    <Stack.Screen 
      name="InstructorProfile" 
      component={InstructorProfile} 
      options={{ headerShown: false
, title: "Instructor Profile"}} 
    />
    <Stack.Screen 
      name="FullScreenVideo" 
      component={FullScreenVideo} 
      options={{ headerShown: false }}
    />
         <Stack.Screen 
      name="CompletedCourses" 
      component={CompletedCourses} 
      options={{ headerShown: false
, title:'Completed Courses'}} 
    />
    <Stack.Screen 
      name="ChangeProfile" 
      component={ChangeProfile} 
      options={{ headerShown: false
, title:"Change Profile"}} 
    />
    <Stack.Screen 
      name="Cart" 
      component={Cart} 
      options={{ headerShown: false
 }} 
    />
    <Stack.Screen 
  name="PaymentScreen" 
  component={PaymentScreen} 
  options={{ 
    headerShown: false
,
    headerLeft: () => null,
    title:"Payment Screen"// Hides the back button
  }} 
/>

  </Stack.Navigator>
);

const MyLearningStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MyLearningMain" 
      component={MyLearning} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="SearchCourses" 
      component={SearchCourses} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="CourseDetails" 
      component={CourseDetails} 
      options={{ headerShown: false
 , title: "Course Details"}} 
    />
    <Stack.Screen 
      name="InstructorProfile" 
      component={InstructorProfile} 
      options={{ headerShown: false
, title: "Instructor Profile"}} 
    />
    <Stack.Screen 
      name="FullScreenVideo" 
      component={FullScreenVideo} 
      options={{ headerShown: false }}
    />
     <Stack.Screen 
      name="CompletedCourses" 
      component={CompletedCourses} 
      options={{ headerShown: false
, title:'Completed Courses'}} 
    />
    <Stack.Screen 
      name="ChangeProfile" 
      component={ChangeProfile} 
      options={{ headerShown: false
, title:"Change Profile"}} 
    />
    <Stack.Screen 
      name="Cart" 
      component={Cart} 
      options={{ headerShown: false
 }} 
    />
    <Stack.Screen 
  name="PaymentScreen" 
  component={PaymentScreen} 
  options={{ 
    headerShown: false
,
    headerLeft: () => null,
    title:'Payment Screen' // Hides the back button
  }} 
/>

    
  </Stack.Navigator>
);

const WishListStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="WishListMain" 
      component={WishList} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="SearchCourses" 
      component={SearchCourses} 
      options={{ headerShown: false }} 
    />

<Stack.Screen 
      name="CourseDetails" 
      component={CourseDetails} 
      options={{ headerShown: false
 , title: "Course Details"}} 
    />
    <Stack.Screen 
      name="InstructorProfile" 
      component={InstructorProfile} 
      options={{ headerShown: false
, title: "Instructor Profile"}} 
    />
    <Stack.Screen 
      name="FullScreenVideo" 
      component={FullScreenVideo} 
      options={{ headerShown: false }}
    />
     <Stack.Screen 
      name="CompletedCourses" 
      component={CompletedCourses} 
      options={{ headerShown: false
, title:'Completed Courses'}} 
    />
    <Stack.Screen 
      name="ChangeProfile" 
      component={ChangeProfile} 
      options={{ headerShown: false
, title:"Change Profile"}} 
    />
    <Stack.Screen 
      name="Cart" 
      component={Cart} 
      options={{ headerShown: false
 }} 
    />
    <Stack.Screen 
  name="PaymentScreen" 
  component={PaymentScreen} 
  options={{ 
    headerShown: false
,
    headerLeft: () => null,
    title:"Payment Screen" // Hides the back button
  }} 
/>

  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="AccountMain" 
      component={Account} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="WishListMain" 
      component={WishList} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="SearchCourses" 
      component={SearchCourses} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="CourseDetails" 
      component={CourseDetails} 
      options={{ headerShown: false
 , title: "Course Details"}} 
    />
    <Stack.Screen 
      name="InstructorProfile" 
      component={InstructorProfile} 
      options={{ headerShown: false
, title: "Instructor Profile"}} 
    />
    <Stack.Screen 
      name="FullScreenVideo" 
      component={FullScreenVideo} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="CompletedCourses" 
      component={CompletedCourses} 
      options={{ headerShown: false
, title:'Completed Courses'}} 
    />
    <Stack.Screen 
      name="ChangeProfile" 
      component={ChangeProfile} 
      options={{ headerShown: false
, title:"Change Profile"}} 
    />
    <Stack.Screen 
      name="Cart" 
      component={Cart} 
      options={{ headerShown: false
, title:"Cart" }} 
    />
      <Stack.Screen 
  name="PaymentScreen" 
  component={PaymentScreen} 
  options={{ 
    headerShown: false
,
    title:"Payment Screen",
    headerLeft: () => null // Hides the back button
  }} 
/>

  </Stack.Navigator>
);

// Main app tab navigator
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 70,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          elevation: 10,
          paddingBottom: 10,

          
        },
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          if (route.name === 'Featured') iconName = 'sparkles-outline';
          else if (route.name === 'Search') iconName = 'search-outline';
          else if (route.name === 'MyLearning') iconName = 'reader-outline';
          else if (route.name === 'WishList') iconName = 'heart-circle-outline';
          else if (route.name === 'Account') iconName = 'person-circle-outline';

          return (
            <View style={{
              marginTop: 24,
              backgroundColor: focused ? COLORS.primary : 'transparent',
              padding: 10,
              height: 50,
              width: 50,

              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons name={iconName} size={28} color={focused ? "white" : COLORS.text} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Featured" component={FeaturedStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="MyLearning" component={MyLearningStack} />
      <Tab.Screen name="WishList" component={WishListStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
};


const AllCoursesStack = () => {
  return (
    <Stack.Navigator>
    <Stack.Screen 
      name="AllCoursesScreen" 
      component={AllCourses} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="AddCourseScreen" 
      component={AddCourse} 
      options={{ headerShown: false }} 
    />
  
    <Stack.Screen 
      name="EditCourses" 
      component={EditCourse} 
      options={{ headerShown: false
, title: "Edit Courses"}} 
    />
    <Stack.Screen 
      name="ProfileScreen" 
      component={Profile} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="ViewCourseScreen" 
      component={ViewCourse} 
      options={{ headerShown: false
 , title:"View Course"}} 
    />
    </Stack.Navigator>
  )
}


const AddCourseStack = () => {
  return (
    <Stack.Navigator>
    <Stack.Screen 
      name="AddCourseScreen" 
      component={AddCourse} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="AllCoursesScreen" 
      component={AllCourses} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="ProfileScreen" 
      component={Profile} 
      options={{ headerShown: false }} 
    />
    </Stack.Navigator>
  )
}


const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
      name="ProfileScreen" 
      component={Profile} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="AddCourseScreen" 
      component={AddCourse} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="AllCoursesScreen" 
      component={AllCourses} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="ChnageProfileScreen" 
      component={ChangeProfile} 
      options={{ headerShown: false
 ,
        title: 'Change Profile'
      }} 
    />
    </Stack.Navigator>
  )
}

// Instructor tab navigator
const InstructorBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          height: 60,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          backgroundColor: "white",
          elevation: 10,
          paddingBottom: 10,
          // marginTop: 20,
          
        },
        
        tabBarIcon: ({ focused }) => {
          let iconName = "";

          if (route.name === "AllCoursesScreen") iconName = "book-outline";
          else if (route.name === "AddCourseScreen") iconName = "add-circle-outline";
          else if (route.name === "ProfileScreen") iconName = "person-outline";

          return (
            <View
              style={{
                marginTop: 24,
                backgroundColor: focused ? COLORS.primary : "transparent",
                padding: 7,
                height: 50,
                width: 50,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name={iconName} size={28} color={focused ? "white" : COLORS.text} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="AllCoursesScreen" component={AllCoursesStack} />
      <Tab.Screen name="AddCourseScreen" component={AddCourseStack} />
      <Tab.Screen name="ProfileScreen" component={ProfileStack} />
    </Tab.Navigator>
  );
};


// Main app component
const AppForStore = () => {
  const isLogin = useSelector((state) => state.reducer.user.isLogin);
  const isInstructorLogin = useSelector((state) => state.reducer.instructor.isLogin);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Initially true to prevent flickering

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        const storedInstructorData = await AsyncStorage.getItem('instructorData');

        if (storedUserData) {
          dispatch(setUser(JSON.parse(storedUserData)));
        }
        if (storedInstructorData) {
          dispatch(setInstructorUser(JSON.parse(storedInstructorData)));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false); // Ensure loading stops even if there's an error
      }
    };

    loadUserData();
  }, [dispatch]);

  // **Show a fullscreen loader until authentication status is determined**
  if (loading || isLogin === null || isInstructorLogin === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: COLORS.background } }}
        
      >
        {isLogin ? (
          <Stack.Screen name="Home" component={BottomTabNavigator}  options={{title:"Home"}}/>
        ) : isInstructorLogin ? (
          <Stack.Screen name="InstructorHome" component={InstructorBottomTabNavigator} options={{title:"Instructor Home"}}/>
        ) : (
          <>
            <Stack.Screen name="Signup" component={SignupScreen} options={{title:"Signup"}}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{title:"Login"}}/>
            <Stack.Screen name="InstructorLoginScreen" component={InstructorLoginScreen} options={{title:"Instructor Login"}}/>
          </>
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
};


export default AppForStore;