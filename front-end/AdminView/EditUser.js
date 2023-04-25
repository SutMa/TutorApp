import { useState } from 'react';
import { Pressable, TextInput, View, StyleSheet, Text, ScrollView, Button, Alert } from 'react-native';
import Toast from 'react-native-toast-message'; 
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button';
import { showToast } from '../util';
import { USER_TYPES, USER_PATH, signUp, validateEmail, validatePassword } from '../controllers/auth/user';
import {docExists, getDocById, deleteDocById, getAllDoc} from '../controllers/firebaseCrud';
import {SCHEDULE_COLLECTION, DAYS, HOUR_STATUS, setTimeSchedule, initTutor} from '../controllers/tutor/tutorController';
import { useNavigation } from '@react-navigation/native';

export default function EditUser() {
  const navigation = useNavigation();

  const [userTypeText, setUserTypeText] = useState('');

  const [studentColor, setStudentColor] = useState('black');
  const [tutorColor, setTutorColor] = useState('black');

  const [studentBgColor, setStudentBgColor] = useState('white');
  const [tutorBgColor, setTutorBgColor] = useState('white');

  const [removeUserEmailText, setRemoveUserEmailText] = useState(undefined);
  const [createUserEmailText, setCreateUserEmailText] = useState(undefined);
  const [createUserPasswordText, setCreateUserPasswordText] = useState(undefined);

  const setUserSelectButtonColor = (text) => {
    (text === USER_TYPES.STUDENT) ? setStudentColor('white') : setStudentColor('black');
    (text === USER_TYPES.TUTOR) ? setTutorColor('white') : setTutorColor('black');

    (text === USER_TYPES.STUDENT) ? setStudentBgColor('gray') : setStudentBgColor('white');
    (text === USER_TYPES.TUTOR) ? setTutorBgColor('gray') : setTutorBgColor('white');
   };

  const removeUser = async () => {
    Alert.alert('Remove User', `Are you sure you want to remove ${removeUserEmailText}?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Confirm',
        onPress: async () => {
          await handleRemoveUser();
        },
      },
    ]);
  }

  const createUser = async () => {
    Alert.alert('Remove User', `Are you sure you want to create ${createUserEmailText}?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Confirm',
        onPress: async () => {
          await handleCreateUser();
        },
      },
    ]);
  }

  const handleCreateUser = async () => {
    console.log('1');

    if(!Boolean(createUserEmailText)) { 
      showToast('error', 'Invalid Input', 'User email address is required!');
      return;
    }

    console.log('1');
    if(!Boolean(createUserPasswordText)) {
      showToast('error', 'Invalid Input', 'User password is required!');
      return;
    }

    if(!Boolean(userTypeText)) {
      showToast('error', 'Invalid Input', 'User type is required!');
      return;
    }

    if(!validateEmail(createUserEmailText)) {
      showToast('error', 'Invalid Input', 'Email must be a valid @lsu.edu email!');
      return;
    }

    if(!validatePassword(createUserPasswordText)) {
      showToast('error', 'Invalid Input', 'Password must be at least 8 characters long!');
      return;
    }

    console.log('here');

    try {
      const caseInsensitiveEmail = createUserEmailText.toLowerCase();

      await signUp(caseInsensitiveEmail, createUserPasswordText, userTypeText);

      // NOTE: initializing schedule
      if(userTypeText == USER_TYPES.TUTOR) {
        await initTutor(caseInsensitiveEmail);
      }
      
      showToast('success', 'User Created', 'The user was created succesfully!');
    }catch(err) {
      showToast('error', 'Invalid Email', 'Account with email already exists!');
    }
  }

  const handleRemoveUser = async () => {
    if(!Boolean(removeUserEmailText)) {
      showToast('error', 'Invalid Input', 'User email address is required!');
      return;
    }

    if(!(await docExists(USER_PATH, removeUserEmailText))) {
      showToast('error', 'Incorrect Input', 'User does not exist!');
      return;
    }
    
    const userDocument = await getDocById(USER_PATH, removeUserEmailText);

    if(userDocument.role === USER_TYPES.ADMIN) {
      showToast('error', 'Incorrect Input', 'You cannot remove the admin account!');
    } else if(userDocument.role === USER_TYPES.TUTOR) {
      await deleteDocById(SCHEDULE_COLLECTION, removeUserEmailText);
      await deleteDocById(USER_PATH, removeUserEmailText);
    } else if(userDocument.role === USER_TYPES.STUDENT) {
      const schedules = await getAllDoc(SCHEDULE_COLLECTION);
      
      schedules.forEach(async (scheduleDoc) => {
        const { id, ...schedule } = scheduleDoc;

        Object.keys(DAYS).forEach(async (key) => {
          const day = DAYS[key];
          let currentHourIndex = 0;
          
          schedule[day].forEach((hourStatus) => {
            console.log(hourStatus);

            if(hourStatus === removeUserEmailText) {
              schedule[day][currentHourIndex] = HOUR_STATUS.NOT_AVAILABLE; 
            }

            currentHourIndex++;
          });

          await setTimeSchedule(id, schedule);
        })
      });

      await deleteDocById(USER_PATH, removeUserEmailText);

      showToast('success', 'User Removed', 'The user was remove successfully!');
    } else {
      console.error('User role does not exists!');
    }
  }

  const handleLoginNavigation = async () => {
    navigation.navigate('Login');
  };

 return(
    <>
      <View style={styles.container}>
      <ScrollView>
        <View style={styles.titleContainer}><Text style={styles.Title}>Remove A User</Text></View>
        <View>
          <Text style={styles.label}>User Email</Text>
          <TextInput
            style={styles.input}
            placeholder='User Email Address'
            keyboardType='email-address'
            backgroundColor='#fbfbfb'
            maxLength={40}
            onChangeText={text => setRemoveUserEmailText(text)}>
          </TextInput >
          <Button title='Remove User' onPress={removeUser} />
        </View>
        <View style={styles.titleContainer}><Text style={styles.Title}>Create A User</Text></View>
          <Text style={styles.label}>User Email</Text>
          <TextInput
            style={styles.input}
            placeholder='User Email Address'
            keyboardType='email-address'
            backgroundColor='#fbfbfb'
            maxLength={40}
            onChangeText={text => setCreateUserEmailText(text)}>
          </TextInput >
          <Text style={styles.label}>User Password</Text>
          <TextInput
            style={styles.input}
            placeholder='Password'
            secureTextEntry={true}
            autoCorrect={false}
            keyboardType='default'
            backgroundColor='#fbfbfb'
            width={280}
            maxLength={40}
            onChangeText={text => setCreateUserPasswordText(text)}>
          </TextInput >
          <View style={{ borderWidth: 1, margin: 5, alignItems: 'center', justifyContent: 'center' }}>
            <RadioButtonGroup
              containerStyle={{ margin: 10 }}
              selected={userTypeText}
              onSelected={(text) => {
                setUserTypeText(text);
                setUserSelectButtonColor(text);
              }}
              radioBackground="grey"
            >
              <RadioButtonItem style={styles.radioButton} value={USER_TYPES.STUDENT} label={
                <Text style={{...styles.radioButtonText, color: studentColor, backgroundColor: studentBgColor }}>
                  Student
                </Text>
              } />
              <RadioButtonItem style={styles.radioButton} value={USER_TYPES.TUTOR} label={
                <Text style={{...styles.radioButtonText, color: tutorColor, backgroundColor: tutorBgColor }}>
                  Tutor
                </Text>
              } />
            </RadioButtonGroup>
          </View>
          <Button title='Create User' onPress={createUser} />
          <Pressable style={styles.pressable} onPress={handleLoginNavigation}>
              <Text style={styles.Buttontext}>Logout</Text>
          </Pressable>
          </ScrollView>
      </View>
    <Toast />
    </>
 );
}


const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 15,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom:10,
  },
  Title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 40,
    marginRight: 40,
    textAlign: 'center',
    paddingTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start'
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 5
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
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 15,
  },
});
