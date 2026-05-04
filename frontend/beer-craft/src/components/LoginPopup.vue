<script setup lang="ts">
import BeerButton from './BeerButton.vue';
import BeerBox from './BeerBox.vue';

import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// if the user is not recognized, remember to show a error message on the page.

const router = useRouter();

const authStore = useAuthStore();
const name = ref<string>('');
const password = ref<string>('');

const errorMessage = ref('');

async function Login() {
    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName: name.value, password: password.value })
        });
        
        const body = await res.json();

        if (body.error) {
            errorMessage.value = body.error;
            return;
        }

        authStore.login(name.value, body.auth);
        clearInp();
        router.push({ name: 'beers' });
    } catch(err) {
        console.log('could not find user', err)
    }
}

function clearInp() {
    name.value = '';
    password.value = '';
}

</script>

<template>
    <BeerBox v-if="!authStore.user">
        <h2>Login</h2>

        <form @submit.prevent='Login'>
            <div class="inp-boxes">
                <label>Username:</label>
                <input type="text" v-model="name"/>
            </div>
    
            <div class="inp-boxes">
                <label>Password:</label>
                <input type="password" v-model="password"/>
            </div>

            <p v-if="errorMessage" style="color: red; font-weight: bold">{{ errorMessage }}</p>
            <BeerButton type="submit">Login</BeerButton>
        </form>
    </BeerBox>
</template>

<style scoped>

</style>