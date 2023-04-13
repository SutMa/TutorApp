import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getUserStorage, USER_TYPES } from '../controllers/auth/user';
import TutorList from '../StudentView/TutorList';
import UserAppointments from '../TutorView/UserAppointments';
import RemoveAppointment from '../AdminView/RemoveAppointment';

export default function Home() {
    const [user, setUser] = useState(undefined);
    console.log(user);

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
               <UserAppointments /> 
            );
        case USER_TYPES.ADMIN:
            return(
                <RemoveAppointment />
            );
        case USER_TYPES.STUDENT: 
            return(
                <TutorList />
            );
        default:
            console.error('unknown role');
    }
}
