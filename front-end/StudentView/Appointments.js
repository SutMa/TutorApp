import { startTransition, useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
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

                    console.log(hourText);
                    myAppointmentsElement.push(
                        <Text key={`${day}-${currentHour}`}>{ day }TutorName: { id } | Time { hourText }:{ hourTextSuffix }-{ nextHourText }:{ nextHourTextSuffix }</Text>
                    );
                }

                currentHour++;
            });
        });
    });

    return(
        <ScrollView>
            <View>
                { myAppointmentsElement }
            </View>
        </ScrollView>
    );
}
