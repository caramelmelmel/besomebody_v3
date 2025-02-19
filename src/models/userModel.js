import { firestore } from '../firebase'

export const createDbUserIfNotExists = async (obj) => {
  try {
    const userRef = firestore.collection('users').doc(obj.id)
    const user = await userRef.get()
    if (!user.exists) {
      await firestore.collection('users').doc(obj.id).set(obj)
      return true
    } else {
      return false
    }
  } catch (err) {
    throw new Error(`Error at createDbUserIfNotExists: ${err}`)
  }
}

export const getDbUser = async (objId) => {
  try {
    const userRef = firestore.collection('users').doc(objId)
    const user = await userRef.get()

    if (!user.exists) {
      return console.error(`No such user in Firestore: ${objId}`)
    } else {
      return user.data()
    }
  } catch (err) {
    new Error(`Error at getDbUser: ${err}`)
  }
}

export const updateDbUser = async (obj, objId) => {
  try {
    const userRef = firestore.collection('users').doc(objId || obj.id)
    await userRef.update(obj)

    if (!userRef) {
      return console.error(`No such user in Firestore: ${objId}`)
    } else {
      const user = await userRef.get()
      const currentUserData = user.data()
      console.log('Progress Saved')
      return currentUserData
    }
  } catch (err) {
    throw new Error(`Error at updateDbUser: ${err}`)
  }
}

export const deleteDbUser = async (userId) => {
  try {
    await firestore.collection('users').doc(userId).delete()
  } catch (err) {
    throw new Error(`Error at deleteDbUser: ${err}`)
  }
}
