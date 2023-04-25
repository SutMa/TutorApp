import { useState } from "react";
import { View, Text, ScrollView, Button, TextInput, StyleSheet } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { docExists, getDocById } from "../controllers/firebaseCrud";
import { USER_PATH, USER_TYPES } from "../controllers/auth/user";
import { getTimeScheduleById, DAYS, HOUR_STATUS, setTimeSchedule} from "../controllers/tutor/tutorController";
import Toast from "react-native-toast-message";
import { showToast } from "../util"; 
import { sendEmail } from "../controllers/email/emailController";

export default function AddAppointment() {
  const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'];
  const days = [DAYS.MONDAY, DAYS.TUESDAY, DAYS.WEDNESDAY, DAYS.THURSDAY, DAYS.FRIDAY];
 
  const [currentDay, setCurrentDay] = useState(DAYS.MONDAY);
  const [stateDays, setStateDays] = useState(days);
  const [stateHours, setStateHours] = useState(hours);
  const [tutorEmail, setTutorEmail] = useState(undefined);
  const [studentEmail, setStudentEmail] = useState(undefined);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const createAppointment = async () => {
    if(tutorEmail === undefined || studentEmail === undefined) {
      showToast('error', 'Invalid Input', 'Tutor and student email are required!');
      return;
    }
    
    if(await docExists(USER_PATH, tutorEmail) && await docExists(USER_PATH, studentEmail)) {
      const tutorUser = await getDocById(USER_PATH, tutorEmail);
      const studentUser = await getDocById(USER_PATH, studentEmail);
      
      if(tutorUser.role !== USER_TYPES.TUTOR) {
        showToast('error', 'Incorrect Input', 'Tutor email did not belong to a tutor!');
      } else if(studentUser.role !== USER_TYPES.STUDENT) {
        showToast('error', 'Incorrect Input', 'Student email did not belong to a student!');
      } else {
        const schedule = await getTimeScheduleById(tutorEmail);

        const status = schedule[currentDay][currentTimeIndex];

        if(status === HOUR_STATUS.AVAILABLE) {
          schedule[currentDay][currentTimeIndex] = studentEmail;
          await setTimeSchedule(tutorEmail, schedule);

          showToast('success', 'Appointment Created', 'The apointment was created successfully!');

          sendEmail(tutorEmail, 'Appointment Creation', `An appointment was created with ${studentEmail} on ${currentDay} at ${stateHours[currentTimeIndex]} by the system admin!`)
            .then(() => {})
            .catch(err => console.error(err));
          sendEmail(studentEmail, 'Appointment Creation', `An appointment was created with ${tutorEmail} on ${currentDay} at ${stateHours[currentTimeIndex]} by the system admin!`)
            .then(() => {})
            .catch(err => console.error(err));
        } else {
          showToast('error', 'Tutor Unavailable', 'The tutor is unavailable at this time!');
        }
      }
    } else {
      showToast('error', 'Incorrect Input', 'The tutor or student email did not exist!');
    }
  }

  return (
    <>
      <View style={styles.container}>
      <View style={styles.titleContainer}><Text style={styles.Title}>Add an Appointment</Text></View>

        <ScrollView>
        <View>
        <Text style={styles.label}>Tutor Email</Text>
        <TextInput
          style={styles.input}
          placeholder='Tutor Email Address'
          keyboardType='email-address'
          backgroundColor='#fbfbfb'
          maxLength={40}
          onChangeText={text => setTutorEmail(text)}>
        </TextInput >

        <Text style={styles.label}>Student Email</Text>
        <TextInput
          style={styles.input}
          placeholder='Student Email Address'
          keyboardType='email-address'
          backgroundColor='#fbfbfb'
          maxLength={40}
          onChangeText={text => setStudentEmail(text)}>
        </TextInput>

        <Text style={styles.label}>Select the day and time</Text>
        <View style={styles.pickerContainer}>
          <ScrollView>
            <ScrollPicker
              dataSource={stateDays}
              selectedIndex={currentDayIndex}
              wrapperHeight={180}
              wrapperWidth={150}
              wrapperColor='#FFFFFF'
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}
              onValueChange={(data, selectedIndex) => {
                const newStateDays = [...stateDays];
                newStateDays[selectedIndex] = data;

                setStateDays(newStateDays);
                setCurrentDayIndex(selectedIndex);
                setCurrentDay(data);
              }}
            />
          </ScrollView>

          <ScrollView>
            <ScrollPicker
              dataSource={stateHours}
              selectedIndex={currentTimeIndex}
              wrapperHeight={180}
              wrapperWidth={150}
              wrapperColor='#FFFFFF'
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}
              onValueChange={(data, selectedIndex) => {
                const newStateHours = [...stateHours];
                newStateHours[selectedIndex] = data;

                setStateHours(newStateHours);
                setCurrentTimeIndex(selectedIndex);
              }}
            />
          </ScrollView>
          </View>
        </View>
        </ScrollView>
        <Button onPress={createAppointment} title='Submit Appointment' />
      </View>

    <Toast />
    </>
  );
}

const styles = StyleSheet.create({
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  }
});
