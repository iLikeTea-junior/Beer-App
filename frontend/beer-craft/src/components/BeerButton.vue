<script setup lang="ts">

interface Props {
    type?: 'button' | 'submit' | 'reset'
}

const props = defineProps<Props>()

</script>

<template>
    <div class="login">
        <button :type="props.type">
            <slot/>
        </button>
    </div>
</template>

<style scoped>

button {
    padding: 10px 15px;
    font-size: 18px;
    background-color: chocolate;
    color: white;
    border-radius: 10px;
    font-weight: 700;
    border: none;
}

button:hover,
button:focus {
    cursor: pointer;
}

.login {
    display: flex;
    justify-content: center;
    padding: 15px;
}

</style>