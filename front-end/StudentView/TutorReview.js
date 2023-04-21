import { useState } from "react";
import { View, ScrollView, StyleSheet, Text, TextInput, Pressable, Dimensions } from "react-native";
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { createReview, reviewExists } from "../controllers/review/reviewController";
import { showToast } from '../util';
import Toast from 'react-native-toast-message';

export default function TutorReview(props) {
    const initReviewNumber = 0;
    const [reviewText, setReviewText] = useState(undefined);
    const [reviewNumbers, setReviewNumbers] = useState([1, 2, 3, 4, 5]);
    const [reviewIndex, setReviewIndex] = useState(initReviewNumber);
    const [tutorEmail, setTutorEmail] = useState(undefined);
    const user = props.user;

    const submitReview = async () => {
        if(!Boolean(tutorEmail)) {
            showToast('error', 'Invalid Input', 'Tutor email is required!');
            return;
        }

        if(!Boolean(reviewText)) {
            showToast('error', 'Invalid Input', 'Review message is required!');
            return;
        }

        if(await reviewExists(tutorEmail, user.email)) {
          showToast('error', 'Invalid Input', `You have already reviewed ${tutorEmail}`);
          return;
        };

        try{
            await createReview(user.email, tutorEmail, reviewText, reviewIndex + 1);
            showToast('success', 'Status', 'Review sent successfully!');
        } catch(err) {
            showToast('error', 'Unknown Error', 'An unknown error occurred!');
        }
    }

    if(user === undefined) {
        return (
            <Text>Loading</Text>
        )
    }

    return(
      <>
        <View style={styles.container}>
        <ScrollView>
            <View style={styles.titleContainer}><Text style={styles.Title}>Write a Review</Text></View>
            <TextInput
              style={styles.input}
              placeholder='Tutor Email Address'
              keyboardType='email-address'
              backgroundColor='#fbfbfb'
              maxLength={40}
              onChangeText={text => setTutorEmail(text)}
            />
            <TextInput style={styles.multilineTextInput}
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                placeholder={'Write Your Review...'}
                onChangeText={text => setReviewText(text)}
            />
            <ScrollView
              nestedScrollEnabled={true}>
            <ScrollPicker
                style={styles.scrollPicker}
                dataSource={reviewNumbers}
                selectedIndex={initReviewNumber}
                wrapperHeight={180}
                wrapperWidth={300}
                wrapperColor='#FFFFFF'
                itemHeight={60}
                highlightColor='#d8d8d8'
                highlightBorderWidth={2}
                onValueChange={(data, selectedIndex) => {
                    const newReviewNumbers = [...reviewNumbers];
                    newReviewNumbers[selectedIndex] = data;

                    setReviewNumbers(newReviewNumbers);
                    setReviewIndex(selectedIndex);
                }}
            />
            </ScrollView>
            <Pressable style={styles.submitButton} onPress={submitReview}>
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </Pressable>
        </ScrollView>
        </View>
      <Toast />
      </>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
      margin: 20,
    },
    titleContainer: {
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
    submitButton: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'gray',
      width: 200,
      height: 50,
      margin: 15, 
    },
    submitButtonText: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    multilineTextInput: {
      backgroundColor: 'white',
      borderWidth: 2,
      borderRadius: 7,
      margin: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
});
