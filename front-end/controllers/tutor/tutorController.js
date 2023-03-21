import { createDocById, getAllDoc, getDocById } from "../firebaseCrud";

const SCHEDULE_COLLECTION = 'schedule';

export const DAYS = {
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
}

export const HOUR_STATUS = {
    TAKEN: 1,
    NOT_AVAILABLE: 2,
    AVAILABLE: 3,
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