import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { auth } from './firebaseConfig'

import { onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from './stores/user.store'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Espera al estado de auth antes de montar (asigna user al store)
const userStore = useUserStore()
let mounted = false

onAuthStateChanged(auth, async (firebaseUser) => {
  await userStore.setUserFromAuth(firebaseUser)
  if (!mounted) {
    app.mount('#app')
    mounted = true
  }
})
