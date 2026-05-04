<script setup lang="ts">
import SaveButton from './SaveButton.vue';
import BeerCard from './BeerCard.vue';

import { useAuthStore } from '@/stores/authStore';

const emit = defineEmits(['updateBeersLiked']);
const props = defineProps(['beers'])
const authStore = useAuthStore();

async function likeBeer(bId: number, liked: boolean) {
    if (liked) {
        await fetch('/api/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({userName: authStore.user, beerId: bId})
        });
        emit('updateBeersLiked')
    } else {
        await fetch('/api/likes', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({userName: authStore.user, beerId: bId})
        });
        emit('updateBeersLiked')
    }
}

</script>

<template>
    <BeerCard v-for="beer in beers" class="beer" :key="beer.id">
        <div class="info">
            <h2>{{ beer.name }}</h2>
            <p><span style="font-weight: bolder;">Alcohol: </span>{{ beer.percentage }}%</p>
        </div>

        <SaveButton
            v-if="authStore.user"
            :beer="beer"
            @like-beer="likeBeer"
        />
    </BeerCard>
</template>

<style scoped>

p {
    color: white;
    background-color: chocolate;
    border-radius: 2rem;
    padding: 10px 15px;
    width: max-content;
    font-size: 18px;
}

section {
    display: flex;
    justify-content: space-between;

    background-color: bisque;
    padding: 15px;
    margin: 35px;
    border-radius: 2rem;

    width: 1000px;
}

.beer {
    display: flex;
    justify-content: space-between;
}

.beer-info {
    display: flex;
    flex-direction: column;
}

.info {
    display: flex;
    flex-direction: column;
    height: 100%;
}

@media screen and (max-width: 1175px) {
    section {
        width: 90%;
    }
}

</style>