import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getUserStorage, USER_TYPES } from '../controllers/auth/user';
import TimeSchedule from '../TutorView/TimeSchedule';


export default function Calendar() {
    const [user, setUser] = useState(undefined);
    console.log(user);

    useEffect(() => {
        getUserStorage().then((result) => {
            console.log(JSON.stringify(result));
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
            break;
        case USER_TYPES.ADMIN:
            return(
                <Text>Admin View</Text>
            );
            break;
        case USER_TYPES.STUDENT: 
            return(
                <Text>Student View</Text>
            );
            break;
        default:
            console.error('unknown role');
    }
}