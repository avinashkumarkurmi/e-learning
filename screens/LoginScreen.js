import React, { useState, useEffect } from 'react'; 
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/userSlice';
import { COLORS, FONTS, FONT_SIZES } from "../constants";
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const dispatch = useDispatch();


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  function loginHandler() {
    const userData = { email, password };

    if(email === "" || password === ""){
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    if(!isValidEmail(email.trim())){
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    dispatch(login(userData));
  }

  return (
    <LinearGradient colors={[COLORS.secondary, COLORS.background]} style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}> 
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput 
          placeholder="Email" 
          placeholderTextColor={COLORS.text}
          style={styles.input} 
          value={email} 
          onChangeText={setEmail}
        />
        
        <View style={styles.passwordContainer}>
          <TextInput 
            onChangeText={setPassword}
            value={password}
            placeholder="Password" 
            placeholderTextColor={COLORS.text}
            style={styles.inputPassword} 
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={loginHandler}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZES.h3,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  inputPassword: { 
    flex: 1, 
    padding: 12, 
    fontSize: FONT_SIZES.medium, 
    color: COLORS.text
  },
  button: {
    backgroundColor: COLORS.primary,
    width: '100%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: FONT_SIZES.medium,
    fontFamily: FONTS.bold,
  },
  link: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.small,
    fontFamily: FONTS.medium,
    marginTop: 15,
  },
});

export default LoginScreen;