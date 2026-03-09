<template>
    <div>
        <HeaderComp>Página CRUD Productos</HeaderComp>
    </div>

    <main class="container">

        <section>
            <ProductsList v-if="productsStore.products.length > 0" :productos="productsStore.products" />
            <p v-else>No hay productor para mostrar...</p>
        </section>

    </main>
</template>

<script setup>
import HeaderComp from '@/components/HeaderComp.vue';
import { onMounted } from 'vue';
import { useProductsStore } from '@/stores/products.store.js';
import ProductsList from '@/components/ProductsList.vue';

const productsStore = useProductsStore();



onMounted(async () => {

    try {
        let respuesta = await productsStore.fetchProducts();

        if (respuesta.error) {
            return alert(respuesta.error);
        }

    } catch {

    }

});

</script>

<style scoped></style>