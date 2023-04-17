import { View, ScrollView, Text } from "react-native"
import { useEffect, useState } from "react"
import { getUserStorage, USER_PATH } from "../controllers/auth/user";
import { getAllReviewsById } from "../controllers/review/reviewController";
import {getDocById} from "../controllers/firebaseCrud";

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


  if(avg === undefined || avgWeight === undefined || reviews === undefined) {
    return (
      <Text>Loading</Text>
    );
  }

  const reviewsJsx = [];

  reviews.forEach((review) => {
    reviewsJsx.push(
      <View key={review.id}>
        <Text>Email: { review.studentEmail }</Text>
        <Text>Rating: { review.avg }</Text>
        <Text>{review.reviewText}</Text>
      </View>
    );
  });

    return(
      <View>
        <Text>Your Average Rating: { avg }</Text>
        <Text>Number of Reviews: { avgWeight }</Text>
        <ScrollView>
          { reviewsJsx }
        </ScrollView>
      </View>
    )
}
