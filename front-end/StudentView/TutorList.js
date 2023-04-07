import { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable, View, Image, ScrollView, LayoutAnimation } from 'react-native';
import { getAllTutors } from '../controllers/auth/user';




export default function TutorList() {
    const [tutors, setTutors] = useState(undefined);
    const [openDropdown, setOpenDropdown] = useState(null);

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
        const isOpen = openDropdown === i;
        const dropdownContent = (
            <View style={styles.dropdownContent}>
                <Text style={styles.dropdownHeader}>Available Times</Text>
            </View>
        );

        tutorsElement.push(
            <View key={i}>
                <Pressable style={[styles.pressable, isOpen && styles.openContainer]} onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
                    setOpenDropdown(isOpen ? null : i)
                }}>
                    <Text style={styles.names}>{ tutors[i].id }</Text>
                    <Text style={styles.subjects}>subject</Text>
                    <View style={[styles.rating, isOpen && styles.ratingsOpen]}>
                        <Text style={styles.ratingNum}>4.5</Text>
                    </View>
                    <Text style={[styles.options, isOpen && styles.optionsOpen]}>⋮</Text>
                    <Image source={require('../assets/Nahida.jpg')} style={[styles.profiles, isOpen && styles.profilesOpen]}/>
                </Pressable>
                {isOpen && (
                    <View style={styles.dropdownContainer}>
                        {dropdownContent}
                    </View>
                )}
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
        bottom: '175%',
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
        fontStyle: 'italic',
    },
    rating: {
        width: 30,
        height: 30,
        bottom: '65%',
        left: '85%',
        backgroundColor: '#484848',
        borderRadius: 20,
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
        left: '48%',
        bottom: '103%',
        fontSize: '23',
        fontStyle: 'bold',
        color: '#000',
    },
    dropdownContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft: 30,
    },
    dropdownContainer: {
        width: '100%',
        paddingTop: 10,
    },
    dropdownHeader: {
        fontSize: 17,
        textAlign: 'center',
        marginLeft: '40%',
        bottom: '600%',
        textDecorationLine: 'underline'
    },
    openContainer: {
        height: 'auto',
    },
    profilesOpen: {
        bottom: '63.75%',
    },
    ratingsOpen: {
        bottom: '23.75%',
    },
    optionsOpen: {
        bottom: '37.5%',
        color: '#FFF',
    }
});