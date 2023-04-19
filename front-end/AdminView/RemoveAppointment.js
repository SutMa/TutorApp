import { useEffect, useState } from 'react';
import { View, Alert, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { getTimeScheduleById, setTimeSchedule, DAYS, getAllTimeSchedule, HOUR_STATUS } from '../controllers/tutor/tutorController';
import Toast from 'react-native-toast-message';
import { showToast } from '../util';

export default function RemoveAppointment() {
  const [schedules, setSchedules] = useState(undefined);

  const deleteAppointment = (tutor, day, hourIndex, printTime, student) => {
    Alert.alert('Remove Appointment', `Are you sure you want to remove an appointment at ${printTime} with ${tutor} and ${student}?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Confirm',
        onPress: () => {
          getTimeScheduleById(tutor).then((schedule) => {
            const { id: tutorId, ...days } = schedule;

            days[day][Number(hourIndex)] = HOUR_STATUS.NOT_AVAILABLE;

            setTimeSchedule(tutor, days)
              .then(() => {
                showToast('success', 'Appointment Removed', 'The appointment was removed successfully!');

                refreshSchedules();
              })
              .catch((err) => console.error(err));
          });
        },
      },
    ]);
  };

  const refreshSchedules = () => {
    getAllTimeSchedule().then((innerSchedules) => {
      setSchedules(innerSchedules);
    });
  };

  useEffect(() => {
    refreshSchedules();
  }, []);

  if (schedules === undefined) {
    return <Text>Loading</Text>;
  }

  const appointments = [];

  schedules.forEach((schedule) => {
    Object.keys(DAYS).forEach((key) => {
      const day = DAYS[key];
  
      const startHour = 9;
      let currentHour = 0;
  
      schedule[day].forEach((status) => {
        if (status !== HOUR_STATUS.AVAILABLE && status !== HOUR_STATUS.NOT_AVAILABLE) {
          let hour = startHour + currentHour;
          let hourIndexText = `${currentHour}`;
          let hourTextSuffix = hour >= 12 ? 'PM' : 'AM';
          let hourText = hour % 12 == 0 ? '12' : `${hour % 12}`;
          let nextHour = hour + 1;
          let nextHourText = nextHour % 12 == 0 ? '12' : `${nextHour % 12}`;
          let nextHourTextSuffix = nextHour >= 12 ? 'PM' : 'AM';
          let printTime = `${hourText} ${hourTextSuffix}-${nextHourText} ${nextHourTextSuffix}`;
  
          appointments.push(
            <View key={`${schedule.id}-${status}-${day}-${hourText}`} style={styles.appointmentContainer}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{`${schedule.id}`}</Text> has an appointment with <Text style={{ fontWeight: 'bold' }}>{`${status}`}</Text> from <Text style={{ fontWeight: 'bold' }}>{`${hourText} ${hourTextSuffix}`} to {`${nextHourText} ${nextHourTextSuffix}`}</Text>
              </Text>
              <Button onPress={() => {
                deleteAppointment(schedule.id, day, hourIndexText, printTime, status);
              }} title='Delete' />
            </View>
          );              
        }
  
        currentHour++;
      });
    });
  });

  return (
    <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Remove appointments</Text>
        </View>
      <ScrollView>
        {appointments}
      </ScrollView>
      <Toast />
    </View>
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
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 40,
    marginRight: 40,
    textAlign: 'center',
  },
  appointmentContainer: {
    padding: 10,
    margin: 10,
    borderRadius: 15,
    width: 350,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});