import { prisma } from "~/server/server"
import { sha256 } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	if (!body) return setResponseStatus(event, 400)

	const user = await prisma.user.findUnique({
		where: {
			email: body.email,
		},
	})

	if (user) return { status: 409, msg: "User already exists" }
	const hashPassword = sha256(body.password)

	const newUser = await prisma.user.create({
		data: {
			email: body.email,
			password: hashPassword,
			role: body.role,
		},
	}).catch(() => null)
	if(!newUser) return { status: 500, msg: "Internal server error"}
	return { status: 201, msg: "User created"}
})
