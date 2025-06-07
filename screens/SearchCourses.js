import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchMinCourseDetail } from "../uitil/user";

export default function SearchCourses({ route }) {
    const [query, setQuery] = useState(route.params?.searchText || '');  // Pre-fill search text if available
    const [suggestions, setSuggestions] = useState([]); // For managing search suggestions
    const [loading, setLoading] = useState(false);
    const [visibleCourses, setVisibleCourses] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [previousSearch, setPreviousSearch] = useState('');  // To store previous search query

    // Extract coursesId from route params
    const { coursesId } = route.params || {};  // Default to empty if undefined

    useEffect(() => {
        const fetchData = async () => {
            if (coursesId) {
                setLoading(true);
                try {
                    const courses = await fetchMinCourseDetail(coursesId); // Fetch course data by coursesId
                    if (courses.length === 0) {
                        setNoResults(true);
                    } else {
                        const formattedCourses = courses.map(course => ({
                            ...course,
                            id: course.id || course.course_id || Math.random().toString(),
                        }));
                        setVisibleCourses(formattedCourses);
                        setNoResults(false);
                    }
                } catch (error) {
                    console.error('Error fetching courses:', error);
                    setNoResults(true);
                } finally {
                    setLoading(false);
                }
            } else {
                setVisibleCourses([]);
                setNoResults(true);
            }
        };

        fetchData();  // Call the fetchData function when coursesId or route params change
    }, [coursesId]);

    const handleSearch = (text) => {
        setQuery(text);
        if (text.trim() !== '') {
            setPreviousSearch(text);  // Save the current search query as the previous one
            // Here you could filter the courses data or fetch new data based on search query if needed
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search Courses"
                    value={query}
                    onChangeText={handleSearch}
                    autoCapitalize="none"
                />
            </View>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            {!loading && noResults && (
                <Text style={styles.noResultsText}>No results found</Text>
            )}

            <FlatList
                data={visibleCourses}
                keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.courseTitle}>{item.name}</Text>
                        <Text style={styles.courseDescription}>{item.description}</Text>
                        {/* Add other course details like price, duration, etc. */}
                    </View>
                )}
                style={styles.suggestionsList}
                ListEmptyComponent={!loading && !noResults ? null : <Text>No courses available.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    suggestionsList: {
        marginTop: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    courseDescription: {
        fontSize: 14,
        color: '#555',
    },
    noResultsText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
});
