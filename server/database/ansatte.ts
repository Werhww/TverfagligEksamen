import { Role } from "@prisma/client";
import { sha256 } from "~/server/utils/auth"
import { prisma } from "../server";


export async function hentAlleAnsatte(data: {}) {
    return await prisma.user.findMany()
}

export async function slettAnsatt(data: {id: number}) {
    return await prisma.user.delete({
        where: {
            id: data.id
        }
    })
}

export async function oppdaterAnsatt(data: {id: number, email: string, role: Role}) {
    return await prisma.user.update({
        where: {
            id: data.id
        },
        data: {
            email: data.email,
            role: data.role
        }
    })
}

export async function oppdaterAnsattPassord(data: {id: number, password: string}) {
    const hashPassword = sha256(data.password)

    return await prisma.user.update({
        where: {
            id: data.id
        },
        data: {
            password: hashPassword
        }
    })
}

