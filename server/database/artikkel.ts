import { prisma } from "../server";

export async function lagArtikkel(data: { title: string, content: string}) {
    return await prisma.article.create({
        data: data
    })
}

export async function endreArtikkel(data: { title: string, content: string, id: number }) {
    return await prisma.article.update({
        where: { id: data.id },
        data: data
    })
}

export async function slettArtikkel(data: { id: number }) {
    return await prisma.article.delete({
        where: data
    })

}

export async function nyVisningAvArtikkel(data: { id:number }) {
    return await prisma.article.update({
        where: { id: data.id },
        data: {
            views: {
                increment: 1
            }
        }
    })
}

export async function hentArtikkel(data: { id: number }) {
    return await prisma.article.findUnique({
        where: data
    })
}

export async function hentAlleArtikler(data: {}) {
    return await prisma.article.findMany()
}