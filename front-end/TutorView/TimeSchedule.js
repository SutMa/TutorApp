import { View, StyleSheet, Text, Pressable } from 'react-native';
import { ScrollView, TouchableOpacity, LayoutAnimation} from 'react-native';
import { useEffect, useState } from 'react';
import { getUserStorage } from '../controllers/auth/user';
import { DAYS, setTimeSchedule, getTimeScheduleById, HOUR_STATUS } from '../controllers/tutor/tutorController'; 

export default function TimeSchedule() {
  //NOTE: array of colors representating status of the hour
  const [scheduleColors, setScheduleColors] = useState(undefined);
  const [schedule, setSchedule] = useState(undefined);
  const [numHours, setNumHours]  = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [isOpen, setIsOpen] = useState(Array(Object.keys(DAYS).length).fill(false));

  const ButtonStateColor = {
    [HOUR_STATUS.AVAILABLE]: 'green',
    [HOUR_STATUS.NOT_AVAILABLE]: 'white',
    OTHER: 'orange',
  }

  const handlePress = (index) => {
    const newscheduleColors = [...scheduleColors];

    if(scheduleColors[index] === ButtonStateColor[HOUR_STATUS.NOT_AVAILABLE]) {
      newscheduleColors[index] = ButtonStateColor[HOUR_STATUS.AVAILABLE];
      console.log(newscheduleColors[index]);
    } else if(scheduleColors[index] == ButtonStateColor[HOUR_STATUS.AVAILABLE]) {
      newscheduleColors[index] = ButtonStateColor[HOUR_STATUS.NOT_AVAILABLE];
    } else {
      console.error('there is an appointment at this time');
    }

    setScheduleColors(newscheduleColors);
  };

  const colorToSchedule = (color) => {
    if(color === ButtonStateColor[HOUR_STATUS.NOT_AVAILABLE]){
      return HOUR_STATUS.NOT_AVAILABLE;
    } 
    if(color === ButtonStateColor[HOUR_STATUS.AVAILABLE]) {
      return HOUR_STATUS.AVAILABLE;
    }

    //FIXME: should return user id or som?
    return HOUR_STATUS.OTHER;
  }

  const scheduleToColor = (status) => {
    if(status === HOUR_STATUS.NOT_AVAILABLE) {
      return ButtonStateColor[HOUR_STATUS.NOT_AVAILABLE];
    }
    if(status === HOUR_STATUS.AVAILABLE) {
      return ButtonStateColor[HOUR_STATUS.AVAILABLE];
    }

    return ButtonStateColor.OTHER;
  }

  const dayToNumber = (day) => {
    switch(day){
      case DAYS.MONDAY:
        return 0;
      case DAYS.TUESDAY:
        return 1;
      case DAYS.WEDNESDAY:
        return 2;
      case DAYS.THURSDAY:
        return 3;
      case DAYS.FRIDAY:
        return 4;
      default:
        console.error('unknown day!');
    }
  }

  const updateSchedule = () => {
    let currentIndex = 0;
    let newSchedule = {
      [DAYS.MONDAY]: [],
      [DAYS.TUESDAY]: [],
      [DAYS.WEDNESDAY]: [],
      [DAYS.THURSDAY]: [],
      [DAYS.FRIDAY]: [],
    };

    Object.keys(DAYS).forEach((key) => {
      for(let i = 0; i < numHours; i++) {
        const day = DAYS[key];
        const color = colorToSchedule(scheduleColors[currentIndex]);

        if(scheduleColors[currentIndex] === ButtonStateColor.OTHER) {
          const userId = schedule[day][i];
          newSchedule[day].push(userId);
        } else {
          newSchedule[day].push(color);
        }

        currentIndex++;
      }
    });

    setTimeSchedule(email, newSchedule)
      .then(res => console.log('schedule submitted successfully'))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    getUserStorage().then((userJSON) => {
      const user = JSON.parse(userJSON);
      const innerEmail = user.email;

      setEmail(innerEmail);

      getTimeScheduleById(innerEmail).then((scheduleObject) => {
        const hours = scheduleObject.monday.length;
        const { id, ...days } = scheduleObject;

        
        setSchedule(days);
        setNumHours(hours);
        
        const hourArray = [];

        Object.keys(DAYS).forEach((key) => {
          const day = DAYS[key];
          scheduleObject[day].forEach(status => {
            hourArray.push(scheduleToColor(status));
          });
        });
          
        setScheduleColors(hourArray);
      });
    });
  }, []);

  if(schedule === undefined || email === undefined || schedule === undefined || scheduleColors === undefined || numHours === undefined) {
    return (
      <Text>Loading</Text>
    );
  }

  const timeButtons = [];
  const { id, ...days} = schedule;
  let currentDayNumber = 0;

  Object.keys(DAYS).forEach((key) => {
    const currentDay = DAYS[key];
    const dropdownContent = [];

    let currentHour = 0;
    let startHour = 8;

    days[currentDay].forEach(() => {
      let hour = startHour + currentHour;
      let hourTextSuffix = (hour >= 12) ? 'PM' : 'AM';
      let hourText = (hour % 12 == 0) ? '12' : `${hour % 12}`; 
      let nextHour = hour + 1;
      let nextHourText = (nextHour % 12 == 0) ? '12' : `${nextHour % 12}`;
      let nextHourTextSuffix = (nextHour >= 12) ? 'PM' : 'AM';

      let indexscheduleColors = (currentDayNumber * numHours) + currentHour;
       
      dropdownContent.push(
        <View key={ indexscheduleColors } style={styles.dropdownContent}>
          <ScrollView contentContainerStyle={styles.timeList}>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{ hourText }:00 { hourTextSuffix } - { nextHourText }:00 { nextHourTextSuffix }</Text>
              <TouchableOpacity onPress={() => handlePress(indexscheduleColors)}>
                <View style={{...styles.box, ...{
                  backgroundColor: scheduleColors[indexscheduleColors]}
                }}>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );

      currentHour++;
    });

    const handleIsOpen = (day) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
      const newIsOpen = [...isOpen];
      newIsOpen[dayToNumber(day)] = !newIsOpen[dayToNumber(day)];
      setIsOpen(newIsOpen);
    }
    
    timeButtons.push(
      <View key={ currentDay } style={[styles.dayContainer, styles.openContainer]}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayText}>{ currentDay }</Text>
          <Pressable onPress={() => {
            handleIsOpen(currentDay);
          }}>
            <Text style={styles.dropdown}>{isOpen[dayToNumber(currentDay)] ? '▼' : '◀'}</Text>
          </Pressable>
        </View>
        {isOpen[dayToNumber(currentDay)] && (
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
    <View>
    <Pressable onPress={updateSchedule}>
      <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={updateSchedule}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
    </Pressable>
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
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 15,
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
    width: '95%',
    paddingTop: 10,
  },
  dropdownContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 10,
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
    marginRight:0,
    marginLeft: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  box: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 15,
  },
  text: {
    color: 'black',
  },
  buttonContainer: {
    alignItems: 'center',

    marginBottom:30,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
