import { encrypt } from "~/server/utils/auth"
import { prisma } from "~/server/server"
import { expires } from "~/server/utils/auth"
import { sha256 } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
    console.log("login")
    const body = await readBody(event)
    if (!body) return setResponseStatus(event, 400)
    const hashPassword = sha256(body.password)
    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })

    if (!user) return { status: 404, msg: "Wrong email", role: "undefined" }
    if (user?.password !== hashPassword) return { status: 401, msg: "Wrong password", role: "undefined" }

    const session = await encrypt({ id: user?.id, expires: expires(7), role: user.role })

    setCookie(event, "Authorization", session, { expires: expires(7), httpOnly: true })
    setCookie(event, "LoggedIn", "True", { expires: expires(7) })
    return { status: 200, msg: "Success", role: user.role}
})