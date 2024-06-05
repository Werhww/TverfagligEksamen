<script setup lang="ts">
import type { Article } from "@prisma/client"

const props = defineProps<{
	data: Article
	search: string
}>()

const searchStates = ref({
	name: false,
	path: false,
})

const titleEl = computed(() => {
	const title = props.data.title

	const { html, isMatch } = highlightSearchTerm(title, props.search)
	searchStates.value.name = isMatch
	return html
})

const contentEl = computed(() => {
	const content = props.data.content
	const cleanContent = removeHtmlTags(content)
	const length = 200
	const trimmedContent =
		cleanContent.length > length
			? cleanContent.substring(0, length - 3) + "..."
			: cleanContent

	const { isMatch } = highlightSearchTerm(cleanContent, props.search)
	const { html } = highlightSearchTerm(trimmedContent, props.search)
	searchStates.value.path = isMatch
	return html
})

function removeHtmlTags(input: string) {
	return input.replace(/<[^>]*>/g, "")
}

const show = computed(() => {
	if (props.search === "") return true

	return searchStates.value.name || searchStates.value.path
})
</script>

<template>
	<QCard v-show="show" flat class="desktop-only">
		<div
			class="text-h3 underline-hover"
			v-html="titleEl"
			@click="useRouter().push(`/artikkel/id-${data.id}`)"
		></div>
		<div class="text-undertitle text-grey-6 q-gutter-x-md row">
			<span>Opprettet {{ timeSince(data.createdAt) }}</span
			><span v-if="data.updatedAt !== data.createdAt"
				>Sist endret {{ timeSince(data.updatedAt) }}</span
			>
			<span>Visninger {{ data.views }}</span>
		</div>
		<div class="text-body1 text-grey-6" v-html="contentEl"></div>
	</QCard>
	<QCard v-show="show" flat class="mobile-only">
		<div
			class="text-h6"
			v-html="titleEl"
			@click="useRouter().push(`/artikkel/id-${data.id}`)"
		></div>
		<div class="text-undertitle text-grey-6 q-gutter-x-md row">
			<span>Opprettet {{ timeSince(data.createdAt) }}</span
			><span v-if="data.updatedAt !== data.createdAt"
				>Sist endret {{ timeSince(data.updatedAt) }}</span
			>
			<span>Visninger {{ data.views }}</span>
		</div>
		<div
			class="text-body2 text-grey-6 text-weight-bold ellipsis-2-lines"
			v-html="contentEl"
		></div>
	</QCard>
</template>

<style scoped lang="scss">
.underline-hover {
	cursor: pointer;
	transition: all 0.3s;
	&:hover {
		text-decoration: underline;
	}
}
</style>
