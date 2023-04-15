import { useEffect, useState } from 'react';
import { Alert, Button, Text, StyleSheet, Pressable, View, Image, ScrollView, LayoutAnimation } from 'react-native';
import { getAllTutors, getUserStorage } from '../controllers/auth/user';
import { DAYS, getTimeScheduleById, HOUR_STATUS, setTimeSchedule } from '../controllers/tutor/tutorController'; 

export default function TutorList() {
    const [tutors, setTutors] = useState(undefined);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [user, setUser] = useState(undefined);

    const refreshSchedules = () => {
        getAllTutors().then((tutors) => {
            const innerTutors = [];

            tutors.forEach((tutor) => {
              getTimeScheduleById(tutor.id).then((schedule) => {
                const { id, ...days } = schedule;

                innerTutors.push({
                  id: tutor.id,
                  days: days,
                  subject: tutor.subject,
                });

                setTutors(innerTutors);
              });
            });
        });
    }

    useEffect(() => {
        refreshSchedules();

        getUserStorage().then((result) => {
            setUser(JSON.parse(result));
        });
    }, []);

    if(user === undefined || tutors === undefined) {
        return(
            <Text>Loading</Text>
        )
    }

    const createAppointment = (tutor, day, hourIndex, printTime) => {
      Alert.alert('Schedule Appointment', `Are you sure you want to schedule an appointment at ${printTime} with ${tutor}?`, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => {
          getTimeScheduleById(tutor).then((schedule) => {
            const { id: tutorId, ...days} = schedule;
            
            days[day][Number(hourIndex)] = user.email; 

            setTimeSchedule(tutor, days)
              .then(() => {
                console.log(`Appointment created successfully`);

                refreshSchedules();
              })
              .catch(err => console.error(err));
          });
        }},
      ]);
    }

    const tutorsElement = []
    for(let i = 0; i < tutors.length; i++){
        const tutor = tutors[i];
        const availableButtons = [];

        Object.keys(DAYS).forEach(key => {
          const day = DAYS[key];
          const startHour = 9;
          let currentHour = 0;

          availableButtons.push(
            <Text key={day} >{ day }</Text>
          );
          tutor.days[day].forEach(hour => {

            if(hour === HOUR_STATUS.AVAILABLE) {

              let hour = startHour + currentHour;
              let hourIndexText = `${currentHour}`;
              let hourTextSuffix = (hour >= 12) ? 'PM' : 'AM';
              let hourText = (hour % 12 == 0) ? '12' : `${hour % 12}`; 
              let nextHour = hour + 1;
              let nextHourText = (nextHour % 12 == 0) ? '12' : `${nextHour % 12}`;
              let nextHourTextSuffix = (nextHour >= 12) ? 'PM' : 'AM';
              let printTime = `${hourText} ${hourTextSuffix}-${nextHourText} ${nextHourTextSuffix}`;
            
              availableButtons.push(
                <Button key={ `${tutor.id}-${day}-${currentHour}` }onPress={() => {
                  createAppointment(tutor.id, day, hourIndexText, printTime);
                }} title={ printTime }></Button>
              );
            }

            currentHour++;
          });
        });

        const isOpen = openDropdown === i;
        const dropdownContent = (
            <View style={styles.dropdownContent}>
                <Text style={styles.dropdownHeader}>Available Times</Text>
                { availableButtons }
            </View>
        );

        tutorsElement.push(
            <View key={i}>
                <Pressable style={[styles.pressable, isOpen && styles.openContainer]} onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
                    setOpenDropdown(isOpen ? null : i)
                }}>
                    <Text style={styles.names}>{ tutors[i].id }</Text>
                    <Text style={styles.subjects}>{ tutors[i].subject }</Text>
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
        borderRadius: 15,
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
    },
    profiles: {
        position: 'relative',
        bottom: '175%',
        width: 60,
        height: 60,
        resizeMode: 'contain',
        borderRadius: 50,
    },
    subjects: {
        fontSize: 15,
        margin: 5,
        color: '#484848',
        textAlign: 'center',
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
        fontSize: 23,
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
