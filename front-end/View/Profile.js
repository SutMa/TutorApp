import { Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { clearUserStorage } from '../controllers/auth/user';
import { TouchableOpacity, StyleSheet, View  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


//get user name function

// const [username, setUsername] = useState('');

// const getUsername = async () => {
//   const storedUsername = await AsyncStorage.getItem('username');
//   if (storedUsername) {
//     setUsername(storedUsername);
//   }
// };

// useEffect(() => {
//   getUsername();
// }, []);

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
  text: {
    fontSize: 24,
    fontWeight: 'bold', // make the text bold
    color: 'red', // set the text color to red
    marginBottom: 20, // add margin to the bottom
  },
});



export default function LoginButton() {
    const navigation = useNavigation();

    const handleLoginNavigation = async () => {
      await clearUserStorage(); 
      navigation.navigate('Login');
    };

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome, username!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLoginNavigation}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );

  }
