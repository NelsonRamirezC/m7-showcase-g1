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
        <p>Cantidad productos: </p>
      </div>
      <div class="row justify-content-start g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"
        v-if="listaFiltrada.length > 0">
        <div class="col" v-for="producto in listaFiltrada">
          <ProductCard :producto />
        </div>
      </div>

      <div v-else>
        <p>Leyendo productos...</p>
      </div>

    </section>

  </main>
</template>

<script setup>
import HeaderComp from '@/components/HeaderComp.vue';
import ProductCard from '@/components/ProductCard.vue';
import { useProductsStore } from '@/stores/products.store';
import { onMounted, ref, computed } from 'vue'

const productStore = useProductsStore();

const filtro = ref("");


const listaFiltrada = computed(() => {
  return productStore.productByName(filtro.value);
});


onMounted(async () => {
  await productStore.fetchProducts();
});

</script>

<style scoped></style>
