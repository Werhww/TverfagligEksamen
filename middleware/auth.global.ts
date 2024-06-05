import type { Role } from "@prisma/client"

type Path = string | RegExp
const otherPages: otherPaths = {
	Administrasjon: [
		"/artikkel/ny",
		"/artikkel/oversikt",
		/\/artikkel\/endre-\d+/,
		"/ansatte"
	],
	Montor: ["/artikkel/ny"],
	Salg: ["/artikkel/ny"],
}

const noAuthPages: Path[] = ["/login", "/", /\/artikkel\/id-\d+/]

type otherPaths = {
	Administrasjon: Path[]
	Montor: Path[]
	Salg: Path[]
}

export default defineNuxtRouteMiddleware(async (to, from) => {
	// Stops running on server-side
	if (process.server) return
	// If the page does not require authentication, return
	const noAuthCheck = noAuthPages.find((path) => {
		if (typeof path === "string") {
			return to.path === path
		}
		return path.test(to.path)
	})

	if (noAuthCheck) return

	// Fetch the user role
	const res = (await $fetch("/api/auth/decrypt")) as {
		status: number
		msg: string
		role: Role
	}
	if (res.status !== 200) return navigateTo("/login")
	const allowedRoutes = otherPages[res.role]

	// If the user is not allowed to access the page, redirect to the home page

	const fromNoAuthCheck = noAuthPages.find((path) => {
		if (typeof path === "string") {
			return from.path === path
		}
		return path.test(from.path)
	})

	if (!fromNoAuthCheck) {
		const fromAuthCheck = allowedRoutes.find((path) => {
			if (typeof path === "string") {
				return from.path === path
			}
			return path.test(from.path)
		})

		if (!fromAuthCheck) {
			return navigateTo("/")
		}
	}

	const toAuthCheck = allowedRoutes.find((path) => {
		if (typeof path === "string") {
			return to.path === path
		}
		return path.test(to.path)
	})

	if (!toAuthCheck) {
		console.log("Not allowed abourt")
		return abortNavigation()
	}
})
