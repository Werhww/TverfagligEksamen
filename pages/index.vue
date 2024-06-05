<script setup lang="ts">
import { useStorage } from "@vueuse/core"
import type { Article } from '@prisma/client';

const search = useStorage("search", "")
const articals = ref<Article[]>([])

onMounted(async () => {
	const res = await serverFunction("hentAlleArtikler", {})
	if (isServerError(res)) return

	articals.value = res
    search.value = ""
})
</script>

<template>
	<div class="q-gutter-y-md q-px-xl q-mx-xl desktop-only">
		<MainArticle
			v-for="artical in articals"
			:key="artical.id"
			:data="artical"
			:search="search"
		/>
	</div>

	<div class="q-gutter-y-md q-px-md mobile-only">
		<MainArticle
			v-for="artical in articals"
			:key="artical.id"
			:data="artical"
			:search="search"
		/>
	</div>
</template>

<style scoped lang="scss"></style>
