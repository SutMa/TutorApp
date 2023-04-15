import { Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, StyleSheet, View  } from 'react-native';
import { getUserStorage } from '../controllers/auth/user';
import { USER_TYPES } from '../controllers/auth/user';
import { SUBJECT, SubjectToIndex, updateSubject } from '../controllers/tutor/tutorController';
import { USER_PATH } from '../controllers/auth/user';
import { getDocById } from '../controllers/firebaseCrud';

import ScrollPicker from 'react-native-wheel-scrollview-picker';

export default function LoginButton() {
  const navigation = useNavigation();
  const [user, setUser] = useState('');
  
  const [currentSubjects, setCurrentSubjects] = useState(undefined);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(undefined);

  useEffect(() => {
    getUserStorage().then((userJSON) => {
      const innerUser = JSON.parse(userJSON) ;
      setUser(innerUser);

      if(innerUser.role === USER_TYPES.TUTOR) {
        const subjectArray = [];

        Object.keys(SUBJECT).forEach(key => {
          const subject = SUBJECT[key];

          subjectArray.push(subject)
        });
        
        setCurrentSubjects(subjectArray);
  
        getDocById(USER_PATH, innerUser.email).then((result) => {
          const subjectIndex = SubjectToIndex(result.subject);
          setCurrentSubjectIndex(subjectIndex);
        });
      }
    })
  }, []);

  const handleLoginNavigation = async () => {
    navigation.navigate('Login');
  };
 
  const handleSubjectUpdate = async () => {
    const sub = currentSubjects[currentSubjectIndex];

    updateSubject(user.email, sub)
      .then(() => console.log('successfully updated tutor subject!'))
      .catch(err => console.error(err));
  }

  if(user === undefined ||
    (user !== undefined && user.role === USER_TYPES.TUTOR && (currentSubjects === undefined || currentSubjectIndex === undefined))) {
    return (
      <Text>Loading</Text>
    );
  }

  let subjectPicker;
  let subjectButton;

  if(user.role === USER_TYPES.TUTOR) {
    subjectPicker = (
      <ScrollView>
          <ScrollPicker
            dataSource={currentSubjects}
            selectedIndex={currentSubjectIndex}
            wrapperHeight={180}
            wrapperWidth={300}
            wrapperColor='#FFFFFF'
            itemHeight={60}
            highlightColor='#d8d8d8'
            highlightBorderWidth={2}
            onValueChange={(data, selectedIndex) => {
              const newCurrentSubjects = [...currentSubjects];
              newCurrentSubjects[selectedIndex] = data;

              setCurrentSubjects(newCurrentSubjects);
              setCurrentSubjectIndex(selectedIndex);
            }}
          />
        </ScrollView>
    );

    subjectButton = (
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubjectUpdate}
      >
        <Text style={styles.buttonText}>Update Subject</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, { user.email }!</Text>
      
      <Image source={require('../assets/Nahida.jpg')} style={styles.image} />
      <Text style={styles.role}>Role: {user.role}</Text>
      {
        subjectPicker ?? <View></View>
      }
      {
        subjectButton ?? <View></View>
      } 
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
