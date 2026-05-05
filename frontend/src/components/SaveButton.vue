<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['beer']);
const emit = defineEmits(['likeBeer']);

const likedBeer = computed(() => props.beer.liked);

function likeBeer() {
    props.beer.liked = !props.beer.liked;
    emit('likeBeer', props.beer.id, props.beer.liked);
}

</script>

<template>
    <div
        class="current-beer"
        :class="{ liked: likedBeer }"
        @click="likeBeer"
    >
        ♥︎
    </div>

</template>

<style scoped>

.current-beer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: 125px;
    border-radius: 2rem;
    font-size: 35px;
    border: solid 2px chocolate;
}

.current-beer.liked {
    background-color: chocolate;
}

.current-beer:hover,
.current-beer:focus {
    cursor: pointer;
}

</style>