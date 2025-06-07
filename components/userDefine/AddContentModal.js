import React, { useState, useEffect, useRef } from "react";
import {View, Text, TextInput, TouchableOpacity, Modal, Dimensions, Alert, Linking,StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { AntDesign } from "@expo/vector-icons";


// import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { deleteResource } from "../../redux/slices/instructorSlice";
import { Platform } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { Video } from 'expo-av';
import { useDispatch ,useSelector } from 'react-redux';
import {uploadFilesToServer} from "../../uitil/viedoResource";
import { COLORS, FONTS,FONT_SIZES } from "../../constants";


const { width } = Dimensions.get("window");

const AddContentModal = ({ visible, onClose, onAddVideo, editingVideo}) => {

const instructorState = useSelector((state) => state.reducer.instructor);
const instructorId = instructorState.instructorInfo.user.instructor.info.instructorid;

  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [resourceFiles, setResourceFiles] = useState([]);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editingVideo) {

      setTitle(editingVideo.title);
      setVideoFile(editingVideo.file);
      setResourceFiles(editingVideo.resource || null);
      
    } else {
      setTitle("");
      setVideoFile(null);
      setResourceFiles([]);
    }
  }, [editingVideo,visible]);



  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setVideoFile(result.assets[0]);
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

    
  const pickResources = async () => {
    
    if(resourceFiles.length == 6){
      alert("Maximum 7 Resources can be added");
      return;
      
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        multiple: true,
        copyToCacheDirectory: true,  
      });

      
      if (!result.canceled) {
        const filteredFiles = result.assets.filter(file => !file.mimeType.startsWith("video/"));
        filteredFiles.forEach(file => {
          setResourceFiles(prevFiles => [...prevFiles, file.uri]);
        });
        
       const file = result.assets[0]; // Access the selected file

  // Check file size limit (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        Alert.alert("File too large", "Please select a video under 20MB.");
        return;
      }
        
      }
      if(result.assets[0].mimeType == "video/mp4"){
          Alert.alert("Error", "Videos are not allowed as resources.");
      }

    } catch (error) {
      Alert.alert("Error", "Failed to pick the documents");
    }
  };

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


  const handleOk = ()=> {
    if(!videoFile){
      alert("Viedo is required. Please select it before proceeding.");
    return;
    }
    if(!title){
      alert("Title is required. Please fill it before proceeding.");
    return;
    }

    
    onAddVideo(title, videoFile, resourceFiles) 
    onClose();
  }

  

  const handleResourceRemove = async (file, index) => {


    // console.log(resourceFiles[index],"editingVideo");
    const isEditingVideo = resourceFiles[index] 
    ? resourceFiles[index].startsWith("file:///") 
    : false;


    
    if(!isEditingVideo){
    
  //   console.log(hasValidResource,"hasValidResource");
  // console.log(hasValidResource,"hasValidResource");
      const handleDeleteResource = async () => {


        try {
          await dispatch(deleteResource({file,instructorId}));
          // Perform delete operation here
            const newResource = [...resourceFiles]; // Create a copy of the array
            newResource.splice(index, 1); // Remove the item at the given index
            setResourceFiles(newResource); // Update the state
            console.log("Resource deleted");
            return;
          
        } catch (error) {
          console.log(error.message);
          throw error.response?.data?.message || "Failed to delete resource";

        }
        
    };
    
    const handleCancelDelete = () => {
        console.log("Deletion cancelled");
    };
    
    Alert.alert(
        "Delete Resource",
        "Are you sure you want to remove the resource?",
        [
            { text: "Cancel", style: "cancel", onPress: handleCancelDelete },
            { text: "Yes", onPress: handleDeleteResource }
        ],
        { cancelable: true }
    );
    
      return;
    }
    const newResource = [...resourceFiles]; // Create a copy of the array
    newResource.splice(index, 1); // Remove the item at the given index
    setResourceFiles(newResource); // Update the state
  
  };
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: width * 0.9,
            padding: 20,
            backgroundColor: "white",
            borderRadius: 12,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
          }}
        >
          {/* Title Input */}
          <Text style={styles.info}>
            Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title..."
            style={styles.input}
          />
  
          <Text style={styles.info}>
            Sub Section Viedo
          </Text>
  
          {/* Video Display */}
          {videoFile && (
            <View
            >
              <View style={[styles.filePicker,{justifyContent:"space-between"}]}>
                
                <TouchableOpacity  onPress={() => setOpenVideoModal(true)}>
                <Text style={[styles.text,{flex:0.8,height:20}]}>
                  {videoFile.name || "Open Video"}
                </Text></TouchableOpacity>
                    <TouchableOpacity
                onPress={pickVideo}
                style={[styles.button]}
              >
                <Text style={[styles.buttonText]}>
                  {videoFile ? "Change Video" : "Pick Video"}
                </Text>
              </TouchableOpacity>
              </View>
              {/* {!editingVideo ? (
                <TouchableOpacity onPress={() => setVideoFile(null)}>
                <AntDesign name="close" size={22} color="red" />
              </TouchableOpacity>
              ):

                null
              } */}
            </View>
          )}
          {!videoFile && (
              <View style={[styles.filePicker,{justifyContent:"space-between"}]}>
                <Text style={styles.text} >
                  No Viedo Seleted
                </Text>
                    <TouchableOpacity
                onPress={pickVideo}
                style={[styles.button]}
              >
                <Text style={styles.buttonText}>
                  Pick Video
                </Text>
              </TouchableOpacity>
              </View>
          )}
  
          {/* Pick Resources Button */}
          {/* <TouchableOpacity
            onPress={pickResources}
            style={{
              padding: 12,
              backgroundColor: "#28A745",
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
              Pick Resources
            </Text>
            
          </TouchableOpacity> */}
          <View style={styles.basicInfo}>
          <View style={{flexDirection:"row", justifyContent:'space-between', marginBottom:10}}>
          <Text style={styles.info}>All Resources</Text>
            
          </View>
          {/* Display Resources */}
          {resourceFiles.map((file, index) => (
            <View
              key={index}
              style={[styles.input,{flexDirection:"row",justifyContent:"center",alignContent:"center",paddingVertical:3}]}
            >
              <TouchableOpacity onPress={() => openResource(file)} style={{ flex: 1 }}>
                <Text style={styles.text}>
                  {file.split("/").pop() || "Open Resource"}
                </Text>
               
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleResourceRemove(file, index)} style={{marginLeft:5,paddingVertical:7}}>
                <AntDesign name="close" size={22} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ))}
          <View style={{width:"100%",justifyContent:"center",alignItems:'center'}}>
          <TouchableOpacity
              onPress={pickResources}
              style={[styles.button, {width:121,}]}
            >
            <Text style={styles.buttonText}>
              Add Resources
            </Text>
            
          </TouchableOpacity></View></View>
          {/* Action Buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={[styles.cancelButtonText,{width:50,}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOk}
              style={styles.addButton}
            >
              <Text style={[styles.addButtonText,{width:50,paddingHorizontal:15}]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  
      {/* Video Modal */}
      <Modal visible={openVideoModal} animationType="fade" transparent={false}>
        <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}>
          <Video
            ref={videoRef}
            source={{ uri: videoFile?.uri }}
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
    </Modal>
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
    color: COLORS.text,
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
    padding: 7,
    paddingTop: 3,
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
// justifyContent:"center",
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

export default AddContentModal;
