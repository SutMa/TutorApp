import { USER_PATH, USER_TYPES } from "../auth/user";
import { createDoc, docExists, getDocById, updateDocById } from "../firebaseCrud";

export const REVIEW_COLLECTION = 'review';

export const createReview = async (studentEmail, tutorEmail, reviewText, reviewNumber) => {
    if(!(await docExists(USER_PATH, tutorEmail))) {
        throw new Error('tutor does not exist');
    }

    const tutor = await getDocById(USER_PATH, tutorEmail);

    if(tutor.role !== USER_TYPES.TUTOR) {
        throw new Error('user is not a tutor!');
    }

    const avg = (tutor.avg * (tutor.avgWeight / (tutor.avgWeight + 1))) + (reviewNumber * (1 / (tutor.avgWeight + 1)));
    const avgWeight = tutor.avgWeight + 1;

    await updateDocById(USER_PATH, tutorEmail, {
      avg,
      avgWeight,
    });
    
    await createDoc(REVIEW_COLLECTION, {
        studentEmail,
        tutorEmail,
        reviewText,
        reviewNumber,
    });
}
