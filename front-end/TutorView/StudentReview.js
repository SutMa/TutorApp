import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { getUserStorage, USER_PATH } from "../controllers/auth/user";
import { getAllReviewsById } from "../controllers/review/reviewController";
import { getDocById } from "../controllers/firebaseCrud";

export default function StudentReview(props) {
  const [avg, setAvg] = useState(undefined);
  const [avgWeight, setAvgWeight] = useState(undefined);
  const [reviews, setReviews] = useState(undefined);
  const user = props.user;

  useEffect(() => {
    getAllReviewsById(user.email).then((innerReviews) => {
      getDocById(USER_PATH, user.email).then((innerUser) => {
        setReviews(innerReviews);
        setAvg(innerUser.avg);
        setAvgWeight(innerUser.avgWeight);
      });
    });
  }, []);

  if (avg === undefined || avgWeight === undefined || reviews === undefined) {
    return <Text>Loading</Text>;
  }

  const reviewsJsx = [];

  reviews.forEach((review) => {
    reviewsJsx.push(
      <View key={review.id} style={styles.reviewContainer}>
        <Text style={styles.reviewText}>
          User {review.studentEmail} gave you {review.avg}? stars
        </Text>
        <Text style={styles.reviewText}>Comment: {review.reviewText}</Text>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Your Review Analytics</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Average Rating: {avg} stars
        </Text>
        <Text style={styles.statsText}>
          Number of Reviews: {avgWeight}
        </Text>
      </View>
      <View style={styles.reviewTextContainer}>
        <Text style={styles.reviewsTitle}>Reviews:</Text>
      </View>
      <ScrollView>{reviewsJsx}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 15,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 0,
    marginBottom: 10,
    textAlign: "center",
  },
  statsContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  reviewTextContainer:{
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  reviewsTitle: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft:10,
  },
  reviewContainer: {
    padding: 10,
    margin: 10,
    borderRadius: 15,
    width: 350,
    alignSelf: 'center',
    alignItems: 'center',
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
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
