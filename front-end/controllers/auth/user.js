import { createDocById, getDocById, docExists, queryAllDoc } from '../firebaseCrud';
import {  where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PASSWORD_MIN_SIZE = 8;
export const USER_PATH = 'user';
export const USER_TOKEN = 'user';

export const USER_TYPES = {
    STUDENT: 'student',
    ADMIN: 'admin',
    TUTOR: 'tutor',
}

export const getAllTutors = async () => {
    const result = await queryAllDoc(USER_PATH, where('role', '==', USER_TYPES.TUTOR));
    return result;
}

export const getAllUsers = async () => {
    const result = await queryAllDoc(USER_PATH, where('role', '!=', USER_TYPES.ADMIN));
    return result;
}

export async function signUp(email, password, role){
    if(await docExists(USER_PATH, email)){
        throw new Error('Account already exists.');
    }

    await createDocById(USER_PATH, email, {
        password: password,
        role: role,
    });
}

export async function signIn(email, password){
    if(!(await docExists(USER_PATH, email))){
        return null;
    }
    const user = await getDocById(USER_PATH, email);
    if(user.password != password){
        return null;
    }
    return user.role;
}

const validateLSUEmail = (email) => {
    return email.length >= 7 && (email.slice(-7) == 'lsu.edu');
}

export const validateEmail = (email) => {
    return validateLSUEmail(email) && String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

export const validatePassword = (password) => {
    return password.length >= USER_PASSWORD_MIN_SIZE;
}

export const clearUserStorage = async () => {
    await AsyncStorage.clear();
}

export const saveUserStorage = async (user) => {
    await AsyncStorage.setItem(USER_TOKEN, JSON.stringify(user));
    await AsyncStorage.setItem(USER_TOKEN, JSON.stringify(user));
}

export const getUserStorage = async () => {
    const result = AsyncStorage.getItem(USER_TOKEN);
    return result;
}
