import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
} from 'firebase/firestore'
import { db } from '@/firebaseConfig.js'

export const useProductsStore = defineStore('products', () => {
  //ESTADOS
  const products = ref([])
  const totalProducts = ref(0)
  const currentPage = ref(1)
  const isLoading = ref(false)

  const categories = ref(['Hogar', 'Cocina', 'Jardín'])

  const pageSize = 10
  const pageCursors = ref([]) // almacena el último documento de cada página para cursor
  const pageCache = ref({}) // cache de productos por página para evitar reconsultas

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(totalProducts.value / pageSize))
  })

  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  //GETTERS

  const productByName = computed(() => {
    return (termino) => {
      if (!termino) return products.value

      const query = termino.toLowerCase()
      return products.value.filter(
        (p) =>
          p.nombre.toLowerCase().includes(query) || p.descripcion.toLowerCase().includes(query),
      )
    }
  })

  //UTILS
  const refreshTotalCount = async () => {
    const countSnapshot = await getCountFromServer(collection(db, 'productos'))
    totalProducts.value = countSnapshot.data().count
  }

  const loadPage = async (page = 1) => {
    isLoading.value = true

    try {
      // Si ya tenemos la página en cache, no hay que volver a consultar.
      if (pageCache.value[page]) {
        if (totalProducts.value === 0) await refreshTotalCount()

        products.value = pageCache.value[page]
        currentPage.value = page
        return { success: 'Productos obtenidos correctamente.' }
      }

      // Si no se conoce la cantidad total, la consultamos una sola vez.
      if (totalProducts.value === 0) await refreshTotalCount()

      const baseQuery = query(collection(db, 'productos'), orderBy('nombre'), limit(pageSize))

      // Si vamos a la primera página no necesitamos cursor
      if (page === 1) {
        const querySnapshot = await getDocs(baseQuery)

        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        products.value = items
        pageCache.value[1] = items
        pageCursors.value[0] = querySnapshot.docs[querySnapshot.docs.length - 1]
        currentPage.value = 1
        return { success: 'Productos obtenidos correctamente.' }
      }

      // Para páginas posteriores necesitamos un cursor (startAfter)
      // Aseguramos que tengamos el cursor para la página anterior
      if (!pageCursors.value[page - 2]) {
        // cargar páginas previas hasta tener el cursor correcto
        let currentCursor = null
        for (let p = 1; p <= page; p += 1) {
          const pageQuery = currentCursor ? query(baseQuery, startAfter(currentCursor)) : baseQuery

          const querySnapshot = await getDocs(pageQuery)
          const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

          currentCursor = querySnapshot.docs[querySnapshot.docs.length - 1]
          pageCursors.value[p - 1] = currentCursor
          pageCache.value[p] = items

          // Si llegamos a la página deseada, guardamos productos
          if (p === page) {
            products.value = items
          }

          // Si no hay más documentos, rompemos el ciclo (no hay más páginas)
          if (querySnapshot.docs.length < pageSize) break
        }

        currentPage.value = page
        return { success: 'Productos obtenidos correctamente.' }
      }

      const cursor = pageCursors.value[page - 2]
      const pageQuery = query(baseQuery, startAfter(cursor))
      const querySnapshot = await getDocs(pageQuery)

      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      products.value = items
      pageCache.value[page] = items
      pageCursors.value[page - 1] = querySnapshot.docs[querySnapshot.docs.length - 1]
      currentPage.value = page

      return { success: 'Productos obtenidos correctamente.' }
    } catch (error) {
      console.log(error)
      return { error: 'Algo ha salido mal al intentar leer los productos.' }
    } finally {
      isLoading.value = false
    }
  }

  const fetchAllProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'productos'))

      products.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      await refreshTotalCount()

      return { success: 'Productos obtenidos correctamente.' }
    } catch (error) {
      console.log(error)
      return { error: 'Algo ha salido mal al intentar leer los productos.' }
    }
  }

  const fetchProducts = async () => {
    return loadPage(1)
  }

  const nextPage = async () => {
    if (!hasNextPage.value) return { error: 'No hay más páginas.' }
    return loadPage(currentPage.value + 1)
  }

  const prevPage = async () => {
    if (currentPage.value <= 1) return { error: 'Página inicial.' }
    return loadPage(currentPage.value - 1)
  }

  const productsByCategory = (category) => {
    return products.value.filter((p) => p.categoria == category)
  }

  const createProduct = async (producto) => {
    try {
      const productosRef = collection(db, 'productos')

      delete producto.id

      const docRef = await addDoc(productosRef, { ...producto })

      // Invalida caché de paginación y actualiza conteo
      pageCursors.value = []
      pageCache.value = {}
      await refreshTotalCount()

      return { success: `producto creado con id: ${docRef.id}` }
    } catch (error) {
      console.log(error)
      return { error: 'No se pudo crear el producto en la base de datos.' }
    }
  }

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'productos', id))

      // Invalida caché de paginación y actualiza conteo
      pageCursors.value = []
      pageCache.value = {}
      await refreshTotalCount()

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

      // Invalida caché de paginación y actualiza conteo
      pageCursors.value = []
      pageCache.value = {}
      await refreshTotalCount()

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
    fetchAllProducts,
    loadPage,
    nextPage,
    prevPage,
    currentPage,
    totalProducts,
    totalPages,
    hasNextPage,
    isLoading,
    createProduct,
    deleteProduct,
    updateProduct,
    productsByCategory,
  }
})
