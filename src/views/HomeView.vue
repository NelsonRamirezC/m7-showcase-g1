<template>

  <HeaderComp>Página Home</HeaderComp>

  <main class="container py-3">

    <section>
      <h2 class="text-center">Nuestros productos...</h2>


      <div class="row justify-content-start g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4" v-if="productStore.products.length > 0">
        <div class="col" v-for="producto in productStore.products">
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
import { onMounted } from 'vue'

const productStore = useProductsStore();


onMounted(async () => {
  await productStore.fetchProducts();
});

</script>

<style scoped></style>
