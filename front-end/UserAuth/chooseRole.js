import React from 'react';
import { StyleSheet, Pressable, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const ChooseRole = () => {
    const navigation = useNavigation();
  
    const handleButtonPress1 = () => {
        console.log("Student");
    };
      
  
    const handleButtonPress2 = () => {
        console.log("Tutor");
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.promptText}>User Account Type</Text>
        <Pressable style={[styles.button, {backgroundColor: '#3F3F3F80'}]} onPress={handleButtonPress1}>
        <Text style={[styles.buttonText, {flex: 1, flexWrap: 'wrap'}]}>Student</Text>
        </Pressable>
        <Pressable style={[styles.button, {backgroundColor: '#3F3F3F80'}]} onPress={handleButtonPress2}>
        <Text style={[styles.buttonText, {flex: 1, flexWrap: 'wrap'}]}>Tutor</Text>
        </Pressable>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    promptText: {
      fontSize: 35,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
        width: 150,
        height: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
        justifyContent: 'center',
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center',
      },
  });

export default ChooseRole;