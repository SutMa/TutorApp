import { View, StyleSheet, Text, Pressable } from 'react-native';
import { ScrollView, TouchableOpacity, LayoutAnimation} from 'react-native';
import { useEffect, useState } from 'react';
import { getUserStorage } from '../controllers/auth/user';
import { DAYS, getTimeScheduleById, HOUR_STATUS } from '../controllers/tutor/tutorController'; 

export default function TimeSchedule() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isPressed, setIsPressed] = useState(undefined);
  const [myScheduleObject, setMyScheduleObject] = useState(undefined);
  const [numHours, setNumHours]  = useState(undefined);

  const handlePress = (index) => {
    const newIsPressed = [...isPressed];
    newIsPressed[index] = !newIsPressed[index];
    setIsPressed(newIsPressed);
  };

  useEffect(() => {
    getUserStorage().then((userJSON) => {
      const user = JSON.parse(userJSON);
      const email = user.email;

      getTimeScheduleById(email).then((scheduleObject) => {
        const hours = scheduleObject.monday.length;

        setMyScheduleObject(scheduleObject);
        setNumHours(hours);
        setIsPressed(Array(hours * Object.keys(DAYS).length).fill(false));
      });
    });
  }, []);

  if(myScheduleObject === undefined || isPressed === undefined || numHours === undefined) {
    return (
      <Text>Loading</Text>
    );
  }

  const timeButtons = [];
  const { id, ...days} = myScheduleObject;
  let currentDayNumber = 0;

  Object.keys(DAYS).forEach((key) => {
    const currentDay = DAYS[key];
    const dropdownContent = [];

    let currentHour = 0;
    let startHour = 8;

    days[currentDay].forEach((hourStatus) => {
      console.log(hourStatus);

      if(hourStatus !== HOUR_STATUS.AVAILABLE && hourStatus !== HOUR_STATUS.NOT_AVAILABLE) {
        console.log('appointment');
      }
      
      let hour = startHour + currentHour;
      let hourTextSuffix = (hour >= 12) ? 'PM' : 'AM';
      let hourText = (hour % 12 == 0) ? '12' : `${hour % 12}`; 
      let nextHour = hour + 1;
      let nextHourText = (nextHour % 12 == 0) ? '12' : `${nextHour % 12}`;
      let nextHourTextSuffix = (nextHour >= 12) ? 'PM' : 'AM';
       
      dropdownContent.push(
        <View style={styles.dropdownContent}>
          <Text style={styles.dropdownHeadertext}>Select times you are available: </Text>
          <ScrollView contentContainerStyle={styles.timeList}>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{ hourText }:00 { hourTextSuffix } - { nextHourText }:00 { nextHourTextSuffix }</Text>
              <TouchableOpacity onPress={() => handlePress(currentDayNumber * currentHour * numHours)}>
                <View style={[styles.box, styles.boxPressed]}>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );

      currentHour++;
    });


    const isOpen = true;
    
    timeButtons.push(
      <View key={ currentDay } style={[styles.dayContainer, styles.openContainer]}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayText}>{ currentDay }</Text>
          <Pressable onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
            setOpenDropdown(isOpen)
          }}>
            <Text style={styles.dropdown}>{isOpen ? '▼' : '◀'}</Text>
          </Pressable>
        </View>
        {isOpen && (
          <View style={styles.dropdownContainer}>
            {dropdownContent}
          </View>
        )}
      </View>
    );

    currentDayNumber++;
  });

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Edit your weekly schedule!</Text>
      <View style={styles.dayBox}>
        {timeButtons}
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 40,
    marginRight: 40,
    textAlign: 'center',
  },
  dayBox: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  dayContainer: {
    borderRadius: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 10,
    width: '80%',
    minHeight: 100,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openContainer: {
    height: 'auto',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  dropdown: {
    fontSize: 28,
  },
  dropdownHeadertext:{
    marginBottom:10,
    textDecorationLine: 'underline',
    fontSize: 15,

  },
  dropdownContainer: {
    width: '100%',
    paddingTop: 10,
  },
  dropdownContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 30,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: '100%',
  },

  timeText: {
    fontSize: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  box: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    marginLeft: 100,
  },
  boxPressed: {
    backgroundColor: 'green',
  },
  text: {
    color: 'black',
  },
});
