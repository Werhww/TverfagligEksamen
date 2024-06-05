import { decrypt, encrypt, expires } from "../utils/auth"

export default defineEventHandler(async (event) => {
    const session = getCookie(event, "Authorization")
    if (session) {
        const parsed = await decrypt(session).catch(() => null)
        if (parsed == null) {
            setCookie(event, "Authorization", "", { expires: new Date() })
            setCookie(event, "LoggedIn", "", { expires: new Date() })
        }
        setCookie(event, "Authorization", await encrypt(parsed), { expires: expires(7), httpOnly: true })
    }
})