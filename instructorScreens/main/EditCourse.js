import React, { useState, useEffect,useRef } from "react";
import { Linking, View, Text, StyleSheet ,Alert, ActivityIndicator,Modal,SectionList ,TouchableOpacity,TextInput, FlatList, SafeAreaView,ScrollView ,KeyboardAvoidingView, Platform, Button } from "react-native";
import AddContentModal from "../../components/userDefine/AddContentModal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { TextInput } from "react-native-paper";
import util from "util";
import { COLORS, FONTS, FONT_SIZES } from "../../constants";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import {uploadFilesToServer} from "../../uitil/viedoResource";
import {createDemoCouresForUpload } from '../../redux/slices/instructorSlice';
import * as DocumentPicker from "expo-document-picker";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { setNewData, uploadAllToServer,updateAllToServer, deleteSection } from "../../redux/slices/instructorSlice";
import { uploadFullCourse } from "../../uitil/viedoResource";
import Swal from "sweetalert2";
import Toast from "react-native-toast-message";
import AwesomeAlert from "react-native-awesome-alerts";
import { Video } from 'expo-av';



const EditCourse = ({navigation,route}) => {

  let  EditCourseData  = route.params;

  // console.log("EditCourseData :", util.inspect(EditCourseData, { depth: null, colors: true }));
    const [openVideoModal, setOpenVideoModal] = useState(false);
      const videoRef = useRef(null);
  // const state = useSelector((state) => state);
  const instructorState = useSelector((state) => state.reducer.instructor);
  const loading = instructorState.loading
  // const loading = false;
  
  const instructorId = instructorState.instructorInfo.user.instructor.info.instructorid;

  const previousSectionsRef = useRef(null);

  const [sections, setSections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const [allDetailOfThisCourse, setAllDetailOfThisCourse] = useState(null);
  
  const [title, setTitle] = useState("");
  const [des, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [video, setVideo] = useState({});
  const [thumbnail, setThumbnail] = useState({});

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  

  const dispatch = useDispatch();
  
  const removeCourseData = async () => {
    try {
      await AsyncStorage.removeItem("courseData");
      console.log("Course data removed!");
    } catch (error) {
      console.error("Error removing data:", error);
    }
  };

  const saveCourseData = async (data) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem("courseData", jsonValue);
      console.log("Course data saved!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const checkCourseData = async () => {
    try {
      const data = await AsyncStorage.getItem("courseData");
      if (data !== null) {
        const courseData = JSON.parse(data);
        if (courseData.length > 0 && courseData[0].course) {
          return courseData;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log("error whi efecthing: ",error);
      
      return "error"
    }
  };

  // const convertStateToFormattedData = (data) => {
    
    
  //   return [
  //     {
  //       course: {
  //         courseId: data.course.courseId,
  //         courseThumbnail: thumbnail.uri || null,
  //         description: des || null,
  //         duration: data.course.duration || null,
  //         introductionVideoUrl: video.uri || null,
  //         price: price || null,
  //         review: data.course.review || null,
  //         title: title || null,
  //         sections: sections.map((section,index) => ({
  //           sectionId: sec[index].sectionId,
  //           sectionPriority: sec[index].sectionPriority,
  //           sectionTitle: section.title,
  //           videos: section.videos.map((vid, vidIndex) => ({
  //             videoId: sec[index].videos[vidIndex].videoId,
  //             videoPriority: sec[index].videos[vidIndex].videoPriority,
  //             videoTitle: vid.title,
  //             videoUrl: vid.file.uri,
  //             thumbnailUrl: vid.resource[0].uri,
  //             // resourcesUrl: vid.resource?.[0]?.uri || "https://example.com/default-thumb.jpg",
  //             views: sec[index].videos[vidIndex].views,
  //           })),
  //         }))
  //       },
  //     },
  //   ];
  // };

  // const fillStateFromFormattedData = (data) => {
    
  //   if (!data || !data.course) return;
  
  //   setTitle(data.course.title || "");
  //   setDesc(data.course.description || "");
  //   setPrice(data.course.price || "");
  //   setThumbnail({ uri: data.course.courseThumbnail || "" });
  //   setVideo({ uri: data.course.introductionVideoUrl || "" });
    
  //   setSections(
  //     data.course.sections.map((section, sectionIndex) => ({
  //       expanded: sectionIndex === 0, // Expand only the first section by default
  //       id: `${Date.now()}-${sectionIndex}`,
  //       title: section.sectionTitle,
  //       videos: section.videos.map((vid, vidIndex) => ({
  //         file: { uri: vid.videoUrl },
  //         id: `${Date.now()}-${vidIndex}`,
  //         resource: [],
  //         title: vid.videoTitle,
  //       })),
  //     }))
  //   );
  // };

  const convertStateToFormattedData = (data) => {
    return [
        {
            course: {
                courseId: data.course.courseId,
                courseThumbnail: thumbnail.uri || null,
                description: des || null,
                duration: data.course.duration || null,
                introductionVideoUrl: video.uri || null,
                price: price || null,
                review: data.course.review || null,
                title: title || null,
                sections: sections.map((section, index) => ({
                    sectionId: sec[index].sectionId,
                    sectionPriority: sec[index].sectionPriority,
                    sectionTitle: section.title,
                    videos: section.videos.map((vid, vidIndex) => ({
                        videoId: sec[index].videos[vidIndex].videoId,
                        videoPriority: sec[index].videos[vidIndex].videoPriority,
                        videoTitle: vid.title,
                        videoUrl: vid.file.uri,
                        thumbnailUrl: vid.resource[0]?.uri || null, // Handle cases where no resource exists
                        views: sec[index].videos[vidIndex].views,
                        resourceUri: vid.resource.map(res => res.uri) || [], // Properly updating resourceUri with all resources
                    })),
                })),
            },
        },
    ];
};

  const fillStateFromFormattedData = (data) => {
    if (!data || !data.course) return;

    setTitle(data.course.title || "");
    setDesc(data.course.description || "");
    setPrice(data.course.price || "");
    setThumbnail({ uri: data.course.courseThumbnail || "" });
    setVideo({ uri: data.course.introductionVideoUrl || "" });

    console.log("datatattat :", util.inspect(data, { depth: null, colors: true }));;
    
    
    setSections(
      data.course.sections
      .filter(section => section.sectionId !== null) // Only include sections with a valid sectionId
      .map((section, sectionIndex) => ({
          expanded: sectionIndex === 0, // Expand only the first section by default
          id: section.sectionId,
          title: section.sectionTitle,
          videos: section.videos.map((vid, vidIndex) => ({
              file: { uri: vid.videoUrl },
              id: vid.videoId || null,
              resource: vid.resourceUri || [], // Populate with all resources
              title: vid.videoTitle,
          })),
      }))
  
    );
    console.log(util.inspect(data.course.sections.map((section, sectionIndex) => ({
      expanded: sectionIndex === 0, // Expand only the first section by default
      id: section.sectionId || null,
      title: section.sectionTitle,
      videos: section.videos.map((vid, vidIndex) => ({
          file: { uri: vid.videoUrl },
          id: vid.videoId || null,
          resource: vid.resourceUri || [], // Populate with all resources
          title: vid.videoTitle,
      })),
  })), { depth: null, colors: true }),"new sections to be set");
    
};


// const updateCourseState = () => {
//   setAllDetailOfThisCourse((prevState) => {
//       const updatedCourse = {
//           course: {
//               ...prevState.course,
//               title,
//               description: des,
//               price,
//               courseThumbnail: thumbnail.uri || prevState.course.courseThumbnail,
//               introductionVideoUrl: video.uri || prevState.course.introductionVideoUrl,
//               sections: sections.map((section, index) => ({
//                   sectionId: prevState.course.sections[index]?.sectionId || Date.now(),
//                   sectionTitle: section.title,
//                   sectionPriority: prevState.course.sections[index]?.sectionPriority || index + 1,
//                   videos: section.videos.map((vid, vidIndex) => ({
//                       videoId: prevState.course.sections[index]?.videos[vidIndex]?.videoId || Date.now(),
//                       videoTitle: vid.title,
//                       videoUrl: vid.file?.uri || prevState.course.sections[index]?.videos[vidIndex]?.videoUrl || "",
//                       thumbnailUrl: vid.resource.length > 0 ? vid.resource[0].uri : "",
//                       views: prevState.course.sections[index]?.videos[vidIndex]?.views || 0,
//                       videoPriority: prevState.course.sections[index]?.videos[vidIndex]?.videoPriority || vidIndex + 1,
//                       resourceUri: vid.resource.map((res) => res.uri), // Updating all resources
//                   })),
//               })),
//           },
//       };

//       // Prevent unnecessary state updates
//       if (JSON.stringify(updatedCourse) !== JSON.stringify(prevState)) {
//           return updatedCourse;
//       }
//       return prevState;
//   });
// };

const updateCourseState = () => {
  setAllDetailOfThisCourse((prevState) => {
    if (!prevState || !prevState.course) return prevState; // Prevents issues if prevState is null/undefined

    // console.log("current section :", util.inspect(sections, { depth: null, colors: true }));
    const updatedCourse = {
      course: {
        ...prevState.course,
        title: title || prevState.course.title,
        description: des || prevState.course.description,
        price: price || prevState.course.price,
        courseThumbnail: thumbnail?.uri || prevState.course.courseThumbnail,
        introductionVideoUrl: video?.uri || prevState.course.introductionVideoUrl,
        sections: sections.map((section, index) => {
          const prevSection = prevState.course.sections?.find((s) => s.sectionId === section.id) || {};
          return {
            sectionId: section.id || prevSection.sectionId || null, // Assigns ID if missing
            sectionTitle: section.title?.trim() || prevSection.sectionTitle || "Untitled Section",
            sectionPriority: prevSection.sectionPriority || index + 1,
            videos: section.videos.map((vid, vidIndex) => {
              const prevVideo = prevSection.videos?.find((v) => v.videoId === vid.id) || {};
              console.log(prevVideo, "prevVideo");
              
              return {
                videoId: vid.id || prevVideo.videoId || null, // Ensures video ID exists
                videoTitle: vid.title?.trim() || prevVideo.videoTitle || "Untitled Video",
                videoUrl: vid.file?.uri || prevVideo.videoUrl || "",
                // thumbnailUrl: vid.resource?.[0] || prevVideo.thumbnailUrl || "", // Ensures thumbnail URL exists
                thumbnailUrl: "",
                views: prevVideo.views ?? 0, // Ensures views are not undefined
                videoPriority: prevVideo.videoPriority || vidIndex + 1,
                resourceUri: vid.resource || prevVideo.resourceUri || [], // Ensures resources are preserved
              };
            }),
          };
        }),
      },
    };

    return JSON.stringify(updatedCourse) !== JSON.stringify(prevState) ? updatedCourse : prevState;
  });
};



useEffect(() => {
  if (!allDetailOfThisCourse) { // Runs only on the first render
      setAllDetailOfThisCourse(EditCourseData);
      fillStateFromFormattedData(EditCourseData);
  }
}, []);

useEffect(() => {
  if (allDetailOfThisCourse) { 
      updateCourseState();
  }
}, [title, des, price, thumbnail, video, sections]);


  


  const pickVideo = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["video/*"],
          multiple: false,
          copyToCacheDirectory: true,
        });
  
        if (!result.canceled) {
          setVideo(result.assets[0]);
        }
        const file = result.assets[0]; // Access the selected file

  // Check file size limit (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        Alert.alert("File too large", "Please select a video under 20MB.");
        return;
      }
      } catch (error) {
        Alert.alert("Error", "Failed to pick a video.");
      }
    };

  const pickThumbnail = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["image/*"],
          multiple: false,
          copyToCacheDirectory: true,
        });

        if (!result.canceled) {
          
          setThumbnail(result.assets[0]);

          
        }

        const file = result.assets[0]; // Access the selected file

  // Check file size limit (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        Alert.alert("File too large", "Please select a video under 20MB.");
        return;
      }
      } catch (error) {
        Alert.alert("Error", "Failed to pick a image.");
      }
    };

    const handleAddVideo = (title, file, resource) => {

      setSections(prevSections => 
          prevSections.map(section => {
              if (section.id === selectedSection.id) { // Find the correct section
                  return {
                      ...section,
                      videos: editingVideo 
                          ? section.videos.map(video => 
                              video.id === editingVideo.id 
                                  ? { ...video, title, file, resource } // Update existing video
                                  : video
                          ) 
                          : [...section.videos, { id: null, title, file, resource }] // Add new video
                  };
              }
              return section;
          })
      );
  
      setEditingVideo(null); // Reset editing mode
  };
  
    

  const addSection = () => {
    setSections([...sections, { id: '', title: `Section ${sections.length + 1}`, videos: [], expanded: false }]);
  };

  const toggleSection = (id) => {
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, expanded: !section.expanded } : section))
    );
  };

  const handleEditSectionTitle = (id, title) => {
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, title } : section))
    );
    setEditingSectionId(null);
  };


