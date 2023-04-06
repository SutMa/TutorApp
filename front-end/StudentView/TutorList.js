import { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable, View, Image, ScrollView, LayoutAnimation } from 'react-native';
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
        //const [openDropdown, setOpenDropdown] = useState(null);
        tutorsElement.push(
            <View key={i}>
                <Pressable style={styles.pressable}>
                    <Text style={styles.names}>{ tutors[i].id }</Text>
                    <Text style={styles.subjects}>subject</Text>
                    <View style={styles.ratingNum}>
                        <Text style={styles.rating}>4.5</Text>
                    </View>
                    <Text style={styles.options}>⋮</Text>
                    <Image source={require('../assets/Nahida.jpg')} style={styles.profiles}/>
                </Pressable>
                {/* {isOpen && (
                    <View style={styles.dropdownContainer}>
                        {dropdownContent}
                    </View>
                )} */}
            </View>
        );
    }

    return(
        <ScrollView>
            <View style={styles.container}>
                { tutorsElement }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: 360,
        height: 80,
        padding: 10,
        margin: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    
        elevation: 5,
        borderRadius: '15px',
    },
    container: {
        margin: 50,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    names: {
        fontSize: 21,
        textAlign: 'center',
        display: 'inline-block',
    },
    profiles: {
        position: 'relative',
        display: 'inline-block',
        bottom: '155%',
        width: 60,
        height: 60,
        resizeMode: 'contain',
        borderRadius: '50%'
    },
    subjects: {
        fontSize: 15,
        margin: 5,
        color: '#484848',
        textAlign: 'center',
        display: 'inline-block',
    },
    rating: {
        width: 21,
        height: 20,
        bottom: '160%',
        left: '85%',
        backgroundColor: '#484848',
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF',

    },
    ratingNum: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFF',
    },
    options: {
        textAlign: 'center',
        justifyContent: 'center',
        left: '47%',
        bottom: '85%',
        fontSize: '23',
        fontStyle: 'bold',
        color: '#000',
    },
    dropdownContent: {

    },
});