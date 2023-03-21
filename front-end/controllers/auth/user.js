import { createDoc, createDocById, getDocById, docExists } from '../firebaseCrud';

const USER_PASSWORD_MIN_SIZE = 8;
const USER_PATH = 'user';

export const USER_TYPES = {
    STUDENT: 'student',
    ADMIN: 'admin',
    TUTOR: 'tutor',
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