import { useEffect, useState } from 'react';
import { Alert, Button, Text, StyleSheet, Pressable, View, Image, ScrollView, LayoutAnimation } from 'react-native';
import { getAllTutors, getUserStorage, USER_DEFAULT_PROFILE_PIC_URI } from '../controllers/auth/user';
import { DAYS, getTimeScheduleById, HOUR_STATUS, setTimeSchedule } from '../controllers/tutor/tutorController'; 
import Toast from 'react-native-toast-message';
import { showToast } from '../util';
import { sendEmail } from '../controllers/email/emailController';

export default function TutorList() {
    const [tutors, setTutors] = useState(undefined);
    const [openDropdown, setOpenDropdown] = useState(undefined);
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
                  profilePicUrl: tutor.profilePicUrl,
                  avg: tutor.avg,
                });

                setTutors(innerTutors);
                setOpenDropdown(Array(innerTutors.length).fill(false));
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

    if(user === undefined || tutors === undefined || openDropdown === undefined) {
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
                showToast('success', 'Appointment Created', 'Your appointment was successfully created!');

                sendEmail(user.email, 'Appointment Creation', `You appointment was succesfully created with ${tutorId} on ${day} at ${printTime}!`)
                  .then(() => {})
                  .catch(err => console.error(err));
                sendEmail(tutorId, 'Appointment Creation', `${user.email} has scheduled an appointment with you on ${day} at ${printTime}!`)
                  .then(() => {})
                  .catch(err => console.error(err));

                refreshSchedules();
              })
              .catch(_err => {
                showToast('error', 'Appoinment Creation Failed', 'Failed to create apointment at this time!');
              });
          });
        }},
      ]);
    }

    const tutorsElement = []
    for(let i = 0; i < tutors.length; i++){
        const tutor = tutors[i];
        const availableButtons = [];

        
        let availableTimesJsx = <View style={styles.pheadingContainer}><Text style={styles.pheading}>Tutor Has No Avialability</Text></View>;

        Object.keys(DAYS).forEach(key => {
          const day = DAYS[key];
          const startHour = 9;
          let currentHour = 0;

          
          let anyAvailability = false;

          tutor.days[day].forEach(hour => {
            if(hour === HOUR_STATUS.AVAILABLE) {
              if(!anyAvailability) {
                anyAvailability = true;
                availableButtons.push(
                  <Text style={{ fontSize: 20, textTransform: 'capitalize' }} key={day}>{ day }:</Text>
                );
                availableTimesJsx = <View style={styles.pheadingContainer}><Text style={styles.pheading}>Available Times</Text></View>;
              }

              let hour = startHour + currentHour;
              let hourIndexText = `${currentHour}`;
              let hourTextSuffix = (hour >= 12) ? 'PM' : 'AM';
              let hourText = (hour % 12 == 0) ? '12' : `${hour % 12}`; 
              let nextHour = hour + 1;
              let nextHourText = (nextHour % 12 == 0) ? '12' : `${nextHour % 12}`;
              let nextHourTextSuffix = (nextHour >= 12) ? 'PM' : 'AM';
              let printTime = `${hourText} ${hourTextSuffix}-${nextHourText} ${nextHourTextSuffix}`;
            
              availableButtons.push(
                <Pressable style={styles.buttonTime} key={ `${tutor.id}-${day}-${currentHour}` } 
                onPress={() => {
                  createAppointment(tutor.id, day, hourIndexText, printTime);
                }}
                >
                  <Text style={styles.buttonTextTime}>{ printTime }</Text>
                </Pressable>
              );
            }

            currentHour++;
          });
        });

        let openJsx;
        if(openDropdown[i]) {
            openJsx = (
              <View style={styles.dropdownContainer}>
                { availableTimesJsx }
                <View style={styles.dropdownContent}>
                    { availableButtons }
                </View>
              </View>
            );
        }
            
        tutorsElement.push(
            <View key={i}>
                <Pressable style={[styles.pressable, styles.openContainer]} onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
                    const newDropdown = [...openDropdown];
                    newDropdown[i] = !newDropdown[i];
                    setOpenDropdown(newDropdown);
                }}>
                    <Text style={styles.names}>{ tutors[i].id }</Text>
                    <Text style={styles.subjects}>{ tutors[i].subject }</Text>
                    <View style={styles.rating}>
                        <Text style={styles.ratingNum}>{ tutors[i].avg }</Text>
                    </View>
                    <Text style={styles.options}>⋮</Text>
                    <Image source={{ uri:(tutors[i].profilePicUrl ?? USER_DEFAULT_PROFILE_PIC_URI)}} style={[styles.profiles]}/>
                    { openJsx }   
                </Pressable>
            </View>
        );
    }

    return (
        <>
          <View>
            <View style={styles.titleContainer}><Text style={styles.Title}>Schedule an appointment</Text></View>
            <ScrollView>
              <View style={styles.container}>
                { tutorsElement }
              </View>
            </ScrollView>
          </View>
          <Toast />
        </>
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
      position: 'relative',
    },
    buttonTime: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'gray',
      width: 200,
      height: 50,
      margin: 3,
    },
    buttonTextTime: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    container: {
      margin: 50,
      marginTop:20,
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingBottom:10,
        marginTop: 25,
    },
    Title: {
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 0,
      marginBottom: 10,
      marginLeft: 40,
      marginRight: 40,
      textAlign: 'center',
    },
    pheadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: 'black',
      height: 60,
    },
    pheading: {
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 0,
      marginLeft: 40,
      marginRight: 40,
      textAlign: 'center',
      marginTop: 4,
    },
    names: {
      fontSize: 21,
      textAlign: 'center',
    },
    profiles: {
      width: 60,
      height: 60,
      borderRadius: 50,
      marginTop: -60,
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
      backgroundColor: '#484848',
      borderRadius: 20,
      justifyContent: 'center',
      color: '#FFF',
      marginTop: -4,
      marginLeft: 295,
      marginTop:-38,
    },
    ratingNum: {
      textAlign: 'center',
      fontSize: 16,
      color: '#FFF',
    },
    options: {
      fontSize: 23,
      marginLeft: 330,
      marginTop: -23,
    },
    dropdownContent: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:-15,
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
  });
  
  
