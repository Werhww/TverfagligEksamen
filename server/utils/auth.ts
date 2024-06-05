import { SignJWT, jwtVerify } from "jose"
import { createHash } from "crypto"
import "dotenv/config"

const key = new TextEncoder().encode(process.env.PASSWORD_SECRET)
export const expires = (days: number) => new Date(Date.now() + 1000 * 60 * 60 * days)

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires(7))
    .sign(key)
}

export async function decrypt(token: string): Promise<any> {
    const { payload } = await jwtVerify(token, key, { 
        algorithms: ["HS256"]
    })
    return payload
}

export function sha256(string: string) {
    return createHash('sha256').update(string).digest('hex')
}