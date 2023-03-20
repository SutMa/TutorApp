import { View, StyleSheet, Text, Pressable } from 'react-native';

export default function TimeSchedule() {
  const SCHEDULE_WIDTH = 3;
  const SCHEDULE_HEIGHT = 4;

  const starting_left = -(1/3);
  const starting_top = -(1/4);

  const timeButtons = [];
  for(let i = 0; i < SCHEDULE_WIDTH; i++) {
    for(let j = 0; j < SCHEDULE_HEIGHT; j++) {
      timeButtons.push(
        <Pressable key={`${i}:${j}`}style={styles.pressable}
                          left={`${((i * (1 / 3)) - (1/3)) * 100}%`}
                          /*top={`${((j * (1 / 4)) - (1/4)) * 100}%`}*/>
          <Text>Test</Text>
        </Pressable>
      );
    }
  }

  console.log(timeButtons);

  return (
    <View style={styles.container}>
      { timeButtons }  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '40%',
    marginBottom: '30%',
  },
  pressable: {
    borderWidth: 1,
    borderRadius: 3,
    position: 'absolute',
    width: '33.333333333%',
    height: '25%',
    top: '-25%',
  }
});
