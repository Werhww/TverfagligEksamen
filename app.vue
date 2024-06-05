<script setup>
import { useStorage } from "@vueuse/core"

const search = useStorage("search", "")
const userRole = useStorage("Role", undefined)
const loggedIn = computed(() => {
	return userRole.value !== undefined
})

const { width } = useWindowSize()

const drawerOpen = computed(() => {
	if (width.value < 1000) return false
	return loggedIn.value
})

function logout() {
	$fetch("/api/auth/logout")
	userRole.value = undefined
}

onMounted(async () => {
	const res = await $fetch("/api/auth/decrypt")
	if (isServerError(res)) {
		userRole.value = undefined
		return
	}

	if (res.status === 400) {
		userRole.value = undefined
		return
	}

	userRole.value = res.role
	search.value = ""
})

const showFor = {
	admin: ["Administrasjon"],
	montor: ["Montor"],
	selger: ["Salg"],
	all: ["Administrasjon", "Montor", "Salg"],
	less: ["Montor", "Salg"],
}
</script>

<template>
	<QLayout view="hHh lpR lFf">
		<QHeader>
			<QToolbar class="row justify-between q-pl-none">
				<QToolbarTitle
					class="q-ml-md text-h4 cursor-pointer desktop-only"
					@click="useRouter().push('/')"
					>Solcellespesialisten</QToolbarTitle
				>
				<QInput
					class="desktop-only"
					v-model="search"
					standout
					rounded
					dense
					placeholder="search...."
				>
					<template v-slot:append>
						<QIcon name="search" />
					</template>
				</QInput>
				<QBtn
					v-if="loggedIn"
					icon="logout"
					flat
					round
					class="q-ml-md desktop-only"
					@click="logout"
					to="/"
				>
					<QTooltip> Logg ut </QTooltip>
				</QBtn>
				<QBtn
					v-else
					to="/login"
					icon="login"
					flat
					round
					class="q-ml-md desktop-only"
				>
					<QTooltip> Logg inn </QTooltip>
				</QBtn>

				<QToolbarTitle class="mobile-only">
					<div class="column items-start">
						<div class="text-h4" @click="useRouter().push('/')">
							Solcellespesialisten
						</div>
						<div class="row justify-between full-width">
							<QInput
								class="mobile-only"
								v-model="search"
								borderless
								dense
								placeholder="search...."
							>
								<template v-slot:prepend>
									<QIcon name="search" />
								</template>
							</QInput>
						</div>
					</div>
				</QToolbarTitle>

			</QToolbar>
		</QHeader>

		<QDrawer v-model="drawerOpen" side="left">
			<QList padding separator>
				<DrawerItem
					text="Ny artikkel"
					icon="sym_r_newsmode"
					to="/artikkel/ny"
					:show-for="showFor.all"
					:user-role="userRole"
				/>
				<DrawerItem
					text="Artikkel oversikt"
					icon="sym_r_view_agenda"
					to="/artikkel/oversikt"
					:show-for="showFor.admin"
					:user-role="userRole"
				/>
				<DrawerItem
					text="Ansatte"
					icon="sym_r_person"
					to="/ansatte"
					:show-for="showFor.admin"
					:user-role="userRole"
				/>
			</QList>
		</QDrawer>

		<QPageContainer>
			<NuxtPage />
		</QPageContainer>
	</QLayout>
</template>
