<script setup lang="ts">
import type { User } from "@prisma/client"
import { useStorage } from "@vueuse/core"
import { Notify } from "quasar"

const users = ref<User[]>([])
const search = useStorage("search", "")

const newUserDialog = ref(false)
const dialogRoleOption = ["Administrasjon", "Montor", "Salg"]
const newUserContent = ref({
	email: "",
    password: "",
	role: dialogRoleOption[0],
})

async function refreshData() {
    const res = await serverFunction("hentAlleAnsatte", {})
	if (isServerError(res)) return

	users.value = res
}

async function createNewUser() {
    newUserDialog.value = false

    const res = await $fetch("/api/auth/newUser", {
        method: "POST",
        body: JSON.stringify(newUserContent.value),
    })

    if(res.status !== 201) {
        Notify.create({
            message: `Kunne ikke opprette ny ansatt, server beskjed: ${res.msg}`,
            color: "negative",
        })
        return
    }

    Notify.create({
        message: "Ny ansatt opprettet",
        color: "positive",
        timeout: 1000,
    })
    refreshData()

    newUserContent.value = {
        email: "",
        password: "",
        role: dialogRoleOption[0],
    }
}

onMounted(() => {
	refreshData()
})
</script>

<template>
	<div class="q-gutter-y-md q-px-xl q-mx-xl">
        
		<QCard flat class="row">
			<div class="text-h6 underline-hover col-4" >Epost</div>
			<div class="text-body1 text-grey-5 col-2">Rolle</div>
			<div class="text-body1 text-grey-5 col-3">Kryptert passord</div>
			<div class="text-body1 text-grey-5 col-3" style="text-align: end;">Handligner</div>
		</QCard>

        <QCard
            flat
            class="row q-pa-sm items-center justify-center cursor-pointer hover-actions"
            @click="newUserDialog = true"
	    >
            <QIcon name="add" />
            <QTooltip>Legg til ansatt</QTooltip>
	    </QCard>

		<UserCard v-for="user in users" :data="user" :search="search" @update="refreshData"  />
	</div>

    <QDialog
        v-model="newUserDialog"
    >
        <QCard style="min-width: 400px">
			<QCardSection>
				<div class="text-h6">Opprett ny ansatt</div>
				<QInput v-model="newUserContent.email" label="Epost" />
				<QInput v-model="newUserContent.password" label="Passord" />
				<QSelect
                    label="Rolle"
					v-model="newUserContent.role"
					:options="dialogRoleOption"
				/>
			</QCardSection>
			<QCardActions align="right">
				<QBtn
					label="Avbryt"
					color="negative"
					@click="newUserDialog = false"
				/>
				<QBtn label="Opprett" color="positive" @click="createNewUser" />
			</QCardActions>
		</QCard>
    </QDialog>
</template>

<style scoped lang="scss">
.hover-actions {
    background-color: #212121 ;
    transition: background-color 300ms ease-in-out;
    &:hover {
        background-color: #424242 ;
    }
}
</style>
