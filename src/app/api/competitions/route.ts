import db from "@/db"
import { competitions } from "@/db/schema"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function POST(request: Request) {
    const data = await request.json()

    const schema = z.object({
        formalName: z.string(),
        informalName: z.string().optional(),
        code: z.string(),
        type: z.string(),
        emblem: z.string().optional(),
    })

    const { error } = schema.safeParse(data)
    if (error) return NextResponse.json({ error }, { status: 400 })

    await db.insert(competitions).values(
        data
    )
    return NextResponse.json({
        formName: data.formalName,
        informalName: data.informalName,
        code: data.code,
        type: data.type,
        emblem: data.emblem,
    }, {
        status: 200
    })
}

export async function GET(request: Request) {
    const data = await db.select().from(competitions)

    return NextResponse.json({ data }, {
        status: 200
    })
}