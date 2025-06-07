import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Eye, EyeOff } from "lucide-react-native";
import { useDispatch } from "react-redux";
import { upadateProfile } from "../redux/slices/userSlice";
import { updateInstructorProfile,updateInstructorProfilePicatureUrl } from "../redux/slices/instructorSlice";
import { COLORS, FONT_SIZES } from '../constants';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { 
    fetchStudentInfo,
    fetchInstructorInfo,
  updateStudentProfile,

  uploadProfilePicture,
  updatePassword
} from '../uitil/user';
// import util, { log } from "util";


const ChangeProfile = () => {
  const userState = useSelector((state) => state.reducer.user);
  const instructorState = useSelector((state) => state.reducer.instructor);
  const isInstructor = instructorState.isLogin;
  const dispatch = useDispatch();



  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    qualification: '',
    aboutMe: '',
    profilePicture: null,
    previousProfilePicture: null
  });

  const [UploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfNew, setShowPasswordConfNew] = useState(false);
  
  

  useEffect(() => {

    // Initialize form data based on user type
    if (isInstructor){
      
      const instructor = instructorState.instructorInfo;

        const fetchInstructorInfoAsync = async (instructorId) => {
            const instructorInfo = await fetchInstructorInfo(instructorId);
            setProfileData({
                ...profileData,
                firstName: instructor.firstName,
                lastName: instructor.lastName,
                qualification: instructor.qualification || '',
                aboutMe: instructor.aboutMe || '',
                profilePicture: instructorInfo.profilepictureurl,
                previousProfilePicture: instructorInfo.profilepictureurl
              });
          }

          fetchInstructorInfoAsync(instructor.user.instructor.info.instructorid);
    } else {
      
        const student = userState.userInfo.user;
        const fetchStudentInfoAsync = async (studentId) => {
            try {
                const studentInfo = await fetchStudentInfo(studentId);
                setProfileData({
                    ...profileData,
                    firstName: student.name.firstname,
                    lastName: student.name.lastname,
                    profilePicture: studentInfo.profilepictureurl,
                    previousProfilePicture: studentInfo.profilepictureurl
                });
            } catch (error) {
                console.log(error);
            }
        }

        fetchStudentInfoAsync(student.name.studentId);
    }
  }, [instructorState]);

  const handleImagePick = async () => {
    // Open image picker and handle profile picture selection
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileData({...profileData, profilePicture: result.assets[0].uri});
        // Call API to upload profile picture
        setUploadingProfilePic(true)
        const response = await uploadProfilePicture(isInstructor ? "instructor" : "student",isInstructor ? instructorState.instructorInfo.user.instructor.info.instructorid : userState.userInfo.user.name.studentId,result.assets[0].uri);
        if (response.message) {
            const newProfileUrl = response.profilePictureUrl;
            setUploadingProfilePic(false)
            console.log(newProfileUrl,"newProfileUrl");
            if(isInstructor){
              dispatch(updateInstructorProfilePicatureUrl({profilepictureurl: newProfileUrl}));
            }
        }
        else {
          setUploadingProfilePic(false)
            Alert.alert("Network Problem", "Failed to update Profile")
        }
        
      }
    } catch (error) {
    setUploadingProfilePic(false)
      setProfileData({...profileData, profilePicture: profileData.previousProfilePicture});
      console.log(error,"error"); 
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (isInstructor) {
        // Update instructor profile
        // await updateInstructorProfile({
        //   firstName: profileData.firstName,
        //   lastName: profileData.lastName,
        //   qualification: profileData.qualification,
        //   aboutMe: profileData.aboutMe
        // });

        // console.log(instructorState.instructorInfo.user.instructor.info.instructorid,"instructorId",profileData);
        // console.log(!profileData.firstName,"first name",!profileData.lastName,"last name",!profileData.qualification,"qualification",!profileData.aboutMe,"about me");
        
        
        if (!profileData.firstName && !profileData.lastName && !profileData.qualification && !profileData.aboutMe) {
          Alert.alert("Fields Required","Please fill aleast one field to update profile");
          return;
        }
        if (
          ["firstName", "lastName", "qualification", "aboutMe"].some(
            key => typeof profileData[key] === "string" && profileData[key].length > 255
          )
        ) {
          Alert.alert("Long profile data", "Maximum input size is 255 letters");
          return;
        }
        

        

        dispatch(updateInstructorProfile({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          qualification: profileData.qualification,
          aboutMe: profileData.aboutMe,
          instructorId: instructorState.instructorInfo.user.instructor.info.instructorid
        }));

      } else {
        
        // Update student profile
        // await updateStudentProfile({
        //   firstName: profileData.firstName,
        //   lastName: profileData.lastName,
        //   studentId: userState.userInfo.user.name.studentId
        // });
        if (!profileData.firstName && !profileData.lastName) {
          Alert.alert("Fields Required","Please fill aleast one field to update profile");
          return;
        }

        if (
          ["firstName", "lastName"].some(
            key => typeof profileData[key] === "string" && profileData[key].length > 255
          )
        ) {
          Alert.alert("Long profile data", "Maximum input size is 255 letters");
          return;
        }

        dispatch(upadateProfile({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            studentId: userState.userInfo.user.name.studentId
          }));
      }
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.log(error);
      
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    // Validate passwords
    if (profileData.newPassword !== profileData.confirmPassword) {
      Alert.alert('No Match', 'Passwords do not match');
      return;
    }

    if(profileData.currentPassword == profileData.confirmPassword){
      Alert.alert('Same', "Your current password can't be same as new password");
      return;
    }

    try {
      // Call API to update password
      const res = await updatePassword(profileData.currentPassword, 
        profileData.newPassword, isInstructor?"instructor":"student", 
        isInstructor ? instructorState.instructorInfo.user.instructor.info.instructorid : userState.userInfo.user.name.studentId);


 
        
        if(res.updated){

          
          Alert.alert('Success', 'Password updated successfully');
          setProfileData({
            ...profileData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }else{
          Alert.alert('Fail', `${res.message}`);
        }

      
      // Clear password fields
      
    } catch (error) {
      console.log(error);
      
      Alert.alert('Error', 'Failed to update password');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
      <View style={styles.profileImageContainer}>
        <View style={styles.imageContainer}>
    {UploadingProfilePic ? (
        <View style={[styles.profileImage, {justifyContent:"center", alignItems:"center", backgroundColor: COLORS.shadow}]} >

            <ActivityIndicator size="large" color="black" />
        </View>
    ) : (
        <Image 
        source={{ uri: profileData.profilePicture || profileData.previousProfilePicture }} 
        style={styles.profileImage} 
        />
    )}
    </View>


        <TouchableOpacity 
          style={styles.changePhotoButton}
          onPress={handleImagePick}
        >
          <Text style={styles.buttonText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Update Personal Information</Text>
        <TextInput
          style={styles.input}
          placeholder="New First Name"
          value={profileData.firstName}
          onChangeText={(text) => setProfileData({...profileData, firstName: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="New Last Name"
          value={profileData.lastName}
          onChangeText={(text) => setProfileData({...profileData, lastName: text})}
        />

        {isInstructor && (
          <>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Qualification"
              value={profileData.qualification}
              multiline
              numberOfLines={4}
              onChangeText={(text) => setProfileData({...profileData, qualification: text})}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="About Me"
              value={profileData.aboutMe}
              onChangeText={(text) => setProfileData({...profileData, aboutMe: text})}
              multiline
              numberOfLines={4}
            />
          </>
        )}

        <TouchableOpacity 
          style={styles.updateButton}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <View style={styles.input}>
  <TextInput
    style={[ { flex: 1 }]}
    placeholder="Current Password"
    secureTextEntry={!showPasswordCurrent}
    value={profileData.currentPassword}
    onChangeText={(text) => setProfileData({ ...profileData, currentPassword: text })}
  />
  <TouchableOpacity onPress={() => setShowPasswordCurrent(!showPasswordCurrent)} style={{paddingVertical: 12}}>
  <Ionicons name={showPasswordCurrent ? "eye" : "eye-off"} size={24} color="gray" />
  </TouchableOpacity>
    </View>



    <View style={styles.input}>
  <TextInput
    style={[ { flex: 1 }]}
    placeholder="New Password"
    secureTextEntry={!showPasswordNew}
    value={profileData.newPassword}
    onChangeText={(text) => setProfileData({ ...profileData, newPassword: text })}
  />
  <TouchableOpacity onPress={() => setShowPasswordNew(!showPasswordNew)} style={{paddingVertical: 12}}>
  <Ionicons name={showPasswordNew ? "eye" : "eye-off"} size={24} color="gray" />
  </TouchableOpacity>
    </View>

    <View style={styles.input}>
  <TextInput
    style={[ { flex: 1 }]}
    placeholder="Confirm New Password"
    secureTextEntry={!showPasswordConfNew}
    value={profileData.confirmPassword}
    onChangeText={(text) => setProfileData({ ...profileData, confirmPassword: text })}
  />
  <TouchableOpacity onPress={() => setShowPasswordConfNew(!showPasswordConfNew)} style={{paddingVertical: 12}}>
  <Ionicons name={showPasswordConfNew ? "eye" : "eye-off"} size={24} color="gray" />
  </TouchableOpacity>
    </View>

        
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={handlePasswordChange}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  formSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.h3,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.text,
  },
  input: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  changePhotoButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 20,
    width: 150,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
  },
});

export default ChangeProfile;
