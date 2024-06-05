<script setup lang="ts">
import type { User } from "@prisma/client"
import { Dialog, Notify } from "quasar"
const props = defineProps<{
	data: User
	search: string
}>()

const emit = defineEmits(["update"])

const searchStates = ref({
	email: false,
})

const emailEl = computed(() => {
	const title = props.data.email

	const { html, isMatch } = highlightSearchTerm(title, props.search)
	searchStates.value.email = isMatch
	return html
})

const show = computed(() => {
	if (props.search === "") return true

	return searchStates.value.email
})

function deleteUser() {
	const dialogPromt = Dialog.create({
		title: "Slett ansatt",
		message: "Er du sikker på at du vil slette denne ansatte?",
		ok: {
			label: "Slett",
			color: "negative",
			unelevated: true,
		},
		cancel: {
			label: "Avbryt",
			color: "primary",
			unelevated: true,
		},
	})

	dialogPromt.onOk(async () => {
		const res = await serverFunction("slettAnsatt", { id: props.data.id })
		if (isServerError(res)) {
			Notify.create({
				message: "Kunne ikke slette ansatt",
				color: "negative",
			})
			return
		}

		Notify.create({
			message: "Ansatt slettet",
			color: "positive",
			timeout: 1000,
		})
		emit("update")
	})
}

const dialogEditUser = ref(false)
const dialogEditContent = ref({
	email: props.data.email,
	role: props.data.role,
})

const dialogRoleOption = ["Administrasjon", "Montor", "Salg"]

async function editUser() {
	const res = await serverFunction("oppdaterAnsatt", {
		id: props.data.id,
		email: dialogEditContent.value.email,
		role: dialogEditContent.value.role,
	})
	dialogEditUser.value = false

	if (isServerError(res)) {
		Notify.create({
			message: "Kunne ikke oppdatere ansatt",
			color: "negative",
		})
		return
	}

	Notify.create({
		message: "Ansatt oppdatert",
		color: "positive",
		timeout: 1000,
	})
	emit("update")
}

function editPassword() {
	const dialogPromt = Dialog.create({
		title: "Endre passord",
		message:
			"Endre passord for ansatt, passordet vil bli kryptert før det lagres i databasen.",
		prompt: {
			model: "",
		},
		ok: {
			label: "Lagre",
			color: "positive",
			unelevated: true,
		},
		cancel: {
			label: "Avbryt",
			color: "negative",
			unelevated: true,
		},
	})

	dialogPromt.onOk(async (data) => {
		const res = await serverFunction("oppdaterAnsattPassord", {
			id: props.data.id,
			password: data,
		})

		if (isServerError(res)) {
			Notify.create({
				message: "Kunne ikke oppdatere ansatt",
				color: "negative",
			})
			return
		}

		Notify.create({
			message: "Ansatt oppdatert",
			color: "positive",
			timeout: 1000,
		})
		emit("update")
	})
}
</script>

<template>
	<QCard
		v-show="show"
		flat
		class="bg-grey-9 row q-pa-sm items-center"
	>
		<div class="text-h6 underline-hover col-4" v-html="emailEl"></div>
		<div class="text-body1 text-grey-5 col-2">{{ data.role }}</div>
		<div class="text-body1 text-grey-5 col-3 ellipsis">
			{{ data.password }}
		</div>
		<div
			class="text-body1 text-grey-5 col-3 ellipsis justify-end row"
		>
			<QBtn flat icon="password" @click="editPassword">
				<QTooltip> Endre passord </QTooltip>
			</QBtn>
			<QBtn flat icon="edit" @click="dialogEditUser = true">
				<QTooltip> Endre bruker </QTooltip>
			</QBtn>
			<QBtn flat icon="delete" @click="deleteUser">
				<QTooltip> Slett bruker </QTooltip>
			</QBtn>
		</div>
	</QCard>
	<QDialog v-model="dialogEditUser">
		<QCard style="min-width: 400px">
			<QCardSection>
				<div class="text-h6">Oppdater ansatt</div>
				<div class="text-subtitle1">
					Endre email og rolle for ansatt.
				</div>
				<QInput v-model="dialogEditContent.email" />
				<QSelect
					v-model="dialogEditContent.role"
					:options="dialogRoleOption"
				/>
			</QCardSection>
			<QCardActions align="right">
				<QBtn
					label="Avbryt"
					color="negative"
					@click="dialogEditUser = false"
				/>
				<QBtn label="Lagre" color="positive" @click="editUser" />
			</QCardActions>
		</QCard>
	</QDialog>
</template>

<style scoped lang="scss"></style>
