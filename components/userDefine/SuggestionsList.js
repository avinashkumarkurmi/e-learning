import React from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";

const SuggestionsList = ({ suggestions, onSearch }) => (
  <FlatList
    data={suggestions}
    keyExtractor={(item) => item.courseid.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => onSearch(item.title)}>
        <Text
          style={{
            fontSize: 16,
            color: "white",
            padding: 10,
            borderBottomColor: "#333",
            borderBottomWidth: 1,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )}
  />
);

export default SuggestionsList;
