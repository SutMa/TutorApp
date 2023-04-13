import { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Button, TextInput } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { docExists, getDocById } from "../controllers/firebaseCrud";
import { USER_PATH, USER_TYPES } from "../controllers/auth/user";
import { getTimeScheduleById, DAYS, HOUR_STATUS, setTimeSchedule} from "../controllers/tutor/tutorController";

export default function AddAppointment() {
  const hours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
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
      console.error('all fields are required!');
      return;
    }
    
    if(await docExists(USER_PATH, tutorEmail) && await docExists(USER_PATH, studentEmail)) {
      const tutorUser = await getDocById(USER_PATH, tutorEmail);
      const studentUser = await getDocById(USER_PATH, studentEmail);
      
      if(tutorUser.role !== USER_TYPES.TUTOR) {
        console.error('tutor email did not belong to a tutor!');
      } else if(studentUser.role !== USER_TYPES.STUDENT) {
        console.error('student email did not belong to a student');
      } else {
        console.log('valid emails');

        const schedule = await getTimeScheduleById(tutorEmail);

        const status = schedule[currentDay][currentTimeIndex];

        if(status === HOUR_STATUS.AVAILABLE) {
          schedule[currentDay][currentTimeIndex] = studentEmail;
          await setTimeSchedule(tutorEmail, schedule);
          console.info('appoint was created successfully');
        } else {
          console.error('tutor is not available at this time!');
        }
      }
    } else {
      console.error('tutor or student email did not exists!');
    }
  }

  return (
    <View>
      <Text>Add an Appointment</Text>
      <Text>Tutor Email</Text>
      <TextInput
        placeholder='Tutor Email Address'
        keyboardType='email-address'
        backgroundColor='#fbfbfb'
        width={280}
        maxLength={40}
        onChangeText={text => setTutorEmail(text)}>
      </TextInput>
      <Text>Student Email</Text>
      <TextInput
        placeholder='Student Email Address'
        keyboardType='email-address'
        backgroundColor='#fbfbfb'
        width={280}
        maxLength={40}
        onChangeText={text => setStudentEmail(text)}>
      </TextInput>
      <Text>Select the day and time</Text>
      <View style={[styles.container, {
        flexDirection: 'row',
      }]}>
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
      <Button onPress={createAppointment} title='Submit Appointment' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
