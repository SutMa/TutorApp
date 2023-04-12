import { useState, useEffect } from "react";
import { Text, View } from 'react-native'; 
import { getUserStorage } from "../controllers/auth/user";
import {DAYS, getTimeScheduleById, HOUR_STATUS} from "../controllers/tutor/tutorController";

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

    if(schedule === undefined || user === undefined) {
      return(
        <Text>Loading</Text>
      );
    }

    const appointments = [];

    Object.keys(DAYS).forEach(key => {
      const day = DAYS[key];
      let currentHour = 0;
      let startHour = 8;

      schedule[day].forEach(status => {
        if(status !== HOUR_STATUS.AVAILABLE && status !== HOUR_STATUS.NOT_AVAILABLE) {
          let hour = startHour + currentHour;
          let hourTextSuffix = (hour >= 12) ? 'PM' : 'AM';
          let hourText = (hour % 12 == 0) ? '12' : `${hour % 12}`; 
          let nextHour = hour + 1;
          let nextHourText = (nextHour % 12 == 0) ? '12' : `${nextHour % 12}`;
          let nextHourTextSuffix = (nextHour >= 12) ? 'PM' : 'AM';

          appointments.push(
            <Text>{ `You have an appointment with ${status} at ${hourText} ${hourTextSuffix}-${nextHourText} ${nextHourTextSuffix}` }</Text>
          );
        }

        currentHour++;
      });
    });

    return(
      <View>
        { appointments }
      </View>
    );
}
