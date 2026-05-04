
<template>
    <div class="box">
        <slot/>
    </div>

</template>

<style scoped>

.box {
    display: flex;
    flex-direction: column;
    padding: 15px;
    background-color: blanchedalmond;
    border-radius: 8px;
    border: solid 3px darkgoldenrod;
}

</style>