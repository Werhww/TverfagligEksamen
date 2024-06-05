<script setup lang="ts">
import { useStorage } from "@vueuse/core"

const search = useStorage("search", "")
const articals = ref()

onMounted(async () => {
	const res = await serverFunction("hentAlleArtikler", {})
	if (isServerError(res)) return

	articals.value = res
})
</script>

<template>
<div class="q-px-xl q-mx-xl crasyGrid">
    <OverviewArticle
        v-for="artical in articals"
        :key="artical.id"
        :data="artical"
        :search="search"
    />
</div>
</template>

<style scoped lang="scss">
.crasyGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1rem;
}
</style>