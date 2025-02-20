<template>
    <div></div>
</template>

<script setup>

const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
    const searchQuery = route.query.search_query
    router.push({ path: `/search/${searchQuery}` })
})
</script>