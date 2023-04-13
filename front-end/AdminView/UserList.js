import { useEffect, useState } from 'react';
import { View, Alert, Text, Button, ScrollView } from 'react-native';
import { getTimeScheduleById, setTimeSchedule, DAYS, getAllTimeSchedule, HOUR_STATUS } from '../controllers/tutor/tutorController';

export default function UserList() {
    const [schedules, setSchedules] = useState(undefined);


    const deleteAppointment = (tutor, day, hourIndex, printTime, student) => {
      Alert.alert('Remove Appointment', `Are you sure you want to remove an appointment at ${printTime} with ${tutor} and ${student}?`, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {text: 'Confirm', onPress: () => {
          getTimeScheduleById(tutor).then((schedule) => {
            const { id: tutorId, ...days} = schedule;
            
            days[day][Number(hourIndex)] = HOUR_STATUS.NOT_AVAILABLE; 

            setTimeSchedule(tutor, days)
              .then(() => {
                console.log(`Appointment removed successfully`);
  
                refreshSchedules();
              })
              .catch(err => console.error(err));
          });
        }},
      ]);
    }

    const editAppointment = (tutor, day, hourIndex, printTime, student) => {
      Alert.alert('Edit Appointment', `Are you sure you want to edit an appointment at ${printTime} with ${tutor} and ${student}?`, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {text: 'Confirm', onPress: () => {
        }},
      ]);
    }

    const refreshSchedules = () => {
      getAllTimeSchedule().then((innerSchedules) => {
        setSchedules(innerSchedules)
      });
    }

    useEffect(() => {
      refreshSchedules();
    }, []);

    if(schedules === undefined) {
      return (
        <Text>Loading</Text>
      );
    }

    const appointments = [];

    schedules.forEach((schedule) => {
      Object.keys(DAYS).forEach(key => {
        const day = DAYS[key];

        const startHour = 8;
        let currentHour = 0;

        schedule[day].forEach(status => {
          if(status !== HOUR_STATUS.AVAILABLE && status !== HOUR_STATUS.NOT_AVAILABLE) {
            let hour = startHour + currentHour;
            let hourIndexText = `${currentHour}`;
            let hourTextSuffix = (hour >= 12) ? 'PM' : 'AM';
            let hourText = (hour % 12 == 0) ? '12' : `${hour % 12}`; 
            let nextHour = hour + 1;
            let nextHourText = (nextHour % 12 == 0) ? '12' : `${nextHour % 12}`;
            let nextHourTextSuffix = (nextHour >= 12) ? 'PM' : 'AM';
            let printTime = `${hourText} ${hourTextSuffix}-${nextHourText} ${nextHourTextSuffix}`;

            appointments.push(
              <View>
                <Text>{ `${schedule.id} has an appointment with ${status} from ${hourText} ${hourTextSuffix} to ${nextHourText} ${nextHourTextSuffix}` }</Text>
                <Button onPress={() => {
                  deleteAppointment(schedule.id, day, hourIndexText, printTime, status);
                }} title='Delete'></Button>
              </View>
            );
          }

          currentHour++;
        });
      });
    });

    return(
      <ScrollView>
      { appointments }
      </ScrollView>
    );
}

