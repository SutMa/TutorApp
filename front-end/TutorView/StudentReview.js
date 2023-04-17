import { View, ScrollView, Text } from "react-native"
import { useEffect, useState } from "react"
import {getUserStorage, USER_PATH} from "../controllers/auth/user";
import {getAllDoc, getDocById} from "../controllers/firebaseCrud";
import {REVIEW_COLLECTION} from "../controllers/review/reviewController";

export default function StudentReview(props) {
  const [avg, setAvg] = useState(undefined);
  const [avgWeight, setAvgWeight] = useState(undefined);
  const [reviews, setReviews] = useState(undefined);
  const user = props.user;

   useEffect(() => {
      getUserStorage().then((userJSON) => {
        const innerUser = JSON.parse(userJSON);
        setUser(innerUser);

        getAllDoc(REVIEW_COLLECTION).then((innerReviews) => {
          console.log(innerReviews);
          setReviews(innerReviews);
        });
      });
   });


  if(user === undefined || avg === undefined || avgWeight === undefined) {
    return (
      <Text>Loading</Text>
    );
  }

  const reviewsJsx = [];

  reviews.forEach((review) => {
    reviewsJsx.push(
      <Text>{review.reviewText}</Text>
    );
  });

    return(
      <View>
        <Text>Avg: { avg }</Text>
        <Text>AvgWeight: { avgWeight }</Text>
        <ScrollView>

        </ScrollView>
      </View>
    )
}
