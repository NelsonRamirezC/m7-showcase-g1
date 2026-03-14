import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig.js'

export const useProductsStore = defineStore('products', () => {
  //ESTADOS
  const products = ref([])

  const categories = ref(['Hogar', 'Cocina', 'Jardín'])

  //GETTERS

  const productByName = computed(() => {
    return (termino) => {
      if (!termino) return products.value;
      
      const query = termino.toLowerCase();
      return products.value.filter(p => 
        p.nombre.toLowerCase().includes(query) || p.descripcion.toLowerCase().includes(query)
      );
    };
  });


  //ACCTIONS
  // function increment() {
  //   count.value++
  // }

  const productsByCategory = (category) => {
    return products.value.filter((p) => p.categoria == category)
  }

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

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'productos', id))

      let indexProduct = products.value.findIndex((p) => p.id == id)

      products.value.splice(indexProduct, 1)

      return { success: 'Producto eliminado correctamente' }
    } catch (error) {
      console.log(error)
      return { error: 'Error al intentar eliminar el producto con id: ' + id }
    }
  }

  const updateProduct = async (producto) => {
    try {
      const docRef = doc(db, 'productos', producto.id)

      let idProducto = producto.id
      delete producto.id
      await updateDoc(docRef, { ...producto })

      let indexProduct = products.value.findIndex((p) => p.id == idProducto)

      products.value.splice(indexProduct, 1, { id: idProducto, ...producto })

      return { success: 'Producto actualizado con éxito.' }
    } catch (error) {
      console.log(error)
      return { error: 'Error al intentar actualizar el producto.' }
    }
  }

  return {
    products,
    categories,
    productByName,
    fetchProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    productsByCategory,
  }
})
