import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES } from '../constants';
import CourseCard from '../components/userDefine/CourseCard';

import { getInstructorDetails } from '../uitil/user';

export default function InstructorProfile({ route, navigation }) {
    const { instructorId } = route.params;
    const [instructor, setInstructor] = useState(null);

    
    useEffect(() => {
        loadInstructorDetails();
    }, []);

    const loadInstructorDetails = async () => {
        try {
            const data = await getInstructorDetails(instructorId);
            
            setInstructor(data);
        } catch (error) {
            console.error('Error loading instructor details:', error);
        }
    };

    if (!instructor) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image 
                    source={{ uri: instructor.profilePictureUrl }} 
                    style={styles.profileImage} 
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.name}>{instructor.firstName}{instructor.middleName?instructor.middleName:' '}{instructor.lastName?instructor.lastName:' '}</Text>
                    <Text style={styles.qualification}>{instructor.qualification}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{instructor.qualificationStatus}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.section, styles.aboutSection]}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.aboutText}>{instructor.aboutMe}</Text>
            </View>

            <View style={[styles.section, styles.coursesSection]}>
                <Text style={styles.sectionTitle}>Courses</Text>

                {instructor.courses.map((course) => (
                    <CourseCard key={course.courseId} item={course} navigation={navigation} fullScreen={true}  />
                ))}
                    
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 1,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginRight: 20,
        // borderWidth: 3,
        // borderColor: COLORS.primary,
    },
    headerInfo: {
        flex: 1,
    },
    name: {
        fontSize: FONT_SIZES.h3,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 8,
    },
    qualification: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textLight,
        marginBottom: 12,
    },
    badge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 25,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.caption,
        fontWeight: '600',
    },
    section: {
        padding: 20,
        paddingVertical: 10,
    },
    aboutSection: {
        marginTop: 10,
        paddingVertical: 0,
    },
    coursesSection: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    aboutText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
        lineHeight: 24,
        textAlign: 'justify',
    },
    courseCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    cardShadow: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    courseThumbnail: {
        width: '100%',
        height: 200,
    },
    courseInfo: {
        padding: 20,
    },
    courseTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 10,
    },
    courseDescription: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textLight,
        marginBottom: 16,
        lineHeight: 22,
    },
    courseMetaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 10,
    },
    durationBadge: {
        backgroundColor: COLORS.primary + '15',
    },
    ratingBadge: {
        backgroundColor: '#FFD700' + '20',
    },
    metaValue: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.text,
        fontWeight: '500',
    },
    ratingText: {
        color: '#FFD700',
    },
    coursePrice: {
        marginLeft: 'auto',
        fontSize: FONT_SIZES.h3,
        fontWeight: '700',
        color: COLORS.primary,
    }
});
