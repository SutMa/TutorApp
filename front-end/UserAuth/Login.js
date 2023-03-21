import React, { useState } from 'react';
import { StyleSheet, Pressable, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../controllers/auth/user';

const Login = () => {
  const navigation = useNavigation();

  // NOTE: setting account type
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  const attemptLogin = async () => {
    console.log(`Attempting login as with { "email": "${emailText}", "password": "${passwordText}" }`);

    if(!emailText || !passwordText) {
      console.error('Login was unsuccessful. All fields are required. FIXME: notify user login was unseccessful');
      return;
    }

    // NOTE: attempt login
    const result = await signIn(emailText.toLowerCase(), passwordText);
    
    if(result) {
      console.error(`Login was successful as a ${result}. FIXME: route user to homepage`);
    } else {
      console.error('Login was unsuccessful. FIXME: notify user login was unseccessful');
    }
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