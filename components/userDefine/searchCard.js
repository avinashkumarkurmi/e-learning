import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  Image
} from "react-native";
import { COLORS, FONTS, FONT_SIZES } from "../../constants";

export default function SearchCard({suggestions, handleSearch}){
    return (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={suggestions}
          keyExtractor={(item) => item.courseid.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleSearch(item.title)}
              style={{
                backgroundColor: COLORS.secondary,
                marginVertical: 4,
                borderRadius: 8,
                padding: 12,
                elevation: 2
              }}
            >
              <Text style={{ 
                fontSize: FONT_SIZES.body,
                color: COLORS.text,
                fontWeight: '500'
              }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 8
          }}
        />
    );
}