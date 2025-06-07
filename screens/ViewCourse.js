import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet,Modal, Linking } from 'react-native';
import { Video } from 'expo-av';
import { useRoute } from '@react-navigation/native';
import { COLORS, FONTS, FONT_SIZES } from '../constants';
import Feather from 'react-native-vector-icons/Feather';
import { fetchStudentEnrollment } from "../uitil/user";
import { useDispatch, useSelector } from 'react-redux';
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';

const ViewCourse = () => {
  const route = useRoute();
  const { course } = route.params;
  const [enrollment, setEnrollment] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const videoRef = useRef(null);
  const instructorState = useSelector((state) => state.reducer.instructor);

  const fetchStudentEnrollmentAsyn = async (id) => {
    const res = await fetchStudentEnrollment(id, "instructor");
    setEnrollment(res);

    console.log(res.length,",,,,,",course.price);
    
  };

  

  useEffect(() => {
    fetchStudentEnrollmentAsyn(course.courseId);
    
  }, [instructorState]);


  const openResource = async (file) => {
    console.log("Opening fileeee:", file);
  
    try {
      if (file.startsWith("http")) {
        // Open remote URL in a browser
        await Linking.openURL(file);
        return;
      }
      
      // await WebBrowser.openBrowserAsync(file.uri);
      if (Platform.OS === "android") {
        try {
          // Convert file:// to content://
          const contentUri = await FileSystem.getContentUriAsync(file);
    
          await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: contentUri, // Use content URI
            flags: 1,
            type: file.mimeType || "image/*",
          });
        } catch (error) {
          console.error("Error opening file:", error);
        }
      } else {
        await Sharing.shareAsync(file);
      }
    } catch (error) {
      console.error("Error opening document:", error);
      Alert.alert("Error", "Could not open the document.");
    }
  };


  return (
    <>
  
    <FlatList
    showsVerticalScrollIndicator={false}
    style={{backgroundColor:COLORS.background,flex:1}}
      ListHeaderComponent={
        <>
          {/* Top Section - Thumbnail + Details */}
          <View style={styles.topContainer}>
            <Image source={{ uri: course.courseThumbnail }} style={styles.thumbnail} />
            <View style={styles.detailsContainer}>
              <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
              <Text style={styles.description} numberOfLines={3}>{course.description}</Text>
              <View style={{flexDirection:"row", alignItems:'center'}}><Text style={[styles.description,{paddingTop:3}]}>Total Earning : </Text><Text style={styles.price}>₹{(enrollment.length * course.price)}</Text></View>
              <Text style={styles.price}>₹{course.price}</Text>
            </View>
          </View>
          
          {/* Introduction Video Section */}
          {course.introductionVideoUrl ? (
              <><Text style={styles.videoHeading}>Introduction Video</Text>
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: course.introductionVideoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
              />
            </View></>
          ) : null}

          {/* Enrolled Students Section */}
            <Text style={styles.sectionHeading}>Enrolled Students</Text>
          <View style={styles.enrollmentContainer}>
            {enrollment.length > 0 ? (
              enrollment.map((student) => (
                <View key={student.enrollmentid} style={styles.studentCard}>
                  <Image source={{ uri: student.profilepictureurl }} style={styles.studentImage} />
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.first} {student.last}</Text>
                    <Text style={styles.studentEmail}>{student.email}</Text>
                    <Text style={styles.completion}>Completion: {student.completionpercentage}%</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noStudentsText}>No students enrolled yet.</Text>
            )}
          </View>
            <Text style={styles.sectionHeading}>Sections</Text>
        </>
      }
      data={course.sections}
      keyExtractor={(item) => item.sectionId.toString()}
      renderItem={({ item }) => (
        <View style={[styles.sectionContainer]}>
          <Text style={styles.sectionTitle}>{item.sectionTitle}</Text>

          {item.videos.map((video) => (
            <View key={video.videoId} >
              <TouchableOpacity style={styles.videoItem} onPress={() => {setOpenVideoModal(true); setVideoFile(video.videoUrl)}}>
              <Feather name="play-circle" size={20} color={COLORS.primary} />
              <Text style={styles.videoTitle}>{video.videoUrl.slice(video.videoUrl.lastIndexOf("/") + 1)}</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Resources */}
          {item.videos.map((video) =>
            video.resourceUri.map((resource, index) => (
              <TouchableOpacity key={index} style={styles.resourceButton} onPress={() => openResource(resource)}>
                <Feather name="file-text" size={18} color={COLORS.primary} />
                <Text style={styles.resourceText}>{resource.slice(resource.lastIndexOf("/") + 1)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16,  }}
    />
    
    <Modal visible={openVideoModal} animationType="fade" transparent={false}>
        <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}>
          <Video
            ref={videoRef}
            source={{ uri: videoFile}}
            useNativeControls
            resizeMode="contain"
            style={{ flex: 1 }}
            shouldPlay
          />
          <TouchableOpacity
            onPress={() => setOpenVideoModal(false)}
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: 14,
              borderRadius: 30,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 22 }}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal></>
  );
};

// Styles
const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 90,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.h3-3,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 3,
  },
  description: {
    fontSize: FONT_SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginBottom: 3,
  },
  price: {
    fontSize: FONT_SIZES.h3-2,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontWeight:"bold"
  },
  videoContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoHeading: {
    fontSize: FONT_SIZES.h3 - 5,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.text,
    // marginBottom: 8,
  },
  video: {
    width: '100%',
    height: 220,
    borderRadius: 10,
  },
  enrollmentContainer: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  sectionHeading: {
    fontSize: FONT_SIZES.h3 - 5,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.text,
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
  studentInfo: {
    flex: 1,
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
  sectionContainer: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontWeight: "bold",
    marginBottom: 8,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 10,
  },
  videoTitle: {
    fontSize: FONT_SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 8,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  resourceText: {
    fontSize: FONT_SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    marginLeft: 5,
  },
});

export default ViewCourse;
