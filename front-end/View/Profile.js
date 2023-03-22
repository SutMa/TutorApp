import { Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../controllers/auth/user';
import { TouchableOpacity, StyleSheet, View  } from 'react-native';


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
      width: '50%', // the width is 50%
    },
    buttonText: {
      fontSize: 18,
      color: '#000',
      textAlign: 'center', // make the button align center
    },
  });
  
  export default function LoginButton() {
    const navigation = useNavigation();
  
    const handleLoginNavigation = () => {
      navigation.navigate('Login');
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLoginNavigation}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }