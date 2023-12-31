import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getUserStorage, USER_TYPES } from '../controllers/auth/user';
import TimeSchedule from '../TutorView/TimeSchedule';
import Appointments from '../StudentView/Appointments';
import AddAppointment from '../AdminView/AddAppointment';

export default function Calendar() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        getUserStorage().then((result) => {
            setUser(JSON.parse(result));
        }
    )}, []);

    // NOTE don't load unless user is loaded
    if(!user) {
        return(
            <Text>Loading</Text>
        );
    }

    switch(user.role){
        case USER_TYPES.TUTOR:
            return(
                <TimeSchedule />
            );
        case USER_TYPES.ADMIN:
            return(
              <AddAppointment />
            );
        case USER_TYPES.STUDENT: 
            return(
                <Appointments />
            );
        default:
            console.error('unknown role');
    }
}
