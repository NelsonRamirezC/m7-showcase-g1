<template>

    <HeaderComp>Categoría: {{ props.category }}</HeaderComp>

    <main class="container py-3">

        <section>
            <div class="d-flex justify-content-end">
                <button class="btn btn-primary" @click="atras">Volver atrás</button>
            </div>

            <div class="row justify-content-start g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"
                v-if="productStore.productsByCategory(props.category).length > 0">
                <div class="col" v-for="producto in productStore.productsByCategory(props.category)">
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
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';

const props = defineProps(["category"]);
const router = useRouter();


const productStore = useProductsStore();


const atras = () => {
    router.go(-1);
};



onMounted(async () => {
    await productStore.fetchProducts();
});

</script>

<style scoped></style>
