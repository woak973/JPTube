<template>
    <div></div>
</template>

<script setup>

const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
    router.push({ path: '/search', query: { search_query: route.query.search_query } })
})
</script>