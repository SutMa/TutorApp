import {USER_PATH} from "../auth/user";
import { updateDocById, createDocById, getAllDoc, getDocById } from "../firebaseCrud";

export const SCHEDULE_COLLECTION = 'schedule';

export const SUBJECT = {
  GENERAL: 'general',
  MATH: 'math',
  ENGLISH: 'english',
  HISTORY: 'history',
  SCIENCE: 'science',
}

export const SubjectToIndex = (subject) => {
  let i = -1;
  let currentIndex = 0;

  Object.keys(SUBJECT).forEach(key => {
    const sub = SUBJECT[key];

    if(sub === subject) {
      i = currentIndex;
    }

    currentIndex++;
  });

  return i;
}

export const DEFAULT_SUBJECT = SUBJECT.GENERAL;

export const DAYS = {
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
}

export const HOUR_STATUS = {
    NOT_AVAILABLE: '1',
    AVAILABLE: '2',
}

export const initTutor = async (email) => {
  await initTimeSchedule(email);
  await initSubject(email);
}

export const initTimeSchedule = async (email) => {
    const NOT_AVAILABLE = HOUR_STATUS.NOT_AVAILABLE;

    const schedule = {
        [DAYS.MONDAY]: [NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE],
        [DAYS.TUESDAY]: [NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE],
        [DAYS.WEDNESDAY]: [NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE],
        [DAYS.THURSDAY]: [NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE],
        [DAYS.FRIDAY]: [NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE, NOT_AVAILABLE],
    };

    await setTimeSchedule(email, schedule);
}

export const initSubject = async (email) => {
  const userSubject = {
    subject: DEFAULT_SUBJECT,
  }

  await updateDocById(USER_PATH, email, userSubject);
}

export const updateSubject = async (email, subject) => {
  const userSubject = {
    subject, 
  };

  await updateDocById(USER_PATH, email, userSubject);
}

export const setTimeSchedule = async (email, schedule) => {
    await createDocById(SCHEDULE_COLLECTION, email, schedule);
}

export const getTimeScheduleById = async (email) => {
    const result = await getDocById(SCHEDULE_COLLECTION, email);
    return result;
}

export const getAllTimeSchedule = async () => {
    const result = await getAllDoc(SCHEDULE_COLLECTION);
    return result;
}
