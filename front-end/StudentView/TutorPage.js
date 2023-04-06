import { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable, View, Image, ScrollView } from 'react-native';
import { tutors } from 'TutotList';

{/* <View style={styles.container}>
    <Text style={styles.tutor}>{ tutors.id[i] }</Text>
</View> */}


const styles = StyleSheet.create({
    tutor: {
        textAlign: 'center',
    },
    container: {
        borderRadius: 15,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        padding: 10,
        width: 360,
        height: 720,
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
});