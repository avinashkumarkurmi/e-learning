import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';


export default function SearchBar({ searchText, onSearchTextChange, onBackPress, onSubmit, onCartPress }){
  return (<View
    style={{
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#444",
      borderRadius: 10,
      paddingHorizontal: 10,
      height: 45,
      backgroundColor: "#1E1E1E",
      marginTop: 15,
    }}
  >
    {searchText.length > 0 ? (
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="arrow-back" size={22} color="gray" style={{ marginRight: 8 }} />
      </TouchableOpacity>
    ) : (
      <Ionicons name="search" size={22} color="gray" style={{ marginRight: 8 }} />
    )}

    <TextInput
      placeholder="Search..."
      placeholderTextColor="gray"
      value={searchText}
      onChangeText={onSearchTextChange}
      style={{ flex: 1, fontSize: 16, color: "white" }}
      returnKeyType="search"
      onSubmitEditing={onSubmit}
    />

    <TouchableOpacity onPress={onCartPress}>
      <Ionicons name="cart-outline" size={24} color="white" />
    </TouchableOpacity>
  </View>);
}

// export default SearchBar;
