import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, Image, FlatList} from "react-native";
import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromCart, enrollInCourse} from "../redux/slices/userSlice";
import { fetchMinCourseDetail,  } from "../uitil/user";
import { COLORS, FONTS, FONT_SIZES } from "../constants"
import { Ionicons } from '@expo/vector-icons';

export default function Cart({ navigation }) {
    const userState = useSelector((state) => state.reducer.user);

    const [cartData, setCartData] = useState([]);
    const dispatch = useDispatch();
  
    const fetchCartData = async (cart) => {
      if (!Array.isArray(cart)) {
        return [];
      }
  
      const cartIds = cart.map(item => ({
        courseid: item.courseid,
        title: ''
      }));
  
      const cartData = await fetchMinCourseDetail(cartIds);
      setCartData(cartData);
    };
  
    useFocusEffect(
      useCallback(() => {

        fetchCartData(userState.userInfo.user.cart);
      }, [userState.userInfo.user.cart])
    );

    const handleRemoveItemFromCart = async (item) => {
        await dispatch(removeItemFromCart({ studentId: userState.userInfo.user.name.studentId, courseId: item.courseid }));
        
    }

    const handleBuy = async (item) =>{
        const userLogin = userState.isLogin
        const courseId = item.courseid

       
        if (userLogin) {
          // navigation.navigate('PaymentScreen', { amount: course.course.price || 900, courseId,studentId })
            await dispatch(enrollInCourse({ studentId: userState.userInfo.user.name.studentId, courseId }))
            handleRemoveItemFromCart(item)
          } else {
            alert("Please log in to enroll in a course.");
          }

    }
  
    return (
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 15, paddingTop: 10 }}>
          {/* <View style={{
            marginBottom: 20,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <View>
              <Text style={{
                marginBottom: 5,
                color: COLORS.primary,
                fontSize: FONT_SIZES.h1,
                fontFamily: FONTS.primary,
                fontWeight: "bold",
              }}>
                Cart
              </Text>
              <Text style={{
                color: COLORS.text,
                fontSize: FONT_SIZES.body,
                fontFamily: FONTS.secondary,
              }}>
                Courses in your cart
              </Text>
            </View>
          </View> */}
  
          <FlatList
            data={cartData}
            keyExtractor={(item) => item.courseid.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
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
                  borderWidth: 1,
                  borderColor: COLORS.border
                }}
              >
                <Image
                  source={{ uri: item.coursethumbnail }}
                  style={{ width: 60, height: 60, borderRadius: 5 }}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{ fontSize: FONT_SIZES.h3, fontWeight: "bold", color: COLORS.text }}>{item.title}</Text>
                  
                  <TouchableOpacity onPress={()=>{handleRemoveItemFromCart(item)}}>
                  <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                  </View>
                  <Text style={{ fontSize: FONT_SIZES.body, color: COLORS.text, marginTop: 5 }}>
                    {item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description}
                  </Text>
                  <Text style={{ fontSize: FONT_SIZES.caption, color: COLORS.text, marginTop: 5 }}>
                    {item.duration} hrs
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: FONT_SIZES.body, fontWeight: "bold", color: COLORS.primary }}>
                      ₹{item.price}
                    </Text>
                    <TouchableOpacity onPress={()=>{handleBuy(item)}}>
                        <View style={{ flex: 1,
                                    backgroundColor: COLORS.primary,
                                    padding: 5,
                                    height: 32,
                                    borderRadius: 5,
                                    alignItems: "center",
                                    width: 75,}}>
                            <Text style={{color: COLORS.background,
                                            fontWeight: "bold",
                                            fontSize: FONT_SIZES.button ,}}>
                                Buy Now
                            </Text>
                        </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    );
  }
  
  const style = StyleSheet.create({});
  
