<template>

  <HeaderComp>Página Home</HeaderComp>

  <main class="container py-3">

    <section>
      <div class="d-flex justify-content-between">
        <h2 class="text-center">Nuestros productos...</h2>

        <div class="py-3 d-flex justify-content-center">
          <RouterLink v-for="category in productStore.categories" :key="category" class="btn btn-outline-secondary mx-2"
            :to="{ name: 'cagetory', params: { category } }">

            {{ category }}
          </RouterLink>
        </div>
      </div>

      <div class="py-5 row">
        <div class="col-12 col-sm-auto">
          <h3>Filtrar por nombre: </h3>
        </div>
        <div class="col-12 col-sm-5">
          <input type="text" class="form-control" v-model="filtro">
        </div>
      </div>
      <div>
        <p>Cantidad productos: {{ cantidadTotal }}</p>
        <p v-if="cargando">Leyendo productos...</p>
        <p v-else-if="listaFiltrada.length === 0">No se encontraron productos.</p>
      </div>

      <div v-if="!cargando && listaFiltrada.length > 0">
        <div class="row justify-content-start g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
          <div class="col" v-for="producto in listaFiltrada" :key="producto.id">
            <ProductCard :producto />
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center py-4">
          <div>
            Página {{ paginaActual }} de {{ totalPages }}
          </div>
          <div>
            <button class="btn btn-secondary me-2" :disabled="paginaActual === 1"
              @click="productStore.prevPage()">Anterior</button>
            <button class="btn btn-primary" :disabled="!hasNextPage" @click="productStore.nextPage()">Siguiente</button>
          </div>
        </div>
      </div>

    </section>

  </main>
</template>

<script setup>
import HeaderComp from '@/components/HeaderComp.vue';
import ProductCard from '@/components/ProductCard.vue';
import { useProductsStore } from '@/stores/products.store';
import { onMounted, ref, computed, watch } from 'vue'

const productStore = useProductsStore();

const filtro = ref("");

const listaFiltrada = computed(() => {
  return productStore.productByName(filtro.value);
});

const cantidadTotal = computed(() => productStore.totalProducts);
const paginaActual = computed(() => productStore.currentPage);
const totalPages = computed(() => productStore.totalPages);
const hasNextPage = computed(() => productStore.hasNextPage);
const cargando = computed(() => productStore.isLoading);

onMounted(async () => {
  await productStore.fetchProducts();
});

watch(filtro, async () => {
  // Al cambiar el filtro, regresamos a la primera página y recargamos la consulta.
  await productStore.loadPage(1);
});
</script>

<style scoped></style>
