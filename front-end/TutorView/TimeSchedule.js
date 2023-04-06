import { View, StyleSheet, Text, Pressable } from 'react-native';
import { ScrollView, TouchableOpacity, LayoutAnimation} from 'react-native';
import { useEffect, useState } from 'react';


export default function TimeSchedule() {
  const SCHEDULE_WIDTH = 5;

  const [openDropdown, setOpenDropdown] = useState(null);

  const [isPressed, setIsPressed] = useState(Array(8).fill(false));

  const handlePress = (index) => {
    const newIsPressed = [...isPressed];
    newIsPressed[index] = !newIsPressed[index];
    setIsPressed(newIsPressed);
  };


  const timeButtons = [];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  for(let i = 0; i < SCHEDULE_WIDTH; i++) {
    const isOpen = openDropdown === i;
    const dropdownContent = (
      <View style={styles.dropdownContent}>
        <Text style={styles.dropdownHeadertext}>Select times you are available: </Text>
        <ScrollView contentContainerStyle={styles.timeList}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>8:00 AM - 9:00 AM</Text>
            <TouchableOpacity onPress={() => handlePress(i * 8)}>
              <View style={[styles.box, isPressed[i * 8] && styles.boxPressed]}>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>9:00 AM - 10:00 AM</Text>
            <TouchableOpacity onPress={() => handlePress(i * 8 + 1)}>
              <View style={[styles.box, isPressed[i * 8 + 1] && styles.boxPressed]}>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>10:00 AM - 11:00 AM</Text>
            <TouchableOpacity onPress={() => handlePress(i * 8 + 2)}>
              <View style={[styles.box, isPressed[i * 8 + 2] && styles.boxPressed]}>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>11:00 AM - 12:00 PM</Text>
            <TouchableOpacity onPress={() => handlePress(i * 8 + 3)}>
              <View style={[styles.box, isPressed[i * 8 + 3] && styles.boxPressed]}>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>12:00 PM - 1:00 PM</Text>
            <TouchableOpacity onPress={() => handlePress(i * 8 + 4)}>
              <View style={[styles.box, isPressed[i * 8 + 4] && styles.boxPressed]}>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>1:00 PM - 2:00 PM</Text>
            <TouchableOpacity onPress={() => handlePress(i * 8 + 5)}>
              <View style={[styles.box, isPressed[i * 8 + 5] && styles.boxPressed]}>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>3:00 PM - 4:00 PM</Text>
            <TouchableOpacity onPress={() => handlePress(i * 8 + 6)}>
              <View style={[styles.box, isPressed[i * 8 + 6] && styles.boxPressed]}>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>4:00 PM - 5:00 PM</Text>
            <TouchableOpacity onPress={() => handlePress(i * 8 + 7)}>
              <View style={[styles.box, isPressed[i * 8 + 7] && styles.boxPressed]}>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
    

    timeButtons.push(
      <View key={`${weekdays[i]}`} style={[styles.dayContainer, isOpen && styles.openContainer]}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayText}>{weekdays[i]}</Text>
          <Pressable onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
            setOpenDropdown(isOpen ? null : i)
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
  }

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
