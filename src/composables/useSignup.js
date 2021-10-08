import { ref } from 'vue'
import { projectAuth } from '../firebase/config'

const error = ref(null)
const isPendinng = ref(false)

const signup = async (email, password, displayName) => {
  error.value = null

  try {
    isPendinng.value = true
    const res = await projectAuth.createUserWithEmailAndPassword(email, password)
    if (!res) {
      throw new Error('Could not complete signup')
    }
    await res.user.updateProfile({ displayName })
    error.value = null
    isPendinng.value = false
    return res
  }
  catch(err) {
    console.log(err.message)
    error.value = err.message
    isPendinng.value = false
  }
}

const useSignup = () => {
  return { error, signup }
}

export default useSignup