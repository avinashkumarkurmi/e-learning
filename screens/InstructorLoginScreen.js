import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT_SIZES } from "../constants";
import { useDispatch } from 'react-redux';
import { instructorlogin, instructorSignup } from '../redux/slices/instructorSlice';

const InstructorLoginScreen = ({ navigation }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [message, setMessage] = useState('');
  const messageAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  };

  const displayMessage = (message) => {
    setMessage(message);
      Animated.timing(messageAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(messageAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setMessage(""));
      }, 4000);
  }
  

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function handleLogin() {
    setMessage(""); // Clear previous message
    const userData = { email, password };

    if(email === "" || password === ""){
      displayMessage("Please enter email and password");
      return;
    }
    if(!isValidEmail(email.trim())){
      displayMessage("Please enter a valid email");
      return;
    }
    const response = await dispatch(instructorlogin(userData));

    console.log(response,"response");
    
    if (response.error) { 
      displayMessage(response.payload?response.payload:"Invalid email or password. Please try again.");
    } else {
      setMessage(""); 
    }
  }
  
  async function handleSignup() {
    console.log(signupEmail, firstName, lastName, signupPassword);
    const instructorData = { signupEmail, signupPassword, firstName, lastName };
    // console.log(isValidEmail(signupEmail),"???"
    
    if (!signupEmail.trim() || !signupPassword.trim()) {
      displayMessage("Email and password are required.");
      return;
    }
  
    if (!isValidEmail(signupEmail)) {
      displayMessage("Please enter a valid email address.");
      return;
    }

    const response = await dispatch(instructorSignup(instructorData));
    if (response.error) {
      // console.log(response.payload,"response.payload");
      displayMessage(response.payload?response.payload:"Invalid email or password. Please try again.");
    } else {
      setMessage("");
    }
  }

  return (
    <View style={styles.container}>
      {message ? (
        <Animated.View style={[styles.messageContainer, { opacity: messageAnim }]}> 
          <Text style={styles.messageText}>{message}</Text>
        </Animated.View>
      ) : null}
      <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]} pointerEvents={isFlipped ? "none" : "auto"}>
        <Text style={styles.title}>Instructor Signup</Text>
        <Text style={[styles.link,{marginTop:0, marginBottom:10, fontWeight:'bold'}]}>as a instructor</Text>
        <TextInput placeholder="Email" style={styles.input} onChangeText={setSignupEmail} value={signupEmail} />
        <TextInput placeholder="First Name" style={styles.input} onChangeText={setFirstName} value={firstName} />
        <TextInput placeholder="Last Name" style={styles.input} onChangeText={setLastName} value={lastName} />
        <View style={styles.passwordContainer}>
          <TextInput placeholder="Password" style={styles.passwordInput} onChangeText={setSignupPassword} value={signupPassword} secureTextEntry={!showSignupPassword} />
          <TouchableOpacity onPress={() => setShowSignupPassword(!showSignupPassword)}>
            <Ionicons name={showSignupPassword ? "eye" : "eye-off"} size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={flipCard}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>I am a Student</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.card, styles.backCard, { transform: [{ rotateY: backInterpolate }] }]} pointerEvents={!isFlipped ? "none" : "auto"}>
        <Text style={styles.title}>Instructor Login</Text>
        <Text style={[styles.link,{marginTop:0, marginBottom:10, fontWeight:'bold'}]}>as a instructor</Text>
        <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} value={email} />
        <View style={styles.passwordContainer}>
          <TextInput placeholder="Password" style={styles.passwordInput} onChangeText={setPassword} value={password} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={flipCard}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>I am a Student</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  messageContainer: { 
    backgroundColor: "#ff4d4d", 
    padding: 10, 
    borderRadius: 8, 
    position: "absolute", 
    top: 20, 
    zIndex: 1,
  },
  messageText: { color: "white", fontSize: FONT_SIZES.medium, fontWeight: "bold" },
  card: {
    position: "absolute",
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
    backfaceVisibility: "hidden",
  },
  backCard: {
    position: "absolute",
  },
  title: { fontSize: FONT_SIZES.h3, fontWeight: "bold", color: COLORS.primary, },
  input: { width: "100%", padding: 12, borderRadius: 10, marginBottom: 10, backgroundColor: COLORS.secondary },
  passwordContainer: { flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: COLORS.secondary, borderRadius: 10, paddingHorizontal: 12, marginBottom: 10 },
  passwordInput: { flex: 1, paddingVertical: 12 },
  button: { backgroundColor: COLORS.primary, width: "100%", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: FONT_SIZES.medium, fontWeight: "bold" },
  link: { color: COLORS.primary, fontSize: FONT_SIZES.small, marginTop: 15 },
  errorMessage: { color: COLORS.error, fontSize: FONT_SIZES.small, marginBottom: 10, textAlign: "center" },
});

export default InstructorLoginScreen;