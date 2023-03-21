import { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { getAllUsers } from '../controllers/auth/user';

export default function UserList() {
    const [users, setUsers] = useState(undefined);

    useEffect(() => {
        // user.id is the email
        getAllUsers().then((result) => setUsers(result));
    }, []);

    if(!users) {
        return(
            <Text>Loading</Text>
        )
    }

    const userElement = []
    for(let i = 0; i < users.length; i++){
        userElement.push(
            <View key={i}>
                <Pressable style={styles.pressable}>
                    <Text>{ users[i].id }</Text>
                    <Text>{ users[i].role }</Text>
                </Pressable>
            </View>
        );
    }

    return(
        <View>
            { userElement }
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