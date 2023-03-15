import { db } from './auth/initFirebase';
import { collection, addDoc, getDocs, deleteDoc, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';

export async function getDocById(path, docId){
    const docRef = doc(db, path, docId);
    const result = await getDoc(docRef);
    return {
        ...result.data(),
        id: result.id,
    };
}

export async function docExists(path, docId){
    const docRef = doc(db, path, docId);
    const result = await getDoc(docRef);
    return result.exists();
}

export async function getAllDoc(path){
    const docs = [];
    const collectionRef = collection(db, path);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((result) => {
        docs.push({
            ...result.data(), 
            id: result.id,
        });
    });
    return docs;
}

export async function createDoc(path, data){
    const collectionRef = collection(db, path);
    await addDoc(collectionRef, data);
}

export async function createAllDoc(dataArray){
    for(let i = 1; i < dataArray.length; i++){
        await createDoc(dataArray[i]);
    }
}

export async function updateAllDoc(dataArray){
    for(let i = 1; i < dataArray.length; i++){
        await updateDoc(dataArray[i].path, dataArray[i].docId, dataArray[i].data);
    }
}

export async function updateDocById(path, docId, data){
    const docRef = doc(db, path, docId);
    await updateDoc(docRef, data);
}

export async function deleteDocById(path, docId){
    const docRef = doc(db, path, docId);
    await deleteDoc(docRef);
}

export async function deleteAllDocById(dataArray){
    for(let i = 1; i < dataArray.length; i++){
        await deleteDocById(dataArray[i].path, dataArray[i].docId);
    }
}

export async function createDocById(path, docId, data){
    const collectionRef = collection(db, path);
    const docRef = doc(collectionRef, docId);
    await setDoc(docRef, data);
}