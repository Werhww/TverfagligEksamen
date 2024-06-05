import { FunctionNames, functions } from "@/server/server"

export default defineEventHandler(async (event) => {
    const operationName = event.context.params!.function as FunctionNames
    const operation = functions[operationName]

    if (!operation) return setResponseStatus(event, 404)

    const body = await readBody(event)

    if (!body) return setResponseStatus(event, 400)
    
    const status = await operation(body)
    if (typeof status === "number") return setResponseStatus(event, status)
    return status
})