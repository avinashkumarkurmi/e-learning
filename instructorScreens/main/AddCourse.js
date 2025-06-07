import React, { useState, useEffect,useRef } from "react";
import { View, Text, Alert, ActivityIndicator,Modal,SectionList,StyleSheet ,TouchableOpacity,TextInput, FlatList, SafeAreaView,ScrollView ,KeyboardAvoidingView, Platform, Button } from "react-native";
import AddContentModal from "../../components/userDefine/AddContentModal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { TextInput } from "react-native-paper";
import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system";
import { COLORS, FONTS, FONT_SIZES } from "../../constants";
import {uploadFilesToServer} from "../../uitil/viedoResource";
import {createDemoCouresForUpload } from '../../redux/slices/instructorSlice';
import * as DocumentPicker from "expo-document-picker";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { setNewData, uploadAllToServer } from "../../redux/slices/instructorSlice";
import { uploadFullCourse } from "../../uitil/viedoResource";
import Swal from "sweetalert2";
import Toast from "react-native-toast-message";
import { Video } from 'expo-av';
import * as WebBrowser from "expo-web-browser";
import AwesomeAlert from "react-native-awesome-alerts";

const AddCourse = () => {

  // const state = useSelector((state) => state);
  const instructorState = useSelector((state) => state.reducer.instructor);
  const loading = instructorState.loading
  // const loading = false;
  const videoRef = useRef(null);
  
  const instructorId = instructorState.instructorInfo.user.instructor.info.instructorid;

  const [sections, setSections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [openVideoModal, setOpenVideoModal] = useState(false);

  const [allDetailOfThisCourse, setAllDetailOfThisCourse] = useState();
  
  const [title, setTitle] = useState("");
  const [des, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [video, setVideo] = useState({});
  const [thumbnail, setThumbnail] = useState({});

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  

  const dispatch = useDispatch();
  
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

  const convertStateToFormattedData = () => {
    return [
      {
        course: {
          courseId: null,
          courseThumbnail: thumbnail.uri || null,
          description: des || null,
          duration: null,
          introductionVideoUrl: video.uri || null,
          price: price || null,
          review: null,
          title: title || null,
          sections: sections.map((section, sectionIndex) => ({
            sectionId: sectionIndex + 1,
            sectionPriority: sectionIndex + 1,
            sectionTitle: section.title,
            videos: section.videos.map((vid, vidIndex) => ({
              videoId: null,
              videoPriority: vidIndex + 1,
              videoTitle: vid.title,
              videoUrl: vid.file.uri,
              // thumbnailUrl: "https://example.com/default-thumb.jpg",
              resourcesUrl: vid.resource || "https://example.com/default-thumb.jpg",
              views: 0,
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
    
    setSections(
      data.course.sections.map((section, sectionIndex) => ({
        expanded: sectionIndex === 0, // Expand only the first section by default
        id: `${Date.now()}-${sectionIndex}`,
        title: section.sectionTitle,
        videos: section.videos.map((vid, vidIndex) => ({
          file: { uri: vid.videoUrl },
          id: `${Date.now()}-${vidIndex}`,
          // resource: vid.thumbnailUrl ? [{ uri: vid.thumbnailUrl }] : [],
          resource: vid.resourcesUrl ? vid.resourcesUrl: [],
          title: vid.videoTitle,
        })),
      }))
    );
  };

  useEffect(()=>{
    
   const asyFunction =  async () =>{
    const newCourse = await checkCourseData();
    if(newCourse != null && newCourse != "error"){
      fillStateFromFormattedData(newCourse)
      setAllDetailOfThisCourse(newCourse)
    }
    
   }
   asyFunction();

  },[])
  useEffect(()=>{
    const asyFunction =  async () =>{

      const data = convertStateToFormattedData();
      setAllDetailOfThisCourse(data)
      console.log(data[0].course.sections[0].videos[0],"data");
      
      await saveCourseData(data)
      const e = await checkCourseData();
      console.log(e[0].course.sections[0].videos[1],"e");
      // console.log(await checkCourseData()[0].course.sections[0].videos[0],"ghh");
      
  }
  asyFunction();

  },[title,des,price,thumbnail,video,sections])


 
  

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
    setSections((prev) =>
      prev.map((section) =>
        section.id === selectedSection.id
          ? { ...section, videos: [...section.videos, { id: Date.now().toString(), title, file, resource }] }
          : section
      )
    );
    setEditingVideo(null);
  };

  const addSection = () => {
    setSections([...sections, { id: Date.now().toString(), title: `Section ${sections.length + 1}`, videos: [], expanded: false }]);
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

  const course = allDetailOfThisCourse[0].course;
  
 

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

  if(course.sections.length === 0){
    alert("Aleast one section is required. Please fill it before proceeding.");
    return; 
  }
  
  // course.sections.map(async section => { 
  //   if(section.videos.length === 0){
  //     alert(`please add aleast one content in section '${section.sectionTitle}'.`); }
  // })

  for (const section of course.sections) {
    if (section.videos.length === 0) {
      alert(`Please add at least one content in section '${section.sectionTitle}'.`);
      return;
    }
  }
  
  Alert.alert(
      "Confirm Upload",
      "Are you sure you want to upload the course?",
      [
          { text: "Cancel", style: "cancel" },
          {
              text: "Yes, Upload!",
              // onPress: null
              onPress: async () => {
                  const dataToBeUploaded = await checkCourseData();
                  dispatch(uploadAllToServer({ dataToBeUploaded, instructorId }))
                      .unwrap()
                      .then(async (result) => {
                          Alert.alert("Success", "Full course has been uploaded successfully!");
                            await removeCourseData();
                            setAllDetailOfThisCourse();
                            setDesc("");
                            setPrice("");
                            setThumbnail({});
                            setVideo({});
                            setTitle("");
                            setSections([]);
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

const removeSection = (selectedSection) => {
  setSections(sections.filter(section => section.id !== selectedSection.id));
}
  
  return (
    <>
        <SafeAreaView style={styles.safeAreaView} contentContainerStyle={styles.contentContainer}>
        <ScrollView 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
        >
          
           {/* {loading && ( */}
           <Modal visible={loading} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.modalText}>Your course is getting uploaded...</Text>
              </View>
            </View>
          </Modal>
        {/* // )} */}
        <View style={{flex:1, marginBottom:100}}>
        <View style={{justifyContent:'center',alignItems:'center'}}>

            <Text style={{color:COLORS.primary, fontSize: FONT_SIZES.h2, fontWeight:"bold"}}>Upload Your Course</Text>
            </View>
        
         <View style={styles.buttonRow}>
  
  <TouchableOpacity onPress={handleClear} style={[styles.button,{backgroundColor:COLORS.secondary, marginLeft:0}]}>
      <Text style={styles.cancelButtonText}>Clear</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleUpload} style={[styles.button,{marginLeft:0}]}>
      <Text style={styles.buttonText}>Upload</Text>
    </TouchableOpacity>
    {/* <Button title="Cancel" onPress={() => navigation.goBack()} /> */}
    {/* <Button title="Update" onPress={handleUpload} /> */}
  </View>
            {/* <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter Course Title"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                padding: 10,
                marginBottom: 10,
              }}
            /> */}
            
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
              <View style={styles.flexOne}>{video?.name &&  
                <TouchableOpacity onPress={() => setOpenVideoModal(true)}>
                  <Text style={styles.text}>{video.name}</Text>
                </TouchableOpacity> }
                {!video?.name && 
                <TouchableOpacity>
                  <Text style={styles.text}>No Video chosen</Text>
                </TouchableOpacity>}
              </View>
              <TouchableOpacity onPress={pickVideo} style={styles.button}>
                <Text style={styles.buttonText}>Change</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.info}>Thumbnail Image</Text>  
            <View style={styles.filePicker}>
              <View style={styles.flexOne}>

                {thumbnail?.name && 
                <TouchableOpacity onPress={() => openResource(thumbnail)}>
                  <Text style={styles.text}>{thumbnail?.name}</Text>
                </TouchableOpacity> }
                {!thumbnail?.name && 
                <TouchableOpacity >
                  <Text style={styles.text}>Choose Thumbnail</Text>
                </TouchableOpacity> }
                {/* <TouchableOpacity onPress={() => openResource(thumbnail)}>
                  <Text style={styles.text}>{thumbnail?.name?thumbnail?.name:"Choose Thumbnail"}</Text>
                </TouchableOpacity> */}
              </View>
              <TouchableOpacity onPress={pickThumbnail} style={styles.button}>
                <Text style={styles.buttonText}>Change</Text>
              </TouchableOpacity>
            </View>
           </View>
            {/* <TextInput
              value={des}
              onChangeText={setDesc}
              placeholder="Description"
              multiline={true}
              numberOfLines={5} // Adjust for better height
              style={{
            // Darker border for contrast
                borderWidth: 1,
                borderColor: "#ccc",
                // backgroundColor: "#f9f9f9", // Light background for better visibility
                borderRadius: 12,
                padding: 8, // More padding for better look
                marginBottom: 10,
                fontSize: 16, // Bigger text for readability
                color: "#333", // Darker text for better contrast
                textAlignVertical: "top", // Ensures text starts from top
              }}
            />
            <TextInput
              value={price}
              onChangeText={(text) => {
                // Allow only numbers
                if (/^\d*\.?\d*$/.test(text)) {
                  setPrice(text);
                }
              }}
              placeholder="Price"
              keyboardType="numeric" // Ensures numeric keyboard on mobile
              inputMode="numeric" // Helps with better compatibility
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                padding: 10,
                marginBottom: 10,
                fontSize: 16, // Increases readability
              }}
            /> */}

            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
                flexWrap: "wrap", // Allows text to move to the next line
                width: "100%", // Ensures full width
              }}
            >
              <View style={{ flex: 1 }}> {/* Ensures text takes available space */}
                {/* <Text style={{ fontSize: 14 }}>
                {video?.name ? video.name : "No Video chosen"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={pickVideo} // Replace with your function
                style={{
                  backgroundColor: "#007bff",
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  marginLeft: 10, // Adds spacing between text and button
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                  Click Me
                </Text>
              </TouchableOpacity>
            </View> */}

            {/* <View
              style={{
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
                flexWrap: "wrap", // Allows text to move to the next line
                width: "100%", // Ensures full width
              }}
            >
              <View style={{ flex: 1 }}> {/* Ensures text takes available space */}
                {/* <Text style={{ fontSize: 14 }}>
                {thumbnail?.name?thumbnail?.name:"Choose Thumbnail"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={pickThumbnail} // Replace with your function
                style={{
                  backgroundColor: "#007bff",
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  marginLeft: 10,
                  marginBottom: 10, // Adds spacing between text and button
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                  Click Me
                </Text>
              </TouchableOpacity>
            </View> */} 
  

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flexOne}>
          {/* <FlatList
            data={sections}
            keyExtractor={(item) => item.id}
            nestedScrollEnabled={true}
            renderItem={({ item: section }) => (
              <View key={section.id} style={{ marginBottom: 10 }}>
                <TouchableOpacity onPress={() => toggleSection(section.id)} style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#ddd", borderRadius: 5 }}>
                  {editingSectionId === section.id ? (
                    <TextInput
                      value={editingSectionTitle}
                      onChangeText={setEditingSectionTitle}
                      onBlur={() => handleEditSectionTitle(section.id, editingSectionTitle)}
                      autoFocus
                      style={{ flex: 1, borderBottomWidth: 1 }}
                    />
                  ) : (
                    <Text onLongPress={() => { setEditingSectionId(section.id); setEditingSectionTitle(section.title); }}>{section.title}</Text>
                  )}
                  <Icon name={section.expanded ? "chevron-up" : "chevron-down"} size={20} color="gray" />
                </TouchableOpacity>
                {section.expanded && (
                  <View style={{ paddingLeft: 10, paddingVertical: 5 }}>
                  {section.videos.map((item) => (
                    <View
                      key={item.id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ddd",
                        backgroundColor: "#f9f9f9",
                        borderRadius: 6,
                        marginVertical: 4,
                        elevation: 2,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 3,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "400", color: "#333" }}>
                        {item.title}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setEditingVideo(item);
                          setSelectedSection(section);
                          setModalVisible(true);
                        }}
                        style={{
                          backgroundColor: "#007bff",
                          padding: 4,
                          borderRadius: 5,
                        }}
                      >
                        <Icon name="pencil" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedSection(section);
                      setModalVisible(true);
                    }}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: "#28a745",
                      borderRadius: 6,
                      alignSelf: "center",
                      marginTop: 8,
                      elevation: 2,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.08,
                      shadowRadius: 3,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
                      + Add Content
                    </Text>
                  </TouchableOpacity>
                </View>
                
                
                )}
              </View>
            )}
          /> */}

        <View>
          {sections.map((section) => (
            <View key={section.id} style={{ marginBottom: 10 }}>
              <View style={[!section.expanded?styles.basicInfo:null]}>
              <TouchableOpacity
                onPress={() => toggleSection(section.id)}
                style={styles.sectionHeader}
              >
                {editingSectionId === section.id ? (
                  <TextInput
                    value={editingSectionTitle}
                    onChangeText={setEditingSectionTitle}
                    onBlur={() => handleEditSectionTitle(section.id, editingSectionTitle)}
                    autoFocus
                    style={styles.sectionInput}
                  />
                ) : (
                  <Text
                    onLongPress={() => {
                      setEditingSectionId(section.id);
                      setEditingSectionTitle(section.title);
                    }}
                    style={styles.sectionText}
                  >
                    {section.title}
                  </Text>
                )}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name={section.expanded ? "chevron-up" : "chevron-down"} size={22} color={COLORS.primary} />
                <TouchableOpacity onPress={()=> {removeSection(section)}} style={{ marginLeft: 10 }}>
                <AntDesign name="delete" size={18} color={COLORS.primary} />
                </TouchableOpacity>
                </View>
              </TouchableOpacity></View>
              <View style={[section.expanded?styles.basicInfo:null]}>
              {section.expanded && (
                <View  style={styles.sectionContent}>
                  {section.videos.map((item) => (
                    <View
                      key={item.id}
                      style={styles.videoItem}
                    >
                      <Text style={styles.videoText}>{item.title ? item.title.toString() : "No Title"}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setEditingVideo(item);
                          setSelectedSection(section);
                          setModalVisible(true);
                        }}
                        style={styles.editButton}
                      >
                        <Icon name="pencil" size={16} color={COLORS.secondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedSection(section);
                      setModalVisible(true);
                    }}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>+ Add Content</Text>
                  </TouchableOpacity>
                </View>
              )}</View>
            </View>
          ))}
        </View>

         <TouchableOpacity
          onPress={addSection}
          style={styles.addSectionButton}
        >
          <Text
            style={styles.addSectionText}
          >
            Add Section
          </Text>
        </TouchableOpacity>

          <AddContentModal
            visible={modalVisible}
            onClose={() => { setModalVisible(false); setEditingVideo(null); }}
            onAddVideo={handleAddVideo}
            editingVideo={editingVideo}
          />
          </KeyboardAvoidingView></View>
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
        </ScrollView></SafeAreaView>
    </>

  );
  
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 20,
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
    backgroundColor: "#007bff",
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

export default AddCourse;
