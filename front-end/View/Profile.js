import { Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, StyleSheet, View  } from 'react-native';
import { getUserStorage } from '../controllers/auth/user';
import { USER_TYPES } from '../controllers/auth/user';
import EditAppointment from '../AdminView/EditAppointment'; 

export default function LoginButton() {
  const navigation = useNavigation();
  const [user, setUser] = useState('');

  useEffect(() => {
    getUserStorage().then((userJSON) => {
      setUser(JSON.parse(userJSON));
    })
  }, []);

  const handleLoginNavigation = async () => {
    navigation.navigate('Login');
  };

  if(user === undefined) {
    return (
      <Text>Loading</Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, { user.email }!</Text>
      
      <Image source={require('../assets/Nahida.jpg')} style={styles.image} />
      <Text style={styles.role}>Role: {user.role}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLoginNavigation}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

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
