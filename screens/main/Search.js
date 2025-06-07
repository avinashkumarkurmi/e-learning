import { useFocusEffect } from "@react-navigation/native";
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
import { COLORS, FONTS, FONT_SIZES  } from "../../constants";

import { Ionicons } from '@expo/vector-icons';
import { saveDataToStorage, getDataFromStorage, removeDataFromStorage } from "../../uitil/storageHelper";
import { searchTheRelatedCourse, clearAllStorage, fetchMinCourseDetail } from "@/uitil/user";
import { debounce } from "lodash";

const SEARCH_HISTORY_KEY = "searchHistory";
const MAX_HISTORY_ITEMS = 15;

export default function Search({ navigation }) {
  const [searchText, setSearchText] = useState("");  // Keeps track of the input text
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCourses, setVisibleCourses] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResult, setShowSeacrchResult] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "flex",height: 63, // Ensures enough space
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        elevation: 10,
        paddingBottom: 10, } });
      return () => parent?.setOptions({ tabBarStyle: { display: "none" } });
    }, [navigation])
  );

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getDataFromStorage(SEARCH_HISTORY_KEY);
      setHistory(data?.slice(0, MAX_HISTORY_ITEMS) || []);
    };
    loadHistory();
  }, []);

  const handleSearch = async (searchQuery = searchText) => {
    if (!searchQuery.trim()) return;

    const trimmedQuery = searchQuery.trim();
    let updatedHistory = history.filter((item) => item !== trimmedQuery);
    updatedHistory = [trimmedQuery, ...updatedHistory.slice(0, MAX_HISTORY_ITEMS - 1)];

    setSearchText(trimmedQuery);

    await saveDataToStorage(SEARCH_HISTORY_KEY, trimmedQuery);
    setHistory(updatedHistory);
    
    getSearchItems(suggestions);
};


const removeSearchItem = async (itemToRemove) => {
  await removeDataFromStorage(SEARCH_HISTORY_KEY, itemToRemove);
  
  // Immediately update the local state
  const data = await getDataFromStorage(SEARCH_HISTORY_KEY);
 
      setHistory(data?.slice(0, MAX_HISTORY_ITEMS) || []);
  // const updatedHistory = history.filter((item) => item !== itemToRemove);
  // setHistory(updatedHistory);

  // Fetch latest history from AsyncStorage
  const storedHistory = await getDataFromStorage(SEARCH_HISTORY_KEY);
  setHistory(storedHistory.slice(0, MAX_HISTORY_ITEMS) || []);

  console.log(itemToRemove, "removed");
  console.log(storedHistory, "updated history from storage");
};


  const getSearchItems = async (coursesId) => {
    setLoading(true);
    try {
      const courses = await fetchMinCourseDetail(coursesId); // Fetch course data by coursesId
      if (courses.length === 0) {
        setShowSeacrchResult(true);
        setNoResults(true);
      } else {
      
        console.log(searchText,"courses");
        
        const formattedCourses = courses
          .map(course => ({
            ...course,
            id: course.id || course.course_id || Math.random().toString(),
            matchScore: course.title.toLowerCase() === searchText.toLowerCase() ? 1 : 0,
          }))
          .sort((a, b) => b.matchScore - a.matchScore);
          console.log(formattedCourses,"formattedCourses");
        setVisibleCourses(formattedCourses);
        setNoResults(false);
        setShowSeacrchResult(true);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setNoResults(true);
      
      setShowSeacrchResult(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchTheRelatedCourse(query);
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleBackPress = () => {
    Keyboard.dismiss(); // Close the keyboard
    setSearchText(""); // Clear the input field
    setShowSeacrchResult(false); // Show the search history again
    setNoResults(false); // Reset the no results state
  };

  const handleTextChange = (text) => {
    setSearchText(text);
    fetchSuggestions(text);

    // If no results were found earlier, we show the suggestions screen again
    if (noResults) {
      setShowSeacrchResult(false); // Reset "No Results" state
    }
  };

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: COLORS.background }}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      
      <View
        style={{
          flexDirection: "row",
          alignItems: "center", 
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 10,
          paddingHorizontal: 10,
          height: 52,
          backgroundColor: COLORS.secondary,
          marginBottom: 3,
        }}
      >
        {searchText.length > 0 ? (
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} style={{ marginRight: 8 }} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="search" size={22} color={COLORS.text} style={{ marginRight: 8 }} />
        )}

        <TextInput
          placeholder="Search..."
          placeholderTextColor={COLORS.text}
          value={searchText}
          onChangeText={handleTextChange}
          style={{ flex: 1, fontSize: FONT_SIZES.body, color: COLORS.text }}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(searchText)}
        />

        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {showSearchResult ? (
        !noResults ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={visibleCourses.sort((a, b) => b.matchScore - a.matchScore)} // Sort by matchScore
            keyExtractor={(item) => item.courseid.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("CourseDetails", { courseId: item.courseid });
                }}
                style={{
                  flexDirection: "row",
                  marginBottom: 15,
                  backgroundColor: COLORS.secondary,
                  borderRadius: 10,
                  padding: 10,
                  overflow: "hidden",
                  alignItems: "center",
                  borderWidth: item.matchScore > 1 ? 1 : 0,
                  borderColor: item.matchScore > 1 ? COLORS.primary : 'transparent'
                }}
              >
                <Image
                  source={{ uri: item.coursethumbnail }}
                  style={{ width: 60, height: 60, borderRadius: 5 }}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ fontSize: FONT_SIZES.h3, fontWeight: "bold", color: COLORS.text }}>{item.title}</Text>
                  <Text style={{ fontSize: FONT_SIZES.body, color: COLORS.text, marginTop: 5 }}>
                    {item.description.length > 50
                      ? item.description.substring(0, 50) + "..."
                      : item.description}
                  </Text>
                  <Text style={{ fontSize: FONT_SIZES.caption, color: COLORS.text, marginTop: 5 }}>
                   {item.duration} hrs
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between'}}>
                    <Text style={{ fontSize: FONT_SIZES.body, fontWeight: "bold", color: COLORS.primary }}>
                      ₹{item.price}
                    </Text>
                    {item.matchScore > 1 && (
                      <Text style={{ fontSize: FONT_SIZES.caption, color: COLORS.primary }}>
                        Best Match
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
            <Text style={{ fontSize: FONT_SIZES.h3, fontWeight: "bold", color: COLORS.text }}>No Results Found</Text>
            <Text style={{ fontSize: FONT_SIZES.caption, color: COLORS.text, textAlign: "center", marginTop: 5 }}>
              Try a different search.
            </Text>
          </View>
        )
      ) : loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : searchText.length > 1 && suggestions.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={suggestions}
          keyExtractor={(item) => item.courseid.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {handleSearch(item.title);} }>
              <Text style={{ fontSize: FONT_SIZES.body, color: COLORS.text, padding: 10, borderBottomColor: COLORS.border, borderBottomWidth: 1 }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={history}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                marginTop: 4,
                marginBottom: 4,
                backgroundColor: "transparent",
                borderRadius: 10,
                alignItems: "center",
                backgroundColor: COLORS.shadow,
              }}
            >
              <TouchableOpacity onPress={() => handleSearch(item)}>
                <Text style={{ fontSize: FONT_SIZES.body, color: COLORS.text }}>{item}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeSearchItem(item)}
                style={{
                  position: "absolute",
                  right: 0,
                  paddingHorizontal: 5,
                }}
              >
                <Ionicons name="close-circle" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
