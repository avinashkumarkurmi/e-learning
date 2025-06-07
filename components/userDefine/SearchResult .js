import React from "react";
import { FlatList, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';


export default function SearchResult({ visibleCourses, noResults, navigation }){
  if (noResults) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>No Results Found</Text>
        <Text style={{ fontSize: 12, color: "#B0B0B0", textAlign: "center", marginTop: 5 }}>
          Try a different search.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={visibleCourses}
      keyExtractor={(item) => item.courseid.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("CourseDetails", { courseId: item.courseid })}
          style={{
            flexDirection: "row",
            marginBottom: 15,
            backgroundColor: "#1E1E1E",
            borderRadius: 10,
            padding: 10,
            overflow: "hidden",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: item.coursethumbnail }}
            style={{ width: 60, height: 60, borderRadius: 5 }}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>{item.title}</Text>
            <Text style={{ fontSize: 14, color: "gray", marginTop: 5 }}>
              {item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description}
            </Text>
            <Text style={{ fontSize: 12, color: "white", marginTop: 5 }}>
              <Ionicons name="time-outline" size={14} color="gray" /> {item.duration} hours
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "green", marginTop: 5 }}>
              ${item.price}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

// export default SearchResult;
