import React from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const HistoryList = ({ history, onSearch, onRemoveItem }) => (
  <FlatList
    data={history}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          marginBottom: 10,
          backgroundColor: "transparent",
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => onSearch(item)}>
          <Text style={{ fontSize: 16, color: "white" }}>{item}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onRemoveItem(item)}
          style={{
            position: "absolute",
            right: 10,
            padding: 5,
          }}
        >
          <Ionicons name="close-circle" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    )}
  />
);

export default HistoryList;
