import { PrismaClient } from "@prisma/client"


import * as artikkel_ from "./database/artikkel"
import * as ansatte_ from "./database/ansatte"

export const prisma = new PrismaClient()

export const functions = { ...artikkel_, ...ansatte_ }

export type Functions = typeof functions
export type FunctionNames = keyof Functions 