import { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TextInput, Button } from "react-native";
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { createReview } from "../controllers/review/reviewController";
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

        try{
            await createReview(user.email, tutorEmail, reviewText, reviewIndex + 1);
            showToast('success', 'Status', 'Review sent successfully!');
        } catch(err) {
            console.error(err);
        }
    }

    if(user === undefined) {
        return (
            <Text>Loading</Text>
        )
    }

    return(
        <View style={styles.container}>
            <Text>Write a review</Text>
            <TextInput onChangeText={text => setTutorEmail(text)} placeholder='Tutor Email'></TextInput>
            <ScrollView>
            <ScrollPicker
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
            <TextInput style={styles.multilineTextInput}
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                onChangeText={text => setReviewText(text)}
                padding={10}
            />

        <Button title='Submit Review' onPress={submitReview} />
        <Toast />
      </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      borderRadius: 10,
      padding: 10,
    },
    multilineTextInput: {
        borderWidth: 5,
    }
  });
