import './controllers/auth/initFirebase';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Pressable, View, TextInput, Text } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder='Email'
        autoComplete='email'
        autoCorrect={false}
        keyboardType='email-address'>
      </TextInput>
      <TextInput
        style={styles.textInput}
        placeholder='Password'
        secureTextEntry={true}
        autoCorrect={false}
        keyboardType='default'>
      </TextInput>
      <Pressable
        style={styles.pressable}>
          <Text style={styles.text}>Login</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    minWidth: 210,
    maxWidth: 210,
    minHeight: 60,
    maxHeight: 60,
    padding: 10,
    margin: 5,
    borderRadius: 10,
    fontSize: 18,
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minWidth: 210,
    maxWidth: 210,
    minHeight: 60,
    maxHeight: 60,
    padding: 10,
    margin: 20,
    fontSize: 18,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
  }
});
