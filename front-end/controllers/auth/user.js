import { createDoc, createDocById, getDocById, docExists } from '../firebaseCrud';

const USER_PATH = 'user';
export const USER_TYPES = {
    STUDENT: 'student',
    ADMIN: 'admin',
    TUTOR: 'tutor',
}

export async function signUp(email, password, role){
    if(!docExists(USER_PATH, email)){
        throw new Error('Account already exists.');
    }
    await createDocById(USER_PATH, email, {
        password: password,
        role: role,
    });
}

export async function signIn(email, password, role){
    if(!docExists(USER_PATH, email)){
        return false;
    }
    const user = await getDocById(USER_PATH, email);
    if(user.password != password || user.role != role){
        return false;
    }
    return true;
}