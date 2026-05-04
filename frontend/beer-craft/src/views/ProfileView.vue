<script setup lang="ts">
import FooterTabs from '@/components/FooterTabs.vue';
import LoginPopup from '@/components/LoginPopup.vue';
import BeerCard from '@/components/BeerCard.vue';
import BeerList from '@/components/BeerList.vue';

import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import type { Beers } from '@/types';

const authStore = useAuthStore()
const user = computed(() => {
    const userName = authStore.getUserName;
    if (userName) return userName[0]?.toUpperCase() + userName.slice(1);
});

const likedBeers = ref<Beers[]>();

async function getLikedBeers() {
    if (authStore.user) {
        try {
            const res = await fetch(`/api/likes/${authStore.user}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            const result = await res.json();
            likedBeers.value = result.map((b:Beers) => ({...b, liked: true}))
        } catch(err) {
            console.log("Something went wrong", err);
        }
    }
}

onMounted(async () => {
    getLikedBeers();
})

</script>

<template>
    <div class="page">
        <header>
            <h1>Profile</h1>
            <h1 v-if="user">{{ user }}</h1>
        </header>
    
        <main v-if="!authStore.user" class="login">
            <LoginPopup/>
        </main>

        <section class="profile" v-else>
            <BeerCard>
                <h2>Welcome Back!</h2>
                <p>Here you'll find your favorite beers.</p>
            </BeerCard>
        </section>

        <hr v-if="user">

        <section class="beer-list" v-if="user">
            <BeerList
                :beers="likedBeers"
                @update-beers-liked="getLikedBeers"
            />
            <h2 style="color: chocolate" v-if="likedBeers?.length === 0">
                There are currently no beers liked :(
            </h2>
        </section>

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

hr {
    width: 90%;
    background-color: chocolate;
    height: 5px;
    border-radius: 2rem;
}

.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.login {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.profile {
    display: flex;
    justify-content: center;
}

.beer-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>