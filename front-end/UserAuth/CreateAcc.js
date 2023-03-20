import React, { useState } from 'react';
import { StyleSheet, Pressable, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signUp, USER_TYPES, validateEmail, validatePassword } from '../controllers/auth/user';
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

  const attemptSignUp = async () => {
    console.log(`Attempting signup as "${userTypeText}" with { "email": "${emailText}", "password": "${passwordText}" }`);

    if(!emailText || !passwordText || !userTypeText) {
      console.error('SignUp was unsuccessful. All fields are required. FIXME: notify user signup was unseccessful');
      return;
    }

    if(!validateEmail(emailText)) {
      console.error("Signup was unsuccessful. invalid email: FIXME: notify user email was invalid");
      return;
    }

    if(!validatePassword(passwordText)) {
      console.error("Signup was unsuccessful. invalid password: FIXME: notify user email was invalid");
      return;
    }


    try {
      await signUp(emailText, passwordText, userTypeText);
      console.error('Signup was successful. FIXME: route user to home screen');
    }catch(err) {
      console.error(err);
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
      <Text style={styles.title}>Create Account</Text>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', paddingLeft: 57}}>
        <Text style={styles.createAccount}>
          Already a user?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login into an account</Text>
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
      <Pressable style={styles.pressable} onPress={attemptSignUp}>
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
      fontSize: 30,
      fontWeight: 'normal', 
      marginBottom: 20,
      paddingRight: 75,
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