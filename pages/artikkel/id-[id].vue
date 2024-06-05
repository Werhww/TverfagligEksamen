<script setup lang="ts">
const route = useRoute()

const title = ref("")
const content = ref("")
const views = ref(0)

onMounted(async () => {
	const id = Number(route.params.id)

    if(isNaN(id)) {
        Notify.create({
            message: 'Ugyldig artikkel-id',
            color: 'negative',
            position: 'top'
        })
        return
    }

	const res = await serverFunction("hentArtikkel", {
		id: id,
	})
	if (isServerError(res)) {
		Notify.create({
			message: "Feil ved henting av artikkel: " + res,
			color: "negative",
			position: "top",
		})
		return
	}

    if(res == null) {
        Notify.create({
            message: 'Fant ikke artikkel',
            color: 'negative',
            position: 'top'
        })
        return
    }

    serverFunction("nyVisningAvArtikkel", { id })
	title.value = res.title
	content.value = res.content
    views.value = res.views
})
</script>

<template>
<div class="q-px-xl q-mx-xl q-gutter-y-xs desktop-only">
    <div class="text-h2">{{ title }}</div>
    <div class="text-underline text-grey-5">Visninger {{ views }}</div>
	<div v-html="content"></div>
</div>
<div class="q-px-md q-gutter-y-xs mobile-only">
    <div class="text-h5">{{ title }}</div>
    <div class="text-underline text-grey-6 text-weight-bold">Visninger {{ views }}</div>
	<div v-html="content" class="text-grey-5"></div>
</div>
</template>

<style scoped lang="scss"></style>
