<script setup lang="ts">
import BeerButton from './BeerButton.vue';

</script>


<template>
    <footer class="tab-buttons">
        <router-link :to="{name: 'beers'}">
            <BeerButton type="submit">Beers</BeerButton>
        </router-link>

        <router-link :to="{name: 'profile'}">
            <BeerButton type="submit">Profile</BeerButton>
        </router-link>
    </footer>
</template>

<style scoped>

.tab-buttons {
    display: flex;
    justify-content: space-around;
    
    border-top: double 5px chocolate;
    position: sticky;
    bottom: 0;
    width: 100%;
    background-color: burlywood;

    padding: 10px;
    color: black;
}

</style>