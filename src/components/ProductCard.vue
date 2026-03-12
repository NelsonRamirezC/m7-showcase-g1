<template>
    <div>
        <div class="card">
            <img :src="producto.imagen" class="card-img-top" :alt="producto.nombre">
            <div class="card-body">
                <h5 class="card-title">{{ producto.nombre }}</h5>
                <p class="card-text">{{ producto.descripcion }}</p>
                <p class="card-text">Precio: {{ producto.precio }}</p>
                <p class="card-text">Stock: {{ producto.stock }}</p>
                <p class="card-text">Categoría: {{ producto.categoria }}</p>
                <a href="#" class="btn btn-primary">Ver más</a>
            </div>
        </div>
    </div>
</template>

<script setup>

defineProps(["producto"]);

</script>

<style scoped>
.card-img-top {
    aspect-ratio: 3/2;
}

.card-body {
    min-height: 330px;
}
</style>