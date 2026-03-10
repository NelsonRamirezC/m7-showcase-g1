import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig.js'

export const useProductsStore = defineStore('products', () => {
  //ESTADOS
  const products = ref([])

  const categories = ref(['Hogar', 'Cocina', 'Jardín'])

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

  const createProduct = async (producto) => {
    try {
      const productosRef = collection(db, 'productos')

      delete producto.id

      const docRef = await addDoc(productosRef, { ...producto })

      products.value.push({ id: docRef.id, ...producto })

      return { success: `producto creado con id: ${docRef.id}` }
    } catch (error) {
      console.log(error)
      return { error: 'No se pudo crear el producto en la base de datos.' }
    }
  }

  return { products, categories, fetchProducts, createProduct }
})
