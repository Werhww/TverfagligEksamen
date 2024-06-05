<script setup lang="ts">
import { Notify, Dialog } from "quasar"
const router = useRouter()
const route = useRoute()

const id = Number(route.params.id)

const title = ref("")
const content = ref("")

async function editArticle() {
	if (title.value == "") {
		Notify.create({
			message: "Artikkelen må ha en tittel",
			color: "negative",
			position: "top",
		})
		return
	}

	if (content.value == "") {
		Notify.create({
			message: "Artikkelen må ha innhold",
			color: "negative",
			position: "top",
		})
		return
	}

	const res = await serverFunction("endreArtikkel", {
		title: title.value,
		content: content.value,
		id: id,
	})

	if (isServerError(res)) {
		Notify.create({
			message: "Feil ved oppretting av artikkel: " + res,
			color: "negative",
			position: "top",
		})
		return
	}

	router.push(`/artikkel/id-${res.id}`)
}

async function deleteArticle() {
	const deleteDialog = Dialog.create({
		title: "Slett artikkel",
		message: "Artikkelen vil bli slettet permanent. Er du sikker?",
		persistent: true,
        cancel: true,
	})

    deleteDialog.onCancel(() => {})

	deleteDialog.onOk(async () => {
		const res = await serverFunction("slettArtikkel", {
			id: id,
		})

		if (isServerError(res)) {
			Notify.create({
				message: "Feil ved sletting av artikkel: " + res,
				color: "negative",
				position: "top",
			})
			return
		}

		router.push("/artikkel/oversikt")
	})
}

onMounted(async () => {
	if (isNaN(id)) {
		Notify.create({
			message: "Ugyldig artikkel-id",
			color: "negative",
			position: "top",
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

	if (res == null) {
		Notify.create({
			message: "Fant ikke artikkel",
			color: "negative",
			position: "top",
		})
		return
	}

	title.value = res.title
	content.value = res.content
})
</script>

<template>
	<div class="q-px-xl q-mx-xl q-gutter-y-xs">
		<div class="row justify-between items-end q-gutter-x-sm">
			<QInput
				v-model="title"
				placeholder="Uten navn"
				input-class="text-h2"
				borderless
				class="col"
			/>
			<QBtn
				size="lg"
				icon="sym_r_delete_forever"
				flat
                dense
				round
				@click="deleteArticle"
			>
                <QTooltip>Slett artikkel</QTooltip>
			</QBtn>
			<QBtn
				size="lg"
				icon-right="arrow_forward"
				flat
				rounded
				@click="editArticle"
			>
				Oppdater
			</QBtn>
		</div>
		<QEditor
			placeholder="Skriv noe..."
			v-model="content"
			:definitions="{
				bold: {
					label: 'Bold',
					icon: undefined,
					tip: 'My bold tooltip',
				},
			}"
			dark
			toolbar-rounded
			toolbar-toggle-color="grey-8"
			:toolbar="[
				[
					{
						label: $q.lang.editor.formatting,
						icon: $q.iconSet.editor.formatting,
						list: 'no-icons',
						options: ['h5', 'h6', 'p'],
					},
					{
						label: $q.lang.editor.align,
						icon: $q.iconSet.editor.align,
						fixedLabel: true,
						list: 'only-icons',
						options: ['left', 'center', 'right', 'justify'],
					},
				],
				[
					'bold',
					'italic',
					'strike',
					'underline',
					'hr',
					'link',
					'removeFormat',
				],
				['unordered', 'ordered'],
			]"
			flat
		/>
	</div>
</template>

<style scoped lang="scss"></style>
