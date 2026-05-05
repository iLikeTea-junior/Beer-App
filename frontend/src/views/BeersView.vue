<script setup lang="ts">
import FooterTabs from '@/components/FooterTabs.vue';
import BeerList from '@/components/BeerList.vue';

import { useAuthStore } from '@/stores/authStore';
import { type Beers } from '@/types';

import { computed, onMounted, onUnmounted, ref } from 'vue';

const authStore = useAuthStore();
let evtSource: EventSource | null = null

const user = computed(() => {
    const userName = authStore.getUserName;
    if (userName) return userName[0]?.toUpperCase() + userName.slice(1);
});

const beerList = ref<Beers[]>([])
onMounted(async () => {

    evtSource = new EventSource('http://localhost:3000/events');

    evtSource.addEventListener('like', (event) => {
        const data = JSON.parse(event.data)
        if (authStore.user !== data.userName) {
            alert(`${data.userName} liked ${data.beer}!`)
        }
    })

    evtSource.addEventListener('new-beer', (event) => {
        const data = JSON.parse(event.data)
        beerList.value.push(data.newBeer)
    })

    try {
        const res = await fetch('/api/beers');
        const beers = await res.json();

        if (authStore.user) {
            const res = await fetch(`/api/likes/${authStore.user}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            const likedBeers = await res.json();
            beerList.value = newListWithLikes(beers, likedBeers.map((b: Beers) => b.id));
        } else {
            beerList.value = beers;
        }
    } catch(err) {
        console.log('Could not retrieve beers', err);
    }
})

onUnmounted(() => {
    if (evtSource) {
        evtSource.close();
        evtSource = null;
    }
})

function newListWithLikes(allBeers: Beers[], likedBeersId: number[]) {
    return allBeers.map(beer => ({
        ...beer,
        liked: likedBeersId.includes(beer.id)
    }));
}

</script>

<template>
    <div class="page">
        <header>
            <h1>Beers</h1>
            <h1 v-if="user">{{ user }}</h1>
        </header>
    
        <main class="main-content">
            <BeerList :beers="beerList"/>
        </main>
    
        <FooterTabs/>
    </div>
</template>

<style scoped>

header {
    display: flex;
    justify-content: space-between;

    background-color: burlywood;
    padding: 15px;
}

.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.main-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: center;
}

</style>