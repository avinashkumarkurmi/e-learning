// SectionModal.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Modal, Button, TouchableOpacity, FlatList, ScrollView } from "react-native";

const SectionModal = ({ visible, onClose, onUpload, sectionData }) => {
  const [videos, setVideos] = useState(sectionData?.videos || []);
  const [resources, setResources] = useState(sectionData?.resources || []);

  const addVideo = () => {
    setVideos([...videos, { id: Date.now(), title: `Video ${videos.length + 1}` }]);
  };

  const addResource = () => {
    setResources([...resources, { id: Date.now(), title: `Resource ${resources.length + 1}` }]);
  };

  const handleUpload = () => {
    onUpload({ id: sectionData?.id || Date.now(), videos, resources });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Button title="Cancel" onPress={onClose} color="red" />
              <Text style={styles.modalTitle}>Edit Section</Text>
              <Button title="Upload" onPress={handleUpload} />
            </View>

            <FlatList
              data={videos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.videoContainer}>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                </View>
              )}
            />
            <Button title="Add Video" onPress={addVideo} />
            
            <FlatList
              data={resources}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.videoContainer}>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                </View>
              )}
            />
            <Button title="Add Resource" onPress={addResource} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "70%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  videoContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SectionModal;
