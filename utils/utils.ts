import type { FunctionNames, Functions } from "@/server/server"

export type ServerFunctionResult<T extends FunctionNames> =
	| Awaited<ReturnType<Functions[T]>>
	| number
export type NoServerFunctionErrors<T> = T extends number ? never : T

export async function serverFunction<T extends FunctionNames>(
	operation: T,
	data: Parameters<Functions[T]>[0]
): Promise<ServerFunctionResult<T>> {
	const returned = await fetch(`/api/function/${operation as string}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify(data),
	})

	if (!returned.ok) {
		return returned.status as ServerFunctionResult<T>
	}

	const returnedData = await returned?.json()

	return returnedData as ServerFunctionResult<T>
}

export function isServerError<T>(data: T | number): data is number {
	return typeof data === "number"
}

export function highlightSearchTerm(text: string, searchTerm: string) {
	const normalizedTitle = String(text).toLowerCase()
	const normalizedSearchTerm = String(searchTerm).toLowerCase()

	const startIndex = normalizedTitle.indexOf(normalizedSearchTerm)

	if (startIndex === -1) {
		return {
			html: text,
			isMatch: false,
		}
	}

	const before = text.substr(0, startIndex)
	const match = text.substr(startIndex, searchTerm.length)
	const after = text.substr(startIndex + searchTerm.length)

	return {
		html:
			before +
			'<span class="bg-yellow-7 text-black">' +
			match +
			"</span>" +
			after,
		isMatch: true,
	}
}

export function timeSince(dateString: Date) {
    const date = new Date(dateString)
    const today = new Date()
    const diff = today.getTime() - date.getTime()

    if (diff < 1000 * 60) return "just now"
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))} minutes ago`
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))} hours ago`
    if (diff < 1000 * 60 * 60 * 24 * 7) return `${Math.floor(diff / (1000 * 60 * 60 * 24))} days ago`
    if (diff < 1000 * 60 * 60 * 24 * 30) return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 7))} weeks ago`
    if (diff < 1000 * 60 * 60 * 24 * 365) return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))} months ago`
    return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365))} years ago`
}