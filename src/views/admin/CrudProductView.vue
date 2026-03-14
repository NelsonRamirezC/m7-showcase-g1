<template>
    <div>
        <HeaderComp>Página CRUD Productos</HeaderComp>
    </div>



    <main class="container">
        <section class="py-3">
            <form class="row justify-content-center w-50 mx-auto" @submit.prevent="createOrUpdate">
                <div class="col-12">
                    <label class="form-label">Nombre:</label>
                    <input type="text" class="form-control" required v-model="producto.nombre">
                </div>
                <div class="col-12">
                    <label class="form-label">Descripción:</label>
                    <textarea class="form-control" required v-model="producto.descripcion"></textarea>
                </div>
                <div class="col-6">
                    <label class="form-label">Precio:</label>
                    <input type="number" class="form-control" required v-model="producto.precio">
                </div>
                <div class="col-6">
                    <label class="form-label">Stock:</label>
                    <input type="number" class="form-control" required v-model="producto.stock">
                </div>
                <div class="col-6">
                    <label class="form-label">Imagen:</label>
                    <input type="url" class="form-control" name="image" required v-model="producto.imagen">
                </div>
                <div class="col-6">
                    <label class="form-label">Categoría:</label>
                    <select required class="form-control" v-model="producto.categoria">
                        <option value="">Seleccione una categoría</option>
                        <option :value="category" v-for="(category, index) in productsStore.categories" :key="index">{{
                            category }}</option>
                    </select>
                </div>
                <div class="py-3">
                    <button type="submit" class="btn btn-primary" v-if="!modoEdicion">Crear</button>
                    <button type="submit" class="btn btn-warning" v-if="modoEdicion">Editar</button>
                    <button type="submit" class="btn btn-secondary ms-1" @click="resetForm">Reset</button>
                </div>
            </form>

        </section>
        <section class="py-3">
            <h2 class="text-center">Listado de productos.</h2>
            <ProductsList v-if="productsStore.products.length > 0" :productos="productsStore.products"
                @modoEdicion="edicionProducto" />
            <p v-else>No hay productor para mostrar...</p>
        </section>

    </main>
</template>

<script setup>
import HeaderComp from '@/components/HeaderComp.vue';
import { onMounted, ref } from 'vue';
import { useProductsStore } from '@/stores/products.store.js';
import ProductsList from '@/components/ProductsList.vue';
import Swal from 'sweetalert2';

const productsStore = useProductsStore();

const producto = ref(
    {
        id: "",
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        imagen: "https://placehold.co/600x400",
        categoria: ""
    }
);

const modoEdicion = ref(false);

const resetForm = () => {

    producto.value.id = "";
    producto.value.nombre = "";
    producto.value.descripcion = "";
    producto.value.precio = 0;
    producto.value.stock = 0;
    producto.value.imagen = "https://placehold.co/600x400";
    producto.value.categoria = "";

    modoEdicion.value = false;

};


const create = async () => {
    try {

        let respuesta = await productsStore.createProduct({ ...producto.value });



        if (respuesta.error) {
            return alert(respuesta.error)
        };

        resetForm();
        alert(respuesta.success);

    } catch (error) {
        console.log(error);
    }
};


const edicionProducto = (id) => {
    modoEdicion.value = true;

    let productoStore = productsStore.products.find(p => p.id == id);

    producto.value.id = productoStore.id;
    producto.value.nombre = productoStore.nombre;
    producto.value.descripcion = productoStore.descripcion;
    producto.value.precio = productoStore.precio;
    producto.value.stock = productoStore.stock;
    producto.value.imagen = productoStore.imagen;
    producto.value.categoria = productoStore.categoria;
}

const update = async () => {
    try {

        Swal.fire({
            title: "Estás seguro que deseas a actualizar el producto",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            denyButtonText: `No actualizar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let respuesta = await productsStore.updateProduct({ ...producto.value });
                    Swal.fire(respuesta.success, "", "success");
                } catch (error) {
                    Swal.fire(respuesta.error, "", "error");
                } finally {
                    resetForm();
                }
            } else if (result.isDenied) {
                Swal.fire("No se realizaron los cambios.", "", "info");
            }
        });

    } catch (error) {
        console.log(error);
    }
}

const createOrUpdate = () => {

    if (modoEdicion.value) {
        update();
    } else {
        create();
    }

};


onMounted(async () => {

    try {
        let respuesta = await productsStore.fetchAllProducts();

        if (respuesta.error) {
            return alert(respuesta.error);
        }

    } catch {

    }

});

</script>

<style scoped></style>