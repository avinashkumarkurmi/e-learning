import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InstructorSignupScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Instructor Signup</Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 }}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          style={{ flex: 1, paddingVertical: 10 }}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setIsAuthenticated(true)}
        style={{ backgroundColor: 'blue', padding: 15, borderRadius: 5, marginTop: 20 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('InstructorLogin')} style={{ marginTop: 15 }}>
        <Text style={{ textAlign: 'center', color: 'blue' }}>Go to Instructor Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InstructorSignupScreen;
