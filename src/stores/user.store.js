import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig.js'

export const useUserStore = defineStore('user', () => {

	//ESTADOS
  const user = ref(null)

	//GETTERS
  const isAuthenticated = computed(() => !!user.value)

	//ACTIONS
	
  async function setUserFromAuth(firebaseUser) {
    if (!firebaseUser) {
      user.value = null
      return
    }
    const uid = firebaseUser.uid
    try {
      const snap = await getDoc(doc(db, 'users', uid))
      user.value = {
        uid,
        email: firebaseUser.email,
        ...(snap.exists() ? snap.data() : {}),
      }
    } catch (e) {
      console.error('Error fetching user profile:', e)
      user.value = { uid, email: firebaseUser.email }
    }
  }

  function clearUser() {
    user.value = null
  }

  return { user, isAuthenticated, setUserFromAuth, clearUser }
})
