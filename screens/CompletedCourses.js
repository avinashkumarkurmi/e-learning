import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, FONT_SIZES } from '../constants';
import { useSelector } from 'react-redux';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
import { fetchMinCourseDetail, generateCertificate, getCertificateFromDatabase, fetchName } from '../uitil/user';

const CompletedCourses = ({ route, navigation }) => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certificateGenerating, setCertificateGenerating] = useState({});
  const userToken = useSelector((state) => state.reducer.user.token);
  const userInfo = useSelector((state) => state.reducer.user.userInfo);

  useEffect(() => {
    const fetchCourseDetails = async () => {


 
        
      try {
        const completedEnrollments = route.params.completedCourses;
        
        const coursesId = completedEnrollments.map(enrollment => ({
          courseid: enrollment.courseid
        }));
        const courses = await fetchMinCourseDetail(coursesId);

 
        const updatedCourses = await Promise.all(courses.map(async(course) => 
          {const res = await getCertificateFromDatabase(course.courseid, userInfo.user.name.studentId)
          return {
            ...course,
            certificate: res?.certificate || [],
            certificatePresent: res?.certificatePresent || false
          }
          }
        ));
        
        setCompletedCourses(updatedCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [userInfo]);

//   const generateCertificateHTML = (course) => {
//     const today = new Date().toLocaleDateString();
//     const studentName = `${userInfo.name.first} ${userInfo.name.last}`;
    
//     return `
//       <html>
//         <head>
//           <style>
//             body {
//               font-family: 'Arial', sans-serif;
//               margin: 0;
//               padding: 40px;
//               display: flex;
//               flex-direction: column;
//               align-items: center;
//             }
//             .certificate {
//               width: 800px;
//               padding: 40px;
//               border: 2px solid #333;
//               text-align: center;
//             }
//             .header {
//               font-size: 36px;
//               color: #333;
//               margin-bottom: 30px;
//             }
//             .content {
//               font-size: 24px;
//               line-height: 1.6;
//               margin: 20px 0;
//             }
//             .signature {
//               margin-top: 50px;
//               border-top: 1px solid #333;
//               padding-top: 20px;
//               font-style: italic;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="certificate">
//             <div class="header">Certificate of Completion</div>
//             <div class="content">
//               This is to certify that
//               <br/>
//               <strong>${studentName}</strong>
//               <br/>
//               has successfully completed the course
//               <br/>
//               <strong>${course.title}</strong>
//               <br/>
//               on ${today}
//             </div>
//             <div class="signature">
//               Course Instructor
//               <br/>
//               ${course.instructorname}
//             </div>
//           </div>
//         </body>
//       </html>
//     `;
//   };

//   const generateCertificate = async (course) => {
//     try {
//       const html = generateCertificateHTML(course);
//       const { uri } = await Print.printToFileAsync({
//         html,
//         base64: false
//       });

//       await Sharing.shareAsync(uri, {
//         mimeType: 'application/pdf',
//         dialogTitle: 'Share Certificate',
//         UTI: 'com.adobe.pdf'
//       });

//     } catch (error) {
//       console.error('Error generating certificate:', error);
//       Alert.alert('Error', 'Failed to generate certificate');
//     }
//   };

    const handleCertificate = async (course) => {
        if(course.certificatePresent){
        try {
            const studentName = userInfo.user.name.first + " " + userInfo.user.name.last;
            const certificateId = course.certificateid;
            const instructorId = course.instructorid;
            const courseTitle = course.title;
            const date = new Date(course.certificatedate? course.certificatedate : course.certificate[0].certificatedate).toLocaleDateString();
            let instructorName;

            try {
              const instructorData = await fetchName(instructorId);
              instructorName = instructorData.first + " " + instructorData.last;
            } catch (error) {
                console.error('Error fetching instructor name:', error);
                instructorName = 'Course Instructor'; // Fallback value
            }

            const certificateHTML = `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                margin: 0;
                                padding: 40px;
                                background: linear-gradient(45deg, #f3f4f6, #ffffff);
                            }
                            .certificate {
                                width: 900px;
                                margin: 0 auto;
                                padding: 50px;
                                background-color: #ffffff;
                                border: 2px solid #c4a962;
                                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                                text-align: center;
                                position: relative;
                            }
                            .border-pattern {
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                border: 2px solid #c4a962;
                                margin: 10px;
                                pointer-events: none;
                            }
                            .header {
                                font-size: 42px;
                                color: #2c3e50;
                                margin-bottom: 40px;
                                font-family: 'Times New Roman', serif;
                                text-transform: uppercase;
                                letter-spacing: 4px;
                                border-bottom: 2px solid #c4a962;
                                padding-bottom: 10px;
                            }
                            .certificate-id {
                                font-size: 14px;
                                color: #666;
                                position: absolute;
                                top: 20px;
                                right: 20px;
                            }
                            .content {
                                font-size: 24px;
                                line-height: 1.8;
                                margin: 30px 0;
                                color: #34495e;
                            }
                            .student-name {
                                font-size: 32px;
                                color: #2c3e50;
                                font-weight: bold;
                                margin: 20px 0;
                                font-family: 'Times New Roman', serif;
                            }
                            .course-title {
                                font-size: 28px;
                                color: #c4a962;
                                font-style: italic;
                                margin: 15px 0;
                            }
                            .date {
                                font-size: 18px;
                                color: #666;
                                margin: 20px 0;
                            }
                            .signature-section {
                                margin-top: 60px;
                                display: flex;
                                justify-content: space-around;
                            }
                            .signature {
                                text-align: center;
                            }
                            .signature-text {
                                font-family: 'Dancing Script', cursive;
                                font-size: 24px;
                                color: #2c3e50;
                                margin-bottom: 10px;
                            }
                            .signature-line {
                                width: 200px;
                                border-top: 2px solid #333;
                                margin: 10px auto;
                            }
                            .signature-name {
                                font-size: 18px;
                                color: #2c3e50;
                                font-weight: bold;
                            }
                            .signature-title {
                                font-size: 14px;
                                color: #666;
                                font-style: italic;
                            }
                            .seal {
                                position: absolute;
                                bottom: 30px;
                                right: 40px;
                                width: 120px;
                                height: 120px;
                                background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzRhOTYyIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=') no-repeat center;
                                opacity: 0.5;
                            }
                        </style>
                        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
                    </head>
                    <body>
                        <div class="certificate">
                            <div class="border-pattern"></div>
                            <div class="certificate-id">Certificate ID: ${certificateId}</div>
                            <div class="header">Certificate of Completion</div>
                            <div class="content">
                                This is to certify that
                                <div class="student-name">${studentName}</div>
                                has successfully completed the course
                                <div class="course-title">${courseTitle}</div>
                                <div class="date">Completed on ${date}</div>
                            </div>
                            <div class="signature-section">
                                <div class="signature">
                                    <div class="signature-text">${instructorName}</div>
                                    <div class="signature-line"></div>
                                    <div class="signature-name">${instructorName}</div>
                                    <div class="signature-title">Course Instructor</div>
                                </div>
                                <div class="signature">
                                    <div class="signature-text">Dr. James Smith</div>
                                    <div class="signature-line"></div>
                                    <div class="signature-name">Dr. James Smith</div>
                                    <div class="signature-title">Director of Education</div>
                                </div>
                            </div>
                            <div class="seal"></div>
                        </div>
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({
                html: certificateHTML,
                base64: false
            });

            const filename = `certificate_${course.courseid}.pdf`;
            const downloadPath = FileSystem.documentDirectory + filename;

            await FileSystem.copyAsync({
                from: uri,
                to: downloadPath
            });

            await Sharing.shareAsync(downloadPath, {
                mimeType: 'application/pdf',
                dialogTitle: 'Save Certificate',
                UTI: 'com.adobe.pdf'
            });

            Alert.alert('Success', 'Certificate generated successfully. Please select a location to save.');

        } catch (error) {
            console.error('Error generating certificate:', error);
            Alert.alert(
                'Error',
                error.message || 'Failed to generate certificate. Please try again later.'
            );
        }

        }
        else{
        try {
            const courseId = course.courseid;
            const studentId = userInfo.user.name.studentId;
            
            setCertificateGenerating({courseId:courseId, generating:true});
            const certificate = await generateCertificate(courseId, studentId);
            setCertificateGenerating({courseId:courseId, generating:false});

            const updatedCourses = completedCourses.map(c => {
                if (c.courseid === course.courseid) {
                    return {
                        ...c,
                        certificatePresent: true,
                        certificateid: certificate.certificateId,
                        certificatedate: certificate.certificateDate
                    };
                }
                return c;
            });


            setCompletedCourses(updatedCourses);

    
        } catch (error) {
            console.error('Error generating certificate:', error);
        }}
    };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetails', { courseId: item.courseid })}
    >
      <Image
        source={{ uri: item.coursethumbnail }}
        style={styles.thumbnail}
        contentFit="cover"
      />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <TouchableOpacity 
          style={[
            styles.certificateButton,
            item.certificatePresent && {
              backgroundColor: COLORS.secondary,
              borderWidth: 1,
              borderColor: COLORS.primary
            }
          ]}
          onPress={() => handleCertificate(item)}
        >
          <Text style={[
            styles.buttonText,
            item.certificatePresent && {
              color: COLORS.primary,
              fontWeight: 'bold'
            }
          ]}>{item.certificatePresent ? "Download Certificates" : (  certificateGenerating.generating && certificateGenerating.courseId === item.courseid) ? <ActivityIndicator size="small" color={COLORS.border} /> : "Generate Certificate"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={completedCourses}
        renderItem={renderCourseItem}
        key={completedCourses.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15
  },
  header: {
    fontSize: FONT_SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20
  },
  listContainer: {
    paddingBottom: 20
  },
  courseCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  thumbnail: {
    width: '100%',
    height: 180
  },
  courseInfo: {
    padding: 15
  },
  courseTitle: {
    fontSize: FONT_SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8
  },
  completionDate: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 15
  },
  certificateButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZES.body,
    fontWeight: '600'
  }
});

export default CompletedCourses;
