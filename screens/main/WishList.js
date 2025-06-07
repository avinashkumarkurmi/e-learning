import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, Image} from "react-native";
import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { fetchMinCourseDetail } from "../../uitil/user";
import { FlatList } from "react-native";
import { COLORS, FONTS, FONT_SIZES } from "../../constants";

export default function WishList({navigation}) {

          // for making tha tab visible

          const userState = useSelector((state) => state.reducer.user);
          // const [wishlistTableData, setWishlistTableData] = useState([]);
          const [wishlistData, setWishlistData] = useState([]);
          

          const fetchWishlistData = async (wishlist) => {
            if (!Array.isArray(wishlist)) {
              return [];
            }

            const wishlistIds = wishlist.map(item => ({
              courseid: item.courseid,
              title: ''
            }));

            


            const wishlistData = await fetchMinCourseDetail(wishlistIds);
            setWishlistData(wishlistData);

          }

          

    useFocusEffect(
        useCallback(() => {
          const parent = navigation.getParent();
          // setWishlistTableData(userState.userInfo.user.wishlist);
          fetchWishlistData(userState.userInfo.user.wishlist);
          parent?.setOptions({ tabBarStyle: { display: "flex" , height: 63, // Ensures enough space
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            backgroundColor: 'white',
            elevation: 10,
            paddingBottom: 10,} });
          return () => parent?.setOptions({ tabBarStyle: { display: "none" } });
        }, [navigation, userState.userInfo.user.wishlist])
      );

    return (
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 15, paddingTop: 10 }}>
          <View style={{
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
                Wishlist
              </Text>
              <Text style={{
                color: COLORS.text,
                fontSize: FONT_SIZES.body,
                fontFamily: FONTS.secondary,
              }}>
                Courses you're interested in
              </Text>
            </View>
          </View>

          {wishlistData.length > 0 ? (
            <FlatList
            data={wishlistData}
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
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          ) : (
            <Text style={{fontSize:FONT_SIZES.h3-3,flex:1,justifyContent:"center",alignItems:"center",fontWeight:"bold",color:COLORS.primary,textAlign:"center",marginTop:20}}>No courses in wishlist</Text>
          )}
        </View>
      </ScrollView>
    );
}

const style = StyleSheet.create({


});