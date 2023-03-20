import React, { useState } from 'react';
import { StyleSheet, Pressable, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn, USER_TYPES } from '../controllers/auth/user';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

const Login = () => {
  const navigation = useNavigation();

  // NOTE: setting account type
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [userTypeText, setUserTypeText] = useState('');

  const [studentColor, setStudentColor] = useState('black');
  const [tutorColor, setTutorColor] = useState('black');
  const [adminColor, setAdminColor] = useState('black');

  const [studentBgColor, setStudentBgColor] = useState('white');
  const [tutorBgColor, setTutorBgColor] = useState('white');
  const [adminBgColor, setAdminBgColor] = useState('white');

  const attemptLogin = async () => {
    console.log(`Attempting login as "${userTypeText}" with { "email": "${emailText}", "password": "${passwordText}" }`);

    if(!emailText || !passwordText || !userTypeText) {
      console.error('Login was unsuccessful. All fields are required. FIXME: notify user login was unseccessful');
      return;
    }

    // NOTE: attempt login
    const result = await signIn(emailText, passwordText, userTypeText);
    
    if(result) {
      console.error('Login was successful. FIXME: route user to homepage');
    } else {
      console.error('Login was unsuccessful. FIXME: notify user login was unseccessful');
    }
  };

  const setUserSelectButtonColor = (text) => {
    (text === USER_TYPES.STUDENT) ? setStudentColor('white') : setStudentColor('black');
    (text === USER_TYPES.TUTOR) ? setTutorColor('white') : setTutorColor('black');
    (text === USER_TYPES.ADMIN) ? setAdminColor('white') : setAdminColor('black');

    (text === USER_TYPES.STUDENT) ? setStudentBgColor('gray') : setStudentBgColor('white');
    (text === USER_TYPES.TUTOR) ? setTutorBgColor('gray') : setTutorBgColor('white');
    (text === USER_TYPES.ADMIN) ? setAdminBgColor('gray') : setAdminBgColor('white');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', paddingLeft: 57}}>
        <Text style={styles.createAccount}>
          New user?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAcc')}>
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
      <View style={{ borderWidth: 1, margin: 5 }}>
        <RadioButtonGroup
          containerStyle={{ margin: 10 }}
          selected={userTypeText}
          onSelected={(text) => {
            setUserTypeText(text);
            setUserSelectButtonColor(text);
          }}
          radioBackground="grey"
        >
          <RadioButtonItem style={styles.radioButton} value={USER_TYPES.STUDENT} label={
            <Text style={{...styles.radioButtonText, color: studentColor, backgroundColor: studentBgColor }}>
              Student
            </Text>
          } />
          <RadioButtonItem style={styles.radioButton} value={USER_TYPES.TUTOR} label={
            <Text style={{...styles.radioButtonText, color: tutorColor, backgroundColor: tutorBgColor }}>
              Tutor
            </Text>
          } />
          <RadioButtonItem style={styles.radioButton} value={USER_TYPES.ADMIN} label={
            <Text style={{...styles.radioButtonText, color: adminColor, backgroundColor: adminBgColor }}>
              Admin
            </Text>
          } />
        </RadioButtonGroup>
      </View>
      <Pressable style={styles.pressable} onPress={() => attemptLogin().then(() => {})}>
          <Text style={styles.Buttontext}>Submit</Text>
      </Pressable>
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