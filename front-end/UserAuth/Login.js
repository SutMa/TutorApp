import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn, clearUserStorage, saveUserStorage, USER_TYPES } from '../controllers/auth/user';
import { AUTH_ROUTES } from '../Routes';
import Toast from 'react-native-toast-message';
import { showToast } from '../util';

const Login = () => {
  const navigation = useNavigation();

  // NOTE: setting account type
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  // NOTE: clearing local user storage
  useEffect(() => {
    clearUserStorage().then(() => {});
  }, []);

  const attemptLogin = async () => {
    if(!Boolean(emailText) || !Boolean(passwordText)) {
      showToast('error', 'Invalid Input', 'Email and password are required!');
      return;
    }
    
    const emailTextLower = emailText.toLowerCase();

    // NOTE: attempt login
    const result = await signIn(emailTextLower, passwordText);
    if(result) {
      // NOTE: setting local storage
      await saveUserStorage({
        email: emailTextLower,
        role: result,
      });

      if(result === USER_TYPES.ADMIN) {
        navigation.replace(AUTH_ROUTES.ROOT_ADMIN);
      } else {
        navigation.replace(AUTH_ROUTES.ROOT_USERS);
      }
    } else {
      showToast('error', 'Incorrect Input', 'Username or password was incorrect!');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', paddingLeft: 75}}>
        <Text style={styles.createAccount}>
          New user?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate(AUTH_ROUTES.CREATE_ACCOUNT)}>
            <Text style={styles.link}>Create an account</Text>
          </TouchableOpacity>
      </View>
      <TextInput
        style={styles.textInput}
        placeholder='Email'
        autoComplete='email'
        autoCorrect={false}
        keyboardType='email-address'
        backgroundColor='#fbfbfb'
        width={280}
        maxLength={40}
        onChangeText={text => setEmailText(text)}>
      </TextInput>
      <TextInput 
        style={styles.textInput}
        placeholder='Password'
        secureTextEntry={true}
        autoCorrect={false}
        keyboardType='default'
        backgroundColor='#fbfbfb'
        width={280}
        maxLength={40}
        onChangeText={text => setPasswordText(text)}>
      </TextInput>
      <Pressable style={styles.pressable} onPress={() => attemptLogin().then(() => {})}>
          <Text style={styles.Buttontext}>Submit</Text>
      </Pressable>
      <Toast topOffset={100} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 100,
    },
    radioButton: {
      margin: 5,
      marginLeft: 0,
      display: 'none',
    },
    radioButtonText: {
      width: 200,
      padding: 10,
      margin: 5,
      textAlign: 'center',
      borderWidth: 1,
      borderRadius: 15,
    },
    title: {
      fontSize: 34,
      fontWeight: 'normal', 
      marginBottom: 20,
      paddingRight:181,
    },
    createAccount: {
        fontSize: 15,
        color: '#777', 
    },
    link: {
      color: '#42A5F5',
      fontSize: 15,
    },
    textInput: {
      borderWidth: 1,
      width: 280,
      height: 60,
      padding: 10,
      margin: 5,
      borderRadius: 3,
      fontSize: 18,
    },
    pressable: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      width: 280,
      height: 60,
      padding: 10,
      margin: 5,
      fontSize: 18,
      borderRadius: 3,
      backgroundColor: 'gray',
    },
    Buttontext: {
      fontSize: 18,
      color: 'white',
    }
  });

export default Login;
