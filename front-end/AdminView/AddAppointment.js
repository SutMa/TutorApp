import { useState } from "react";
import { View, Text, ScrollView, Button, TextInput } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { docExists, getDocById } from "../controllers/firebaseCrud";
import { USER_PATH, USER_TYPES } from "../controllers/auth/user";
import { getTimeScheduleById, DAYS, HOUR_STATUS, setTimeSchedule} from "../controllers/tutor/tutorController";
import Toast from "react-native-toast-message";
import { showToast } from "../util"; 

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
        <View style={[{
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
    <Toast />
    </>
  );
}
