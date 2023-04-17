import { 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  View,
  Button
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getUserStorage, USER_DEFAULT_PROFILE_PIC_URI, USER_DEFAULT_PROFILE_PIC_REF_URI } from '../controllers/auth/user';
import { USER_TYPES, updateProfilePic } from '../controllers/auth/user';
import { SUBJECT, SubjectToIndex, updateSubject } from '../controllers/tutor/tutorController';
import { USER_PATH} from '../controllers/auth/user';
import { getDocById, updateDocById } from '../controllers/firebaseCrud';
import * as ImagePicker from 'expo-image-picker';
import ScrollPicker from 'react-native-wheel-scrollview-picker';

export default function LoginButton() {
  const navigation = useNavigation();
  const [user, setUser] = useState('');
  const [userDoc, setUserDoc] = useState(undefined);
  
  const [currentSubjects, setCurrentSubjects] = useState(undefined);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(undefined);

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const updateImage = async () => {
    if(image === USER_DEFAULT_PROFILE_PIC_URI || image === userDoc.profilePicUrl) {
      console.error('please select a new image!');
    } else {
      const origUrl = userDoc.profilePicUrl;
      const origImageUri = userDoc.profilePicStorageUri;

      const newUserDoc = { ...userDoc };

      try {
        const newRef = await updateProfilePic(origImageUri, image);

        newUserDoc.profilePicUrl = newRef.newUrl;
        newUserDoc.profilePicStorageUri = newRef.newStorageUri; 

        await updateDocById(USER_PATH, user.email, newUserDoc);

        console.log('updated profile picture successfully');
      } catch (err) {
        console.error(err)

        newUserDoc.profilePicUrl = origUrl;
        newUserDoc.profilePicStorageUri = origImageUri;
      }

      setUserDoc(newUserDoc);
    }
  }

  useEffect(() => {
    getUserStorage().then((userJSON) => {
      const innerUser = JSON.parse(userJSON) ;
      setUser(innerUser);

      getDocById(USER_PATH, innerUser.email).then((userDocument) => {
        setUserDoc(userDocument);

        if(innerUser.role === USER_TYPES.TUTOR) {
          const subjectArray = [];

          Object.keys(SUBJECT).forEach(key => {
            const subject = SUBJECT[key];

            subjectArray.push(subject)
          });
          setCurrentSubjects(subjectArray);
    
          const subjectIndex = SubjectToIndex(userDocument.subject);
          setCurrentSubjectIndex(subjectIndex);
        }

        if(userDocument.profilePicUrl === null) {
          setImage(USER_DEFAULT_PROFILE_PIC_URI);
        }  else {
          setImage(userDocument.profilePicUrl);
        }
      });
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

  if(image === null ||
     userDoc === undefined ||
     user === undefined ||
    (user !== undefined && user.role === USER_TYPES.TUTOR && (currentSubjects === undefined || currentSubjectIndex === undefined))) {
    return (
      <Text>Loading</Text>
    );
  }

  let subjectPicker;
  let subjectButton;

  if(user.role === USER_TYPES.TUTOR) {
    subjectPicker = (
      <ScrollView style={styles.scrollview}>
        <ScrollPicker
          dataSource={currentSubjects}
          selectedIndex={currentSubjectIndex}
          wrapperHeight={180}
          wrapperWidth={300}
          wrapperBackground={'#FFFFFF'}
          itemHeight={60}
          highlightColor={'#8DB6CD'}
          highlightBorderWidth={2}
          highlightBorderColor={'#1A1423'}
          renderItem={(data, index, isSelected) => {
            return (
              <View style={[styles.item, isSelected && styles.selectedItem]}>
                <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                  {data}
                </Text>
              </View>
            );
          }}
          onValueChange={(data, selectedIndex) => {
            const newCurrentSubjects = [...currentSubjects];
            newCurrentSubjects[selectedIndex] = data;
    
            setCurrentSubjects(newCurrentSubjects);
            setCurrentSubjectIndex(selectedIndex);
          }}
        />
        <View style={styles.scrollviewContentContainer} /> 
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
    <View style={[styles.container, { paddingBottom: 80 }]}>
      <Text style={styles.welcome}>Welcome, { user.email }!</Text>
      <View style={styles.imageContainer}>
        <Button title='Pick a profile picture' onPress={pickImage} />
        <Image source={{ uri:image }} style={{ width: 200, height: 200 }} />
        <Button title='Update profile picture' onPress={updateImage} />
      </View>
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
    color: '#736B92', // welcome color English violet
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

  scrollview: {
    flexGrow: 0, // 
  },
  scrollviewContentContainer: {
    height: 60, // the same as itemHeight 
  },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 100,
    paddingHorizontal: 10,
  },
  itemText: {
    color: '#000000',
    fontSize: 18,
  },
  selectedItem: {
    backgroundColor: '#8DB6CD', // set the background color for subject
  },
  selectedItemText: {
    color: '#FFFFFF', // the color of highlight subject
    fontWeight: 'bold', // bold the highlight subject
  },
  
  
});
