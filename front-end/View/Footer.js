import { StyleSheet, View, Container, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Footer() {
  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Pressable style={styles.pressable}>
          <Ionicons name="md-calendar" size={32} color="black" />
        </Pressable>
        <Pressable style={styles.pressable}>
          <Ionicons name="md-home" size={32} color="black" />
        </Pressable>
        <Pressable style={styles.pressable}>
          <Ionicons name="md-settings" size={32} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  pressable: {
    height: 50,
    width: 100,
    alignItems: 'center',
  }
});
