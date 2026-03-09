import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebaseConfig.js'

export const useProductsStore = defineStore('products', () => {
  //ESTADOS
  const products = ref([])

  //GETTERS
  // const doubleCount = computed(() => count.value * 2)

  //ACCTIONS
  // function increment() {
  //   count.value++
  // }

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'productos'))

      products.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return { success: 'Productos obtenidos correctamente.' }
    } catch (error) {
      console.log(error)
      return { error: 'Algo ha salido mal al intentar leer los productos.' }
    }
  }

  return { products, fetchProducts }
})
