<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Imagen</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="producto in productos" :key="producto.id" class="align-middle">
                    <th scope="row">{{ producto.id }}</th>
                    <td>{{ producto.nombre }}</td>
                    <td>
                        <img :src="producto.imagen" :alt="producto.nombre">
                    </td>
                    <td>{{ producto.categoria }}</td>
                    <td>{{ producto.stock }}</td>
                    <td>{{ producto.precio }}</td>
                    <td>
                        <button class="btn btn-warning" @click="emit('modoEdicion', producto.id)">Editar</button>
                        <button class="btn btn-danger ms-1"
                            @click="eliminar(producto.id, producto.nombre)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import { useProductsStore } from '@/stores/products.store.js';
const productsStore = useProductsStore();

const emit = defineEmits(["modoEdicion"]);

defineProps(["productos"]);


const eliminar = async (id, nombre) => {
    try {

        if (confirm("Estás seguro que deseas eliminar el producto: " + nombre)) {
            let respuesta = await productsStore.deleteProduct(id);
            if (respuesta.error) {
                return alert(respuesta.error)
            }

            alert(respuesta.success);
        }

    } catch (error) {
        console.log(error);
    }
}

</script>

<style scoped>
.table img {
    width: 75px;
}
</style>