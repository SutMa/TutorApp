import { Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { clearUserStorage } from '../controllers/auth/user';
import { getUserStorage } from '../controllers/auth/user';
import { TouchableOpacity, StyleSheet, View  } from 'react-native';



// const getAllKeys = async () => {
//   try {
//     const keys = await AsyncStorage.getAllKeys();
//     console.log(keys);
//   } catch (error) {
//     console.log(error);
//   }
// };



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#d3d3d3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: '50%',
    marginTop: 20, // add margin to the top
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold', // make the text bold
    color: 'red', // set the text color to red
    marginBottom: 20, // add margin to the bottom
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain', // adjust the image size and aspect ratio
    marginVertical: 10, // add margin to the top and bottom
  },
  role: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default function LoginButton() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  const getUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('user');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      console.log('Error getting username:', error);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  const start = username.indexOf(":") + 2; // get the first word after ':' 
  const end = username.indexOf(","); // until the ','

  const usernameM = username.substring(start, end-1); // get the word between them 



  const role = username;

  const handleLoginNavigation = async () => {
    await clearUserStorage().then((res) => console.log(res)).catch((err) => console.error(err));
    navigation.navigate('Login');
  };

  const Rolestart = role.indexOf(",") + 8; // get the first character after '"role": "'
  const Roleend = role.lastIndexOf('}'); // until the last '"'
  const role2 = role.substring(Rolestart, Roleend); // get the substring between them 
  



  return (
    //getAllKeys(),
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {usernameM}!</Text>
      
      <Image source={require('../assets/Nahida.jpg')} style={styles.image} />
      <Text style={styles.role}>Role: {role2}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLoginNavigation}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
