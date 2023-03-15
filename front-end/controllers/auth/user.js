import { createDoc, createDocById, getDocById, docExists } from '../firebaseCrud';
const USER_PATH = 'user';

export async function signUp(email, password){
    if(!docExists(USER_PATH, email)){
        throw new Error('Account already exists.');
    }
    await createDocById(USER_PATH, email, {
        password: password,
    });
}

export async function signIn(email, password){
    if(!docExists(USER_PATH, email)){
        return false;
    }
    const user = await getDocById(USER_PATH, email);
    if(user.password != password){
        return false;
    }
    return true;
}