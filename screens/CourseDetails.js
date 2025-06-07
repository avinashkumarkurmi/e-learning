import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet, Image, Linking } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchCourseDetail, searchTheRelatedCourse, buyNow, fetchStudentEnrollment, markVideoAsWatchedToDb } from "../uitil/user";
import { Ionicons } from "@expo/vector-icons";
import util from "util";
import { useSelector, useDispatch } from "react-redux";
import { enrollInCourse, setEnrolledCourses, addItemToWishlist,removeItemFromWishlist,removeItemFromCart, addItemToCart } from "../redux/slices/userSlice";
import { COLORS, FONTS, FONT_SIZES } from "../constants";
import RazorpayCheckout from 'react-native-razorpay';


// import { COLORS, FONTS, FONT_SIZES } from '../constants';
import Feather from 'react-native-vector-icons/Feather';
export default function CourseDetails({ route }) {
    const { courseId  } = route.params;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});
    const [isBuyNowVisible, setIsBuyNowVisible] = useState(true);
    const buyNowButtonRef = useRef(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isCarted, setIsCarted] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const navigation = useNavigation();


    // console.log(course.course.sections.videos);
    

    function isCourseEnrolled(courseId, userState) {
        // Check if the enrollments array is available

        // console.log(userState.userInfo.user.enrollments,"hh");
        
        if (!userState || !userState.userInfo || !userState.userInfo.user || !userState.userInfo.user.enrollments) {
          return false;
        }
      
        // Check if the courseId exists in the enrollments list
        return userState.userInfo.user.enrollments.some(enrollment => enrollment.courseid === courseId);
      }


    // const enrollInCourseAsync = async (studentId,courseId,paymentId)=>{
    //     const res = await dispatch(enrollInCourse({ studentId: studentId, courseId,paymentId }))
    //     setTimeout(() => {
    //         setIsPurchased(isCourseEnrolled(courseId, userState));
    //     }, 30);
    //     console.log(res,"res");
    // }

    // useEffect(()=>{
    //     const paymentData = route.params?.paymentData ?? null;
    //     if(paymentData.status == "paid"){
    //         enrollInCourseAsync(userState.userInfo.user.name.studentId,courseId,paymentData.paymentId)
    //         // setIsPurchased(true);
    //     }
    // },[])

    const userState = useSelector((state) => state.reducer.user);
    const dispatch = useDispatch();

    const handlePayment = () => {
        
        const options = {
          key: 'rzp_test_AZAWAAkophPsmD', // ✅ Replace with your Razorpay Test Key
          name: 'Flavor Faves',
          description: 'Order Payment',
          currency: 'INR',
          amount: 100 * 100, // Amount in paise (₹100)
          prefill: {
            email: 'customer@example.com',
            contact: '9876543210',
          },
          theme: { color: '#F37254' },
        };
      console.log(options,"options");
      
        RazorpayCheckout.open(options)
          .then((data) => {
            // Payment success
            Alert.alert('Payment Successful', `Payment ID: ${data.razorpay_payment_id}`);
          })
          .catch((error) => {
            // Payment failed
            Alert.alert('Payment Failed', `Error: ${error.description}`);
          });
      };
      
      

    async function buyNowHandler() {
        
        const studentId =  userState.userInfo.user.name.studentId;
        const userLogin = userState.isLogin;

        if (userLogin) {
            console.log("userLogin");
            
            // handlePayment();

            navigation.navigate('PaymentScreen', { amount: course.course.price || 900, courseId,studentId })
            // console.log(userState.userInfo.user.enrollments,"old");
            // const res = await dispatch(enrollInCourse({ studentId: studentId, courseId }))
            // console.log(userState.userInfo.user.enrollments,"new");
          } else {
            alert("Please log in to enroll in a course.");
          }
    }

    

      const handleAccessResources = () => {
          
          if (!isPurchased) {
          setShowMessage(true);
          // Automatically hide the message after 5 seconds
        //   console.log(showMessage,"pp");
          
          setTimeout(() => {
            setShowMessage(false);
          }, 5000);
        }
      };

    // const handleWishlist = async () => {
        
    //     if (!userState.isLogin) {
    //         navigation.navigate('Login');
    //         return;
    //     }
    //     await dispatch(addItemToWishlist({ studentId: userState.userInfo.user.name.studentId, courseId: courseId }));
    // };

    

    useEffect(() => {
        async function fetchCourseDetailAsync() {
            try {
                const courseData = await fetchCourseDetail(courseId);
                // searchTheRelatedCourse("devlopment")
                console.log("Raw Course Data:....",util.inspect(userState.userInfo.user, { depth: null, colors: true }));
                console.log("Raw .",util.inspect(courseData, { depth: null, colors: true }));

                setCourse(courseData);

                userState.userInfo.user.cart.map((c)=>{
                    if(c.courseid == courseId){
                        setIsCarted(true)
                    }
                })

                userState.userInfo.user.wishlist.map((w)=>{
                    if(w.courseid == courseId){
                        setIsWishlisted(true)
                    }
                })
                
                // console.log(courseData,"courseData");
                
            } catch (error) {
                console.error("Error fetching course details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourseDetailAsync();
        // console.log(userState.userInfo.enrollments);
        
        setTimeout(() => {
            setIsPurchased(isCourseEnrolled(courseId, userState));
        }, 30);
        // console.log(isPurchased);
        
          
    }, [courseId,userState.userInfo.user.enrollments]);


    const toggleWishlist = async () => {
        setIsWishlisted((prev) => !prev);
        if (!userState.isLogin) {
            navigation.navigate('Login');
            return;
        }

        if (isWishlisted) {
            console.log("removeItemFromWishlist");
            // navigation.navigate("WishListMain")
            await dispatch(removeItemFromWishlist({ studentId: userState.userInfo.user.name.studentId, courseId: courseId }));
        } else {
            console.log("addItemToWishlist");
            
            await dispatch(addItemToWishlist({ studentId: userState.userInfo.user.name.studentId, courseId: courseId }));
        }

    };

    const shortenResourceUrl = (url) => {
        const parts = url.split("/");  // Split the URL by "/"
        return parts.length > 1 ? parts.slice(-1)[0] : url; // Get the last part
    };
    

    const toggleAddToCart = async () => {
        // setIsCarted((prev) => !prev);
        if (!userState.isLogin) {
            navigation.navigate('Login');
            return;
        }

        if (isCarted) {
            // console.log("removeItemFromCart");

            navigation.navigate("Cart")
            
            // await dispatch(removeItemFromCart({ studentId: userState.userInfo.user.name.studentId, courseId: courseId }));
        } else {
            console.log("addItemToCart");
            
            await dispatch(addItemToCart({ studentId: userState.userInfo.user.name.studentId, courseId: courseId }));
        }

    };

    const markVideoAsWatched = async (videoId) => {

        // console.log(">>>>");
        // userState.userInfo.user.name.studentId
        // courseId
        if (videoId == null) {
            console.error("videoId is null");
            return;
        }
        
        try{
            await markVideoAsWatchedToDb(videoId, courseId, userState.userInfo.user.name.studentId);
        }catch(error){
            console.log(error);
        }
        
        // try {
        //     await fetch('https://your-api.com/update-progress', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             studentid: userId,
        //             courseid: courseId,
        //             video_id: videoId
        //         }),
        //     });
        // } catch (error) {
        //     console.error('Error updating progress:', error);
        // }
    };
    


    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={toggleWishlist} style={{ marginRight: 15 }}>
                    <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={24} color={COLORS.text} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, isWishlisted]);

    const toggleSection = (sectionId) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const handleScroll = (event) => {
        if (buyNowButtonRef.current) {
            buyNowButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
                setIsBuyNowVisible(pageY > 0);
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    if (!course) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={styles.errorText}>Course not found</Text>
            </View>
        );
    }

    return (
        <>
                {showMessage && (
                <View style={styles.messageBox}>
                <Text style={styles.messageText}>
                    To access the resources for this course, you need to purchase it first
                </Text>
                </View>
                )}
            <ScrollView style={styles.container} onScroll={handleScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    style={styles.thumbnailContainer}
                    onPress={() => navigation.navigate("FullScreenVideo", { videoUrl: course.course.introductionVideoUrl, autoFullscreen: true })}
                >
                    <Image source={{ uri: course.course.courseThumbnail }} style={styles.thumbnail} />
                    <Ionicons name="play-circle" size={64} color="white" style={styles.playIcon} />
                </TouchableOpacity>

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{course.course.title}</Text>
                    <Text style={styles.instructor}>By {course.instructor.firstName} {course.instructor.lastName}</Text>
                    <Text style={styles.description}>{course.course.description}</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.price}>₹{course.course.price}</Text>
                    <Text style={styles.detailText}>Duration: {course.course.duration} minutes</Text>
                    <Text style={styles.detailText}>Review: {course.course.review}</Text>
                </View>

                <View style={styles.curriculumContainer}>
                    <Text style={styles.curriculumTitle}>Curriculum</Text>
                    {course.course.sections.map((section) => (
    <View key={section.sectionId} style={styles.sectionContainer}>
        <TouchableOpacity onPress={() => toggleSection(section.sectionId)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
            <Ionicons
                name={expandedSections[section.sectionId] ? "chevron-up" : "chevron-down"}
                size={20}
                color={COLORS.text}
            />
        </TouchableOpacity>
        
        {expandedSections[section.sectionId] &&
            section.videos.map((video) => (
                isPurchased ? (
                    <TouchableOpacity 
                        key={video.videoId} 
                        style={[styles.videoItem, { flexDirection: 'column' }]} 
                        // onPress={() => navigation.navigate("FullScreenVideo", { 
                        //     videoUrl: video.videoUrl, 
                        //     autoFullscreen: true 
                        // })}
                    >
                        <View style={{flexDirection:"row"}}>
                        <Feather name="play-circle" size={20} color={COLORS.primary} />
                        <TouchableOpacity onPress={async() => {await markVideoAsWatched(video.videoId);navigation.navigate("FullScreenVideo", { 
                            videoUrl: video.videoUrl, 
                            autoFullscreen: true 
                        }); }}>
                        <Text style={styles.videoTitle}>
                            {video.videoUrl.slice(video.videoUrl.lastIndexOf("/") + 1)}
                        </Text>
                        </TouchableOpacity>
                        </View>

                        {/* Resources */}
                        {video.resources.length > 0 && (
                            <View style={styles.videoContainer}>
                                {video.resources.map(resource => (
                                    // <View style={{flexDirection:"column"}} >
                                    <TouchableOpacity 
                                        key={resource.resourceId}
                                        style={styles.resourceButton} 
                                        onPress={() => Linking.openURL(resource.resourceUri)}
                                    >
                                        <Feather name="file-text" size={18} color={COLORS.primary} />
                                        <Text style={styles.resourceText}>
                                            {resource.resourceUri.slice(resource.resourceUri.lastIndexOf("/") + 1)}
                                        </Text>
                                    </TouchableOpacity>
                                    // </View>
                                ))}
                            </View>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        key={video.videoId} 
                        style={styles.videoItem} 
                        onPress={handleAccessResources}
                    >
                        <Feather name="play-circle" size={20} color={COLORS.primary} />
                        <Text style={styles.videoTitle}>{video.videoTitle}</Text>
                    </TouchableOpacity>
                )
            ))
        }
    </View>
))}

                </View>

                            <View style={styles.actionButtons} ref={buyNowButtonRef}>
                <View style={styles.topButtonsContainer}>
                    {!isPurchased && (
                        <TouchableOpacity style={styles.addToCartButton} onPress={toggleAddToCart}>
                            <Text style={styles.buttonText}>{isCarted ? 
                                    <TouchableOpacity>
                                    <Text style={styles.buttonText} >Go to cart</Text>
                                </TouchableOpacity>
                             : '+ Cart'}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.wishlistButton} onPress={toggleWishlist}> 
                        <Text style={styles.buttonText}>{isWishlisted ? "- WishList": '+ Wishlist'}</Text>
                    </TouchableOpacity>
                </View>
                {!isPurchased && (
                    <TouchableOpacity style={styles.buyButton} onPress={buyNowHandler}>
                        <Text style={styles.buttonText}>Buy Now</Text>
                    </TouchableOpacity>
                )}
            </View>


                {/* Instructor Information */}
                <Text style={styles.instructorTitle}>
                    Instructor Information
                </Text>
                <View style={styles.instructorInfo}>
                    <Image source={{ uri: course.instructor.profilePictureUrl }} style={styles.instructorImage} />
                    <View style={styles.instructorDetails}>
                        <Text style={styles.instructorName}>{course.instructor.firstName} {course.instructor.lastName}</Text>
                        <Text style={styles.instructorQualification}>{course.instructor.qualification}</Text>
                        <Text style={styles.instructorAbout}>{course.instructor.aboutMe}</Text>
                        <TouchableOpacity style={styles.viewProfileButton} onPress={() => navigation.navigate("InstructorProfile", { instructorId: course.instructor.instructorId })}>
                            <Text style={styles.viewProfileButtonText}>View Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
    },
    messageBox: {
        backgroundColor: COLORS.warning,
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
    messageText: {
        color: COLORS.secondary,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: FONT_SIZES.body,
    },
    thumbnailContainer: {
        alignItems: "center",
        position: "relative",
        marginVertical: 20,
    },
    thumbnail: {
        width: "100%",
        height: 200,
        borderRadius: 10,
    },
    playIcon: {
        position: "absolute",
        top: "40%",
        left: "45%",
    },
    infoContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: FONT_SIZES.h2,
        fontWeight: "bold",
        color: COLORS.text,
    },
    instructor: {
        fontSize: FONT_SIZES.h3 - 3,
        color: COLORS.text,
        // marginTop: 2,
    },
    description: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
        marginTop: 10,
    },
    detailsContainer: {
        paddingVertical: 10,
    },
    price: {
        fontSize: FONT_SIZES.h2,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    detailText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
    },
    curriculumContainer: {
        marginVertical: 10,
    },
    curriculumTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: "bold",
        color: COLORS.text,
    },
    // sectionContainer: {
    //     marginVertical: 1,
    // },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.secondary,
        padding: 10,
        borderRadius: 8,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: FONT_SIZES.body,
        fontWeight: "bold",
    },
    videoContainer: {
        // flexDirection: "row",
        // alignItems: "center",
        padding: 3,
        flexDirection:'column',
        backgroundColor: COLORS.secondary,
        borderRadius: 5,
        marginVertical: 5,
    },
    videoThumbnail: {
        width: 60,
        height: 40,
        borderRadius: 5,
        marginRight: 10,
    },
    videoTitle: {
        fontSize: FONT_SIZES.body,
        // fontWeight: "bold",
        color: COLORS.text,
    },
    resourceContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    resourceItem: {
        paddingVertical: 5,
    },
    resourceText: {
        color: "blue",
        textDecorationLine: "underline",
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: "column",
        marginVertical: 20,
    },
    topButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: COLORS.accent,
        padding: 12,
        borderRadius: 5,
        marginRight: 5,
        alignItems: "center",
    },
    wishlistButton: {
        flex: 1,
        backgroundColor: COLORS.border,
        padding: 12,
        borderRadius: 5,
        marginLeft: 5,
        alignItems: "center",
    },
    buyButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: COLORS.background,
        fontWeight: "bold",
        fontSize: FONT_SIZES.button + 2,
    },

    instructorTitle:{
            fontSize: FONT_SIZES.h3,
            fontWeight: "bold",
            color: COLORS.text,
        },
    instructorInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        marginTop:0

    },
    instructorImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 30,
    },
    instructorDetails: {
        flex: 1,
    },
    instructorName: {
        fontSize: FONT_SIZES.h3 -2,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    instructorQualification: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.text,
    },
    instructorAbout: {
        marginTop: 10,
        textAlign: "left",
        fontSize: FONT_SIZES.body,
        color: COLORS.text,
    },
    viewProfileButton: {
        marginTop: 3,
        
    },


    viewProfileButtonText: {
        color: COLORS.primary,
        textDecorationLine: "underline",
        fontWeight: "bold",
        fontSize: FONT_SIZES.text,
    },


    sectionContainer: {
        backgroundColor: COLORS.secondary,
        // paddingVertical: 5,
        // paddingHorizontal:,
        borderRadius: 10,
        marginBottom: 12,
      },
      sectionTitle: {
        fontSize: FONT_SIZES.h3 -4,
        fontFamily: FONTS.bold,
        color: COLORS.primary,
        fontWeight: "bold",
        marginBottom: 8,
      },
      videoItem: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 6,
        backgroundColor: COLORS.background,
        padding: 8,
        borderRadius: 10,
      },
      videoTitle: {
        fontSize: FONT_SIZES.medium,
        fontFamily: FONTS.regular,
        color: COLORS.text,
        marginLeft: 8,
      },
      resourceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 10,
        borderRadius: 10,
        marginVertical: 3
        // marginTop: 8,
      },
      resourceText: {
        fontSize: FONT_SIZES.small,
        fontFamily: FONTS.regular,
        color: COLORS.primary,
        marginLeft: 5,
      },
});