import React from 'react';
import { StyleSheet, Pressable, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.createAccount}>
        New user?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('CreateAcc')}>
          <Text style={styles.link}>Create an account</Text>
        </TouchableOpacity></Text>
        <TextInput
        style={styles.textInput}
        placeholder='Email'
        autoComplete='email'
        autoCorrect={false}
        keyboardType='email-address'
        backgroundColor='#fbfbfb'
        width={280}
        maxLength={40}>
      </TextInput>
      <TextInput
        style={styles.textInput}
        placeholder='Password'
        secureTextEntry={true}
        autoCorrect={false}
        keyboardType='default'
        backgroundColor='#fbfbfb'
        width={280}
        maxLength={40}>
      </TextInput>
      <Pressable
        style={styles.pressable}>
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
    },
    title: {
      fontSize: 34,
      fontWeight: 'normal', 
      marginBottom: 20,
      paddingRight:181,
    },
    createAccount: {
        flexDirection: 'row',
        alignItems: 'flex-start', 
        fontSize: 15,
        lineHeight: 25,
        marginBottom: 5,
        color: '#777', 
        paddingRight:74,
      },
    link: {
      color: '#42A5F5',
      fontSize: 15,
      lineHeight: 31,
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