import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { auth } from './firebaseConfig'

import { onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from './stores/user.store'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

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
