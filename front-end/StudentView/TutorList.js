import { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { getAllTutors } from '../controllers/auth/user';

export default function TutorList() {
    const [tutors, setTutors] = useState(undefined);

    useEffect(() => {
        // tutor.id is the email
        getAllTutors().then((result) => setTutors(result));
    }, []);

    if(!tutors) {
        return(
            <Text>Loading</Text>
        )
    }

    const tutorsElement = []
    for(let i = 0; i < tutors.length; i++){
        tutorsElement.push(
            <View key={i}>
                <Pressable style={styles.pressable}>
                    <Text>{ tutors[i].id }</Text>
                </Pressable>
            </View>
        );
    }

    return(
        <View>
            { tutorsElement }
        </View>
    );
}

const styles = StyleSheet.create({
    pressable: {
        borderWidth: 1,
        width: 280,
        height: 60,
        padding: 10,
        margin: 5,
        borderRadius: 3,
        fontSize: 18,
        textAlign: 'center',
    }
});