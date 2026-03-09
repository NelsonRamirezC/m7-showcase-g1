<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container">
                <a class="navbar-brand" href="#">Product ShowCase</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav ms-auto">
                        <RouterLink to="/" class="nav-link">Home</RouterLink>

                        <RouterLink :to="{ name: 'crud-products' }" class="nav-link">Crud productos</RouterLink>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script setup>

</script>

<style scoped></style>