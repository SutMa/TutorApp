import { useEffect, useState } from "react"
import { Text } from "react-native"
import { USER_TYPES, getUserStorage } from "../controllers/auth/user";
import TutorReview from "../StudentView/TutorReview";
import StudentReview from "../TutorView/StudentReview";

export default function Review() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        getUserStorage().then((userJSON) => {
            const innerUser = JSON.parse(userJSON);
            setUser(innerUser);
        })
    });

    if(user === undefined || user === null) {
        return(
            <Text>Loading</Text>
        );
    }

    if(user.role === USER_TYPES.STUDENT) {
        return(
            <TutorReview user={user} />
        );
    } else if (user.role === USER_TYPES.TUTOR) {
        return(
            <StudentReview />
        )
    } else {
        return(
            <Text>Invalid user role</Text>
        )
    }
}
