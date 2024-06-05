export default defineEventHandler(async (event) => {
    setCookie(event, "Authorization", "", { expires: new Date(0), httpOnly: true })
    setCookie(event, "LoggedIn", "", { expires: new Date(0) })
})