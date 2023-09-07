<script setup>

const props = defineProps(['propBoolean'])

</script>
<template>
    <div>
        <div>TEST COMPONENT:</div>
         {{ props.propBoolean }}
    </div>
</template>