<template>
    <header-comp>Nuestra historia</header-comp>

    <v-container>
        <v-timeline side="end">
            <v-timeline-item v-for="item in items.reverse()" :key="item.id" :dot-color="item.color" size="small">
                <v-alert :color="item.color" :icon="item.icon" :value="true">
                    {{ item.message }}
                </v-alert>
            </v-timeline-item>
        </v-timeline>
    </v-container>
</template>

<script setup>
import HeaderComp from '@/components/HeaderComp.vue';


const items = [
    {
        id: 1,
        color: 'info',
        icon: 'mdi-information',
        message: "2000: texto 1 ..."
    },
    {
        id: 2,
        color: 'error',
        icon: 'mdi-pen-plus',
        message: "2001: texto 2 ..."
    },
    {
        id: 3,
        color: 'success',
        icon: 'mdi-eye-plus',
        message: "2003: texto 3 ..."
    },

]


</script>

<style lang="css" scoped></style>