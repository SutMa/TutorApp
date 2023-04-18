import React from 'react';
import { StyleSheet, Pressable, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { USER_TYPES } from '../controllers/auth/user';

const ChooseRole = () => {
  const navigation = useNavigation();
  
  const navToLogin = (userType) => {
    navigation.navigate('Login', { userType: userType });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.promptText}>User Account Type</Text>
      <Pressable style={styles.button} onPress={() => navToLogin(USER_TYPES.STUDENT)}>
      <Text style={styles.buttonText}>Student</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navToLogin(USER_TYPES.TUTOR)}>
      <Text style={styles.buttonText}>Tutor</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navToLogin(USER_TYPES.ADMIN)}>
      <Text style={styles.buttonText}>Admin</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  promptText: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
      width: 150,
      height: 50,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginVertical: 10,
      justifyContent: 'center',
      backgroundColor: '#3F3F3F80'
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 20,
      textAlign: 'center',
      flex: 1, 
      flexWrap: 'wrap',
    },
});

export default ChooseRole;
