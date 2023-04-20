import { startTransition, useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { DAYS, getAllTimeSchedule } from '../controllers/tutor/tutorController';
import { getUserStorage } from '../controllers/auth/user';

export default function Appointments() {
    const [schedules, setSchedules] = useState(undefined);
    const [email, setEmail] = useState(undefined);

    useEffect(() => {
        getAllTimeSchedule().then((schedulesResult) => {
            setSchedules(schedulesResult);
        });

        getUserStorage().then(userJSON => {
            const user = JSON.parse(userJSON);
            setEmail(user.email);
        })
    }, []);

    if(email === undefined || schedules === undefined) {
        return (
            <View>
                <Text>Loading</Text>
            </View>
        );
    }

    const myAppointmentsElement = [];

    schedules.forEach((schedule) => {
        const { id, ...days } = schedule;
        
        Object.keys(DAYS).forEach((key) => {
            const day = DAYS[key];

            let currentHour = 0;
            const startHour = 9;


            days[day].forEach((status) => {
                if(status === email) {
                    let hour = startHour + currentHour;
                    let hourTextSuffix = (hour >= 12) ? 'PM' : 'AM';
                    let hourText = (hour % 12 == 0) ? '12' : `${hour % 12}`; 
                    let nextHour = hour + 1;
                    let nextHourText = (nextHour % 12 == 0) ? '12' : `${nextHour % 12}`;
                    let nextHourTextSuffix = (nextHour >= 12) ? 'PM' : 'AM';

                    myAppointmentsElement.push(
                        <Text style={styles.innerBox} key={`${day}-${currentHour}`}>{ day } TutorName: { id }                         Time { hourText }:{ hourTextSuffix }-{ nextHourText }:{ nextHourTextSuffix }</Text>
                        
                    );
                }

                currentHour++;
            });
        });
    });

    return(
        <ScrollView>
            <View stlye={styles.container}>
                { myAppointmentsElement }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      backgroundColor: "white",
    }, 
   innerBox: {
      backgroundColor: "#FFF",
      borderRadius: 15,
      padding:5,
      margin: 4,
      padding: 10,
      shadowColor: 'black',
      shadowOpacity: .5,
      elevation: 10,
      shadowOffset:{
        width: 1,
        height: 2
      },
      height: 60,
      margin: 8,
      textAlign: "center",
      
     }
});
