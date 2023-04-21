import { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView} from 'react-native'; 
import { getUserStorage } from "../controllers/auth/user";
import {DAYS, getTimeScheduleById, HOUR_STATUS} from "../controllers/tutor/tutorController";
import { capitolFirstLetter } from "../util";

export default function UserAppointments() {
  const [user, setUser] = useState(undefined);
  const [schedule, setSchedule] = useState(undefined);

  useEffect(() => {
    getUserStorage().then((userJSON) => {
      const user = JSON.parse(userJSON);
      setUser(user);

      getTimeScheduleById(user.email).then((schedule) => {
        const { id, ...days } = schedule;
        setSchedule(days);
      });
    });
  }, []);

  if (schedule === undefined || user === undefined) {
    return (
      <Text>Loading</Text>
    );
  }

  const appointments = [];

  Object.keys(DAYS).forEach(key => {
    const day = DAYS[key];
    let currentHour = 0;
    let startHour = 9;

    schedule[day].forEach(status => {
      if (status !== HOUR_STATUS.AVAILABLE && status !== HOUR_STATUS.NOT_AVAILABLE) {
        let hour = startHour + currentHour;
        let hourTextSuffix = (hour >= 12) ? 'PM' : 'AM';
        let hourText = (hour % 12 == 0) ? '12' : `${hour % 12}`;
        let nextHour = hour + 1;
        let nextHourText = (nextHour % 12 == 0) ? '12' : `${nextHour % 12}`;
        let nextHourTextSuffix = (nextHour >= 12) ? 'PM' : 'AM';

        appointments.push(
          <View key={`${user.email}-${day}-${status}-${hour}-${nextHour}`}>
            <View style={styles.innerBox}>
              <Text style={styles.tutorText}>{`Meeting with ${status} from`}</Text>
              <Text style={styles.tutorTime}>{`${capitolFirstLetter(day)} ${hourText} ${hourTextSuffix} - ${nextHourText} ${nextHourTextSuffix}`}</Text>
            </View>
          </View>
        );
      }

      currentHour++;
    });
  });

  return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Your appointments</Text>
        </View>
        <ScrollView>
           {appointments}
        </ScrollView>
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
  innerBox: {
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
  tutorTime: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    marginTop:2,
  },
  tutorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  meetingTime: {
    fontSize: 14,
    textAlign: 'center',
  },
});
