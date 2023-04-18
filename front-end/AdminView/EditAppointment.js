import { useState } from "react";
import { View, Text, ScrollView, Button, TextInput } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { docExists, getDocById } from "../controllers/firebaseCrud";
import { USER_PATH, USER_TYPES } from "../controllers/auth/user";
import { getTimeScheduleById, DAYS, HOUR_STATUS, setTimeSchedule} from "../controllers/tutor/tutorController";
import Toast from "react-native-toast-message";
import { showToast } from "../util";

export default function EditAppointment() {
  const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'];
  const days = [DAYS.MONDAY, DAYS.TUESDAY, DAYS.WEDNESDAY, DAYS.THURSDAY, DAYS.FRIDAY];
 
  const [prevCurrentDay, setPrevCurrentDay] = useState(DAYS.MONDAY);
  const [prevStateDays, setPrevStateDays] = useState(days);
  const [prevStateHours, setPrevStateHours] = useState(hours);
  const [prevTutorEmail, setPrevTutorEmail] = useState(undefined);
  const [prevStudentEmail, setPrevStudentEmail] = useState(undefined);
  const [prevCurrentTimeIndex, setPrevCurrentTimeIndex] = useState(0);
  const [prevCurrentDayIndex, setPrevCurrentDayIndex] = useState(0);

  const [postCurrentDay, setPostCurrentDay] = useState(DAYS.MONDAY);
  const [postStateDays, setPostStateDays] = useState(days);
  const [postStateHours, setPostStateHours] = useState(hours);
  const [postCurrentTimeIndex, setPostCurrentTimeIndex] = useState(0);
  const [postCurrentDayIndex, setPostCurrentDayIndex] = useState(0);

  const createAppointment = async () => {
    if(prevTutorEmail === undefined || prevStudentEmail === undefined) {
      showToast('error', 'Invalid Input', 'Tutor and student email are required!');
      return;
    }
    
    if(await docExists(USER_PATH, prevTutorEmail) && await docExists(USER_PATH, prevStudentEmail)) {
      const tutorUser = await getDocById(USER_PATH, prevTutorEmail);
      const studentUser = await getDocById(USER_PATH, prevStudentEmail);
      
      if(tutorUser.role !== USER_TYPES.TUTOR) {
        showToast('error', 'Incorrect Input', 'Tutor email did not belong to a tutor!');
      } else if(studentUser.role !== USER_TYPES.STUDENT) {
        showToast('error', 'Incorrect Input', 'Student email did not belong to a student!');
      } else {
        const schedule = await getTimeScheduleById(prevTutorEmail);

        const status = schedule[prevCurrentDay][prevCurrentTimeIndex];
        
        if(status === HOUR_STATUS.AVAILABLE || status === HOUR_STATUS.NOT_AVAILABLE) {
          showToast('error', 'Incorrect Input', `No appointment exists on ${prevCurrentDay} at ${prevCurrentTimeIndex}!`);
        } else {
          schedule[prevCurrentDay][prevCurrentTimeIndex] = HOUR_STATUS.NOT_AVAILABLE;

          const newStatus = schedule[postCurrentDay][postCurrentTimeIndex];

          if(newStatus === HOUR_STATUS.NOT_AVAILABLE) {
            showToast('error', 'Incorrect Input', 'Tutor is not available at this time!');
          } else if(newStatus !== HOUR_STATUS.AVAILABLE) {
            showToast('error', 'Incorrect Input', 'Tutor already has an appointment at this time!');
          } else {
            schedule[postCurrentDay][postCurrentTimeIndex] = prevStudentEmail;

            await setTimeSchedule(prevTutorEmail, schedule);
      
            showToast('success', 'Appointment Edited', 'Appointment was changed successfully!');
          }
        }
      }
    } else {
      showToast('error', 'Incorrect Emails', 'Tutor or student email did not exists!');
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
          onChangeText={text => setPrevTutorEmail(text)}>
        </TextInput>
        <Text>Student Email</Text>
        <TextInput
          placeholder='Student Email Address'
          keyboardType='email-address'
          backgroundColor='#fbfbfb'
          width={280}
          maxLength={40}
          onChangeText={text => setPrevStudentEmail(text)}>
        </TextInput>
        <Text>Select the day and time</Text>
        <View style={[{
          flexDirection: 'row',
        }]}>
          <ScrollView>
            <ScrollPicker
              dataSource={prevStateDays}
              selectedIndex={prevCurrentDayIndex}
              wrapperHeight={180}
              wrapperWidth={150}
              wrapperColor='#FFFFFF'
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}
              onValueChange={(data, selectedIndex) => {
                const newprevStateDays = [...prevStateDays];
                newprevStateDays[selectedIndex] = data;

                setPrevStateDays(newprevStateDays);
                setPrevCurrentDayIndex(selectedIndex);
                setPrevCurrentDay(data);
              }}
            />
          </ScrollView>
          <ScrollView>
            <ScrollPicker
              dataSource={prevStateHours}
              selectedIndex={prevCurrentTimeIndex}
              wrapperHeight={180}
              wrapperWidth={150}
              wrapperColor='#FFFFFF'
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}setpost
              onValueChange={(data, selectedIndex) => {
                const newprevStateHours = [...prevStateHours];
                newprevStateHours[selectedIndex] = data;

                setPrevStateHours(newprevStateHours);
                setPrevCurrentTimeIndex(selectedIndex);
              }}
            />
          </ScrollView>
        </View>

        <Text>Set the new appointment day and time</Text>

        <View style={[{
          flexDirection: 'row',
        }]}>
          <ScrollView>
            <ScrollPicker
              dataSource={postStateDays}
              selectedIndex={postCurrentDayIndex}
              wrapperHeight={180}
              wrapperWidth={150}
              wrapperColor='#FFFFFF'
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}
              onValueChange={(data, selectedIndex) => {
                const newpostStateDays = [...postStateDays];
                newpostStateDays[selectedIndex] = data;

                setPostStateDays(newpostStateDays);
                setPostCurrentDayIndex(selectedIndex);
                setPostCurrentDay(data);
              }}
            />
          </ScrollView>
          <ScrollView>
            <ScrollPicker
              dataSource={postStateHours}
              selectedIndex={postCurrentTimeIndex}
              wrapperHeight={180}
              wrapperWidth={150}
              wrapperColor='#FFFFFF'
              itemHeight={60}
              highlightColor='#d8d8d8'
              highlightBorderWidth={2}
              onValueChange={(data, selectedIndex) => {
                const newpostStateHours = [...postStateHours];
                newpostStateHours[selectedIndex] = data;

                setPostStateHours(newpostStateHours);
                setPostCurrentTimeIndex(selectedIndex);
              }}
            />
          </ScrollView>
        </View>
        <Button onPress={createAppointment} title='Edit Appointment' />
      </View>
    <Toast />
    </>
  );
}
