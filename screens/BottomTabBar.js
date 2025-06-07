import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTabBar({navigation}) {
  // const navigation = useNavigation();


  
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Featured')}
      >
        <Ionicons name="star-outline" size={30} color="black" />
        <Text>Featured</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Ionicons name="search-outline" size={30} color="black" />
        <Text>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('MyLearning')}
      >
        <Ionicons name="book-outline" size={30} color="black" />
        <Text>My Learning</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Wishlist')}
      >
        <Ionicons name="heart-outline" size={30} color="black" />
        <Text>Wishlist</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Account')}
      >
        <Ionicons name="person-outline" size={30} color="black" />
        <Text>Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