const handleClear = async () => {

  
    Alert.alert(
        "Are you sure?",
        "This action cannot be undone!",
        [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Yes, Clear it!",
                onPress: async () => {
                    await removeCourseData();
                    setAllDetailOfThisCourse();
                    setDesc("");
                    setPrice("");
                    setThumbnail({});
                    setVideo({});
                    setTitle("");
                    setSections([]);
                },
            },
        ],
        { cancelable: true }
    );
};



const handleUpload = async () => {
  
  const course = allDetailOfThisCourse.course;

  
  if (!course.title) {
    alert("Title is required. Please fill it before proceeding.");
    return;
  }
  if (!course.description) {
    alert("Description is required. Please fill it before proceeding.");
    return;
  }
  if (!course.price) {
    alert("Price is required. Please fill it before proceeding.");
    return;
  }
  if (!course.courseThumbnail) {
    alert("Course Thumbnail is required. Please fill it before proceeding.");
    return;
  }
  if (!course.introductionVideoUrl) {
    alert("Introduction Video URL is required. Please fill it before proceeding.");
    return;
  }

  course.sections.map(section => { 
    if(section.videos.length === 0){
      alert(`please add aleast one content in section '${section.sectionTitle}'.`); }
  })
  
  
  

  Alert.alert(
      "Confirm Update",
      "Are you sure you want to update the course?",
      [
          { text: "Cancel", style: "cancel" },
          {
              text: "Yes, Update!",
              onPress: async () => {

  
                  dispatch(updateAllToServer({allDetailOfThisCourse, EditCourseData,instructorId }))
                      .unwrap()
                      .then(async (result) => {

                        const updatedCourse = result.user.courses.find(
                          course => course.course.courseId === EditCourseData.course.courseId
                        );
                        if(updatedCourse){
                          EditCourseData = updatedCourse;
                          setAllDetailOfThisCourse(updatedCourse);
                          fillStateFromFormattedData(updatedCourse);
                        }
                        Alert.alert("Success", "Course updated successfully.");
                      })
                      .catch((error) => {
                          console.log("Error uploading course", error);
                          Alert.alert("Error", "Error uploading course. Please try again.");
                      });
              },
          },
      ],
      { cancelable: true }
  );
};


  const handlesectionremove = async (section) => {
  
    if(section.id == ''){
      console.log("cvbn");
      setSections(sections.filter(sectionList => sectionList.id !== section.id));
        return;
    }

      const handleDeleteResource = async () => {
          try {
            const sectionId = section.id;
            dispatch(deleteSection({sectionId,instructorId}))
            .unwrap()
                      .then(async (result) => {
                        console.log("result",util.inspect(result, { depth: null, colors: true }));
          
                        const updatedCourse = await result.user.courses.find(
                          course => course.course.courseId === EditCourseData.course.courseId
                        );
                        console.log(util.inspect("updatedCourse",updatedCourse, { depth: null, colors: true }));
                        
                        if(updatedCourse){
                          EditCourseData = updatedCourse;
                          setAllDetailOfThisCourse(updatedCourse);
                          fillStateFromFormattedData(updatedCourse);
                        }
                      })
                      .catch((error) => {
                          console.log("Error Deleting section", error);
                          Alert.alert("Error", "Error Deleting section. Please try again.");
                      });
            
          } catch (error) {
            console.log(error.message);
            throw error.response?.data?.message || "Failed to delete resource";
  
          }

    };
    const handleCancelDelete = () => {
        console.log("Deletion cancelled");
    };

    Alert.alert(
      "Delete Section",
      "Are you sure you want to remove the section?",
      [
          { text: "Cancel", style: "cancel", onPress: handleCancelDelete },
          { text: "Yes", onPress: handleDeleteResource }
      ],
      { cancelable: true }
      );

  }

  const openResource = async (file) => {
    console.log("Opening file:", file);
  
    try {
      if (file.uri.startsWith("http")) {
        // Open remote URL in a browser
        await Linking.openURL(file.uri);
        return;
      }
      
      // await WebBrowser.openBrowserAsync(file.uri);
      if (Platform.OS === "android") {
        try {
          // Convert file:// to content://
          const contentUri = await FileSystem.getContentUriAsync(file.uri);
    
          await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: contentUri, // Use content URI
            flags: 1,
            type: file.mimeType || "image/*",
          });
        } catch (error) {
          console.error("Error opening file:", error);
        }
      } else {
        await Sharing.shareAsync(file.uri);
      }
    } catch (error) {
      console.error("Error opening document:", error);
      Alert.alert("Error", "Could not open the document.");
    }
  };

  
  // return (
  //   <>
  //       <SafeAreaView style={{ flex: 1,padding: 15, backgroundColor: "white" }} contentContainerStyle={{ paddingBottom: 20 }}>
  //       <ScrollView 
  //       showsVerticalScrollIndicator={false} 
  //       // contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
  //       keyboardShouldPersistTaps="handled"
  //       nestedScrollEnabled={true}
  //   >
          

  //         <Modal visible={loading} transparent animationType="fade">

  //       <View style={{
  //           flex: 1,
  //           justifyContent: "center",
  //           alignItems: "center",
  //           backgroundColor: "rgba(0, 0, 0, 0.5)",
  //           paddingBottom: 50, // Adjusted to not cover bottom navigation
  //         }}>
  //         <View style={{
  //         width: "80%",
  //         padding: 20,
  //         borderRadius: 10,
  //         backgroundColor: "rgba(0, 0, 0, 0.8)",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}>
  //                 <ActivityIndicator size="large" color="#fff" />
  //                 <Text style={{
  //         color: "#fff",
  //         fontSize: 18,
  //         marginTop: 10,
  //       }}>Your course is getting uploaded...</Text>
  //         </View>
  //       </View>
  //      </Modal>
  //       {/* // )} */}
  //        <View style={{flex: 1}} >
  //                 <View style={{ flexDirection: "row", justifyContent: "space-between", padding:6 }}>

                    
  //         <Button title="Cancel" onPress={() => navigation.goBack()} />
  //         <Button title="Update" onPress={handleUpload} />

  //           </View>
  //           <TextInput
  //             value={title}
  //             onChangeText={setTitle}
  //             placeholder="Enter Course Title"
  //             style={{
  //               borderWidth: 1,
  //               borderColor: "#ccc",
  //               borderRadius: 10,
  //               padding: 10,
  //               marginBottom: 10,
  //             }}
  //           />
  //           <TextInput
  //             value={des}
  //             onChangeText={setDesc}
  //             placeholder="Description"
  //             multiline={true}
  //             numberOfLines={5} // Adjust for better height
  //             style={{
  //           // Darker border for contrast
  //               borderWidth: 1,
  //               borderColor: "#ccc",
  //               // backgroundColor: "#f9f9f9", // Light background for better visibility
  //               borderRadius: 12,
  //               padding: 8, // More padding for better look
  //               marginBottom: 10,
  //               fontSize: 16, // Bigger text for readability
  //               color: "#333", // Darker text for better contrast
  //               textAlignVertical: "top", // Ensures text starts from top
  //             }}
  //           />
  //           <TextInput
  //             value={price}
  //             onChangeText={(text) => {
  //               // Allow only numbers
  //               if (/^\d+(\.\d{0,2})?$/.test(text)) {
  //                 setPrice(text);
  //             }
              
  //             }}
  //             placeholder="Price"
  //             keyboardType="numeric" // Ensures numeric keyboard on mobile
  //             inputMode="numeric" // Helps with better compatibility
  //             style={{
  //               borderWidth: 1,
  //               borderColor: "#ccc",
  //               borderRadius: 10,
  //               padding: 10,
  //               marginBottom: 10,
  //               fontSize: 16, // Increases readability
  //             }}
  //           />

  //           <View
  //             style={{
  //               flexDirection: "row",
  //               alignItems: "center",
  //               borderWidth: 1,
  //               borderColor: "#ccc",
  //               padding: 10,
  //               marginBottom: 10,
  //               borderRadius: 5,
  //               flexWrap: "wrap", // Allows text to move to the next line
  //               width: "100%", // Ensures full width
  //             }}
  //           >
  //             <View style={{ flex: 1 }}> {/* Ensures text takes available space */}
  //               <TouchableOpacity onPress={() => setOpenVideoModal(true)} style={{ flex: 1 }}>
  //               <Text style={{ fontSize: 14 }}>
  //               {video?.uri ? "IntroductionVideo.mp3" : "No Video chosen"}
  //               </Text>
  //               </TouchableOpacity>
  //             </View>
  //             <TouchableOpacity
  //               onPress={pickVideo} // Replace with your function
  //               style={{
  //                 backgroundColor: "#007bff",
  //                 paddingVertical: 7,
  //                 paddingHorizontal: 12,
  //                 borderRadius: 10,
  //                 elevation: 3,
  //                 shadowColor: "#000",
  //                 shadowOffset: { width: 0, height: 2 },
  //                 shadowOpacity: 0.2,
  //                 shadowRadius: 3,
  //                 marginLeft: 10, // Adds spacing between text and button
  //               }}
  //             >
  //               <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
  //                 Change
  //               </Text>
  //             </TouchableOpacity>
  //           </View>

  //           <View
  //             style={{
  //               marginBottom: 10,
  //               flexDirection: "row",
  //               alignItems: "center",
  //               borderWidth: 1,
  //               borderColor: "#ccc",
  //               padding: 5,
  //               borderRadius: 5,
  //               flexWrap: "wrap", // Allows text to move to the next line
  //               width: "100%", // Ensures full width
  //             }}
  //           >
  //             <View style={{ flex: 1 }}> {/* Ensures text takes available space */}
  //               <TouchableOpacity onPress={() => openResource(thumbnail)} style={{ flex: 1 }}>
  //               <Text style={{ fontSize: 14 }}>
  //               {thumbnail?.uri?"thumnailImage.jpeg":"Choose Thumbnail"}
  //               </Text>
  //               </TouchableOpacity>
  //             </View>
  //             <TouchableOpacity
  //               onPress={pickThumbnail} // Replace with your function
  //               style={{
  //                 backgroundColor: "#007bff",
  //                 paddingVertical: 7,
  //                 paddingHorizontal: 12,
  //                 borderRadius: 10,
  //                 elevation: 3,
  //                 shadowColor: "#000",
  //                 shadowOffset: { width: 0, height: 2 },
  //                 shadowOpacity: 0.2,
  //                 shadowRadius: 3,
  //                 marginLeft: 10,
  //                 marginBottom: 10, // Adds spacing between text and button
  //               }}
  //             >
  //               <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
  //                 Change
  //               </Text>
  //             </TouchableOpacity>
  //           </View>


  //           <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

  //       <View>
  //         {sections.map((section) => (
  //           <View key={section.id} style={{ marginBottom: 10 }}>
  //             <TouchableOpacity
  //               onPress={() => toggleSection(section.id)}
  //               style={{
  //                 flexDirection: "row",
  //                 justifyContent: "space-between",
  //                 padding: 10,
  //                 backgroundColor: "#ddd",
  //                 borderRadius: 5,
  //               }}
  //             >
  //               {editingSectionId === section.id ? (
  //                 <TextInput
  //                   value={editingSectionTitle}
  //                   onChangeText={setEditingSectionTitle}
  //                   onBlur={() => handleEditSectionTitle(section.id, editingSectionTitle)}
  //                   autoFocus
  //                   style={{ flex: 1, borderBottomWidth: 1 }}
  //                 />
  //               ) : (
  //                 <Text
  //                   onLongPress={() => {
  //                     setEditingSectionId(section.id);
  //                     setEditingSectionTitle(section.title);
  //                   }}
  //                 >
  //                    {section.title ? section.title.toString() : "No Title"}

  //                 </Text>
  //               )}
  //               <View style={{ flexDirection: "row", alignItems: "center" }}>
  //                               <Icon name={section.expanded ? "chevron-up" : "chevron-down"} size={20} color="gray" />
  //                               <TouchableOpacity onPress={() => { handlesectionremove(section) }}>
  //                                               <AntDesign name="close" size={22} color="red" />
  //                               </TouchableOpacity>
  //                               </View>
  //             </TouchableOpacity>
  //             {section.expanded && (
  //               <View style={{ paddingLeft: 10, paddingVertical: 5 }}>
  //                 {section.videos.map((item) => (
  //                   <View
  //                     key={item.id}
  //                     style={{
  //                       flexDirection: "row",
  //                       justifyContent: "space-between",
  //                       alignItems: "center",
  //                       paddingVertical: 8,
  //                       paddingHorizontal: 12,
  //                       borderBottomWidth: 1,
  //                       borderBottomColor: "#ddd",
  //                       backgroundColor: "#f9f9f9",
  //                       borderRadius: 6,
  //                       marginVertical: 4,
  //                       elevation: 2,
  //                       shadowColor: "#000",
  //                       shadowOffset: { width: 0, height: 1 },
  //                       shadowOpacity: 0.08,
  //                       shadowRadius: 3,
  //                     }}
  //                   >
  //                     <Text style={{ fontSize: 14, fontWeight: "400", color: "#333" }}>{item.title ? item.title.toString() : "No Title"}</Text>
  //                     <TouchableOpacity
  //                       onPress={() => {
  //                         setEditingVideo(item);
  //                         setSelectedSection(section);
  //                         setModalVisible(true);
  //                       }}
  //                       style={{ backgroundColor: "#007bff", padding: 4, borderRadius: 5 }}
  //                     >
  //                       <Icon name="pencil" size={16} color="white" />
  //                     </TouchableOpacity>
  //                   </View>
  //                 ))}
  //                 <TouchableOpacity
  //                   onPress={() => {
  //                     setSelectedSection(section);
  //                     setModalVisible(true);
  //                   }}
  //                   style={{
  //                     paddingVertical: 8,
  //                     paddingHorizontal: 12,
  //                     backgroundColor: "#28a745",
  //                     borderRadius: 6,
  //                     alignSelf: "center",
  //                     marginTop: 8,
  //                     elevation: 2,
  //                     shadowColor: "#000",
  //                     shadowOffset: { width: 0, height: 1 },
  //                     shadowOpacity: 0.08,
  //                     shadowRadius: 3,
  //                   }}
  //                 >
  //                   <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>+ Add Content</Text>
  //                 </TouchableOpacity>
  //               </View>
  //             )}
  //           </View>
  //         ))}
  //       </View>

  //        <TouchableOpacity
  //         onPress={addSection}
  //         style={{
  //           paddingVertical: 14, // Increased padding for a larger button
  //           paddingHorizontal: 20, // Wider button
  //           backgroundColor: "#007BFF", // Blue color
  //           // Darker green for better contrast
  //           borderRadius: 8, // Slightly more rounded corners
  //           alignSelf: "center",
  //           marginTop: 3, // Increased margin for spacing
  //           elevation: 5, // Stronger shadow for depth
  //           shadowColor: "#000",
  //           shadowOffset: { width: 0, height: 3 },
  //           shadowOpacity: 0.2,
  //           shadowRadius: 4,
  //         }}
  //       >
  //         <Text
  //           style={{
  //             color: "white",
  //             fontSize: 18, // Increased font size for visibility
  //             fontWeight: "bold", // Bold text for emphasis
  //             textTransform: "uppercase", // Uppercase for a strong CTA
  //             letterSpacing: 1, // Spaced-out letters for readability
  //           }}
  //         >
  //           Add Section
  //         </Text>
  //       </TouchableOpacity>

  //         <AddContentModal
  //           visible={modalVisible}
  //           onClose={() => { setModalVisible(false); setEditingVideo(null); }}
  //           onAddVideo={handleAddVideo}
  //           editingVideo={editingVideo}
  //         />
  //         </KeyboardAvoidingView>
  //        </View>
  //        <Modal visible={openVideoModal} animationType="fade" transparent={false}>
  //       <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}>
  //         <Video
  //           ref={videoRef}
  //           source={{ uri: video?.uri }}
  //           useNativeControls
  //           resizeMode="contain"
  //           style={{ flex: 1 }}
  //           shouldPlay
  //         />
  //         <TouchableOpacity
  //           onPress={() => setOpenVideoModal(false)}
  //           style={{
  //             position: "absolute",
  //             top: 40,
  //             right: 20,
  //             backgroundColor: "rgba(0,0,0,0.6)",
  //             padding: 14,
  //             borderRadius: 30,
  //           }}
  //         >
  //           <Text style={{ color: "white", fontWeight: "bold", fontSize: 22 }}>✕</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </Modal>
        
  //       </ScrollView></SafeAreaView>
  //   </>

  // );

  return (<>
    {/* <View style={{flex:1,marginBottom:100, backgroundColor:COLORS.background}}> */}
      <SafeAreaView style={styles.safeAreaView} contentContainerStyle={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          // style={{marginBottom:100}}
        >
          <Modal visible={loading} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.modalText}>Your course is getting updated...</Text>
              </View>
            </View>
          </Modal>
  
          <View style={styles.container}>
            <View style={styles.buttonRow}>
  
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button,{marginLeft:0,backgroundColor:COLORS.secondary}]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpload} style={[styles.button,{marginLeft:0}]}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              {/* <Button title="Cancel" onPress={() => navigation.goBack()} /> */}
              {/* <Button title="Update" onPress={handleUpload} /> */}
            </View>
            {/* <Text style={{color:COLORS.primary,fontSize:FONT_SIZES.h2,fontWeight:'bold',marginLeft:10}}>Update Your Course</Text> */}
           <View style={styles.basicInfo}>
           <Text style={styles.info}>Title</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="Enter Course Title" style={styles.input} />
            <Text style={styles.info}>Description</Text>
            <TextInput value={des} onChangeText={setDesc} placeholder="Description" multiline numberOfLines={5} style={styles.description} />
            <Text style={styles.info}>Price</Text>
            <TextInput
              value={price}
              onChangeText={(text) => {
                if (/^\d*\.?\d*$/.test(text)) {
                  setPrice(text);
              }
              }}
              placeholder="Price"
              keyboardType="numeric"
              inputMode="numeric"
              style={styles.input}
            />
  
            <Text style={styles.info}>Introduction Video</Text>  
            <View style={styles.filePicker}>
              <View style={styles.flexOne}>
                <TouchableOpacity onPress={() => setOpenVideoModal(true)}>
                  <Text style={styles.text}>{video?.uri ? "IntroductionVideo.mp3" : "No Video chosen"}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={pickVideo} style={styles.button}>
                <Text style={styles.buttonText}>Change</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.info}>Thumbnail Image</Text>  
            <View style={styles.filePicker}>
              <View style={styles.flexOne}>
                <TouchableOpacity onPress={() => openResource(thumbnail)}>
                  <Text style={styles.text}>{thumbnail?.uri ? "thumbnailImage.jpeg" : "Choose Thumbnail"}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={pickThumbnail} style={styles.button}>
                <Text style={styles.buttonText}>Change</Text>
              </TouchableOpacity>
            </View>
           </View>
  
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flexOne}>
              {/* <View style={styles.basicInfo}> */}
                {sections.map((section) => (
                  <View key={section.id} style={styles.section}>
                    <View style={[!section.expanded?styles.basicInfo:null]}>
                    <TouchableOpacity onPress={() => toggleSection(section.id)} style={styles.sectionHeader}>
                      {editingSectionId === section.id ? (
                        <TextInput value={editingSectionTitle} onChangeText={setEditingSectionTitle} onBlur={() => handleEditSectionTitle(section.id, editingSectionTitle)} autoFocus style={styles.sectionInput} />
                      ) : (
                        <Text onLongPress={() => {
                          setEditingSectionId(section.id);
                          setEditingSectionTitle(section.title);
                        }} style={styles.sectionText}>
                          {section.title ? section.title.toString() : "No Title"}
                        </Text>
                      )}
                      <View style={styles.sectionIcons}>
                        <Icon name={section.expanded ? "chevron-up" : "chevron-down"} size={22} color={COLORS.primary} />
                        <TouchableOpacity onPress={() => handlesectionremove(section)} style={{marginLeft:10}}>
                          <AntDesign name="delete" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity></View>
                      <View style={[section.expanded?styles.basicInfo:null]}>
                    {section.expanded && (
                      <View style={styles.sectionContent}>
                        {section.videos.map((item) => (
                          <View key={item.id} style={styles.videoItem}>
                            <Text style={styles.videoText}>{item.title ? item.title.toString() : "No Title"}</Text>
                            <TouchableOpacity onPress={() => {
                              setEditingVideo(item);
                              setSelectedSection(section);
                              setModalVisible(true);
                              
                            }} style={styles.editButton}>
                              <Icon name="pencil" size={16} color={COLORS.secondary} />
                            </TouchableOpacity>
                          </View>
                        ))}
                        <TouchableOpacity onPress={() => {
                          setSelectedSection(section);
                          setModalVisible(true);
                        }} style={styles.addButton}>
                          <Text style={styles.addButtonText}>+ Add Content</Text>
                        </TouchableOpacity>
                      </View>
                    )}</View>
                  </View>
                ))}
              
  
              <TouchableOpacity onPress={addSection} style={styles.addSectionButton}>
                <Text style={styles.addSectionText}>+ Add Section</Text>
              </TouchableOpacity>
              {/* </View> */}



                

            </KeyboardAvoidingView>
          </View>


          <AddContentModal
            visible={modalVisible}
            onClose={() => { setModalVisible(false); setEditingVideo(null); }}
            onAddVideo={handleAddVideo}
            editingVideo={editingVideo}
          />
          {/* </KeyboardAvoidingView> */}
         {/* </View> */}
         <Modal visible={openVideoModal} animationType="fade" transparent={false}>
        <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}>
          <Video
            ref={videoRef}
            source={{ uri: video?.uri }}
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
      </Modal>

          
        </ScrollView>
      </SafeAreaView>
      {/* </View> */}
    </>
  );
  
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
    // marginBottom: 100,
    backgroundColor: COLORS.background,
    // paddingBottom: 100,
  },
  contentContainer: {
    paddingBottom: 20,
    backgroundColor: COLORS.background,
    // marginBottom: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingBottom: 50,
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.body+2,
    marginTop: 10,
  },
  container: {
    flex: 1,
    marginBottom: 100,
  },

 
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: 6,
    marginHorizontal: 7,
    marginTop: 10,
  },
  basicInfo: {
    backgroundColor: COLORS.background,
    padding: 13,
    // paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 }, // Slight negative height to reduce bottom shadow
    shadowOpacity: 0.15, // Reduced opacity for a softer effect
    shadowRadius: 8, // Slightly smaller for a refined look
    elevation: 3, // Lower elevation to minimize bottom shadow on Android
    marginVertical: 10,
    marginHorizontal: 2, // More space around for the shadow effect
  },

  info:{
    fontFamily: FONTS.text,
    fontSize: FONT_SIZES.h3 - 5,
    fontWeight: "bold",
    color: COLORS.text,
    paddingHorizontal: 5,
    paddingVertical: 5
  },
  input: {
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 10,
    // padding: 10,
    // marginBottom: 10,
    // fontSize: 16,

    // flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 12,
    // padding: 8,
    // marginBottom: 10,
    // fontSize: 16,
    // color: "#333",
    textAlignVertical: "top",
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
  },
  filePicker: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "#ccc",
    backgroundColor: COLORS.secondary,
    padding: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 6,
    width: "100%",
    height: 45,
    elevation: 1, // Subtle shadow for depth
  },
  
  
  flexOne: {
    flex: 1,
  },
  text: {
    fontSize: FONT_SIZES.h5,
    color:COLORS.text,
    // textDecorationLine: "underline",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
  },
  buttonText: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.button,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
    // height: 45,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  
    // backgroundColor: "#ddd",
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
  },
  sectionText:{
    fontSize: FONT_SIZES.h5,
    color:COLORS.text,
    fontWeight: "bold",
  },
  sectionInput: {
    flex: 1,
    // borderBottomWidth: 1,
  },
  sectionIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionContent: {
    
    // paddingLeft: 10,
    // paddingVertical: 5,
  },
  videoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 8,

    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",
    marginBottom: 10,
    borderRadius: 10,
    // marginVertical: 4,
    // elevation: 2,
    width: "100%",
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    height: 45,
  marginHorizontal:0
    // marginBottom: 15,
  },
  videoText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
  },
  editButton: {
    backgroundColor: COLORS.primary,
    padding: 4,
    borderRadius: 5,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 8,
    // elevation: 2,
  },
  addButtonText: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.text,
    fontWeight: "500",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 8,
    // elevation: 2,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.text,
    fontWeight: "500",
  },
  addSectionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 3,
    // elevation: 5,
  },
  addSectionText: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.h3,
    fontWeight: "bold",
  },
});


export default EditCourse;
