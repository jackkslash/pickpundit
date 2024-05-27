"use server"

import db from "@/db"
import { competitions, teams } from "@/db/schema"
import { revalidatePath } from "next/cache"


export async function SubmitComp(formData: FormData) {
    const leagueData = {
        formalName: formData.get("formalName") as string,
        informalName: formData.get("informalName") as string,
        code: formData.get("code") as string,
        type: formData.get("type") as string,
        emblem: formData.get("emblem") as string,
    }

    await db.insert(competitions).values(
        leagueData
    )

    revalidatePath("/dashboard")
}

export async function SubmitTeam(formData: FormData) {
    const teamData = {
        name: formData.get("name") as string,
        shortName: formData.get("shortName") as string,
        tla: formData.get("tla") as string,
        crest: formData.get("crest") as string,
        addres: formData.get("addres") as string,
        website: formData.get("website") as string,
        founded: formData.get("founded") as string,
        clubColors: formData.get("clubColors") as string,
        venue: formData.get("venue") as string,
    }

    await db.insert(teams).values(
        teamData
    )

    revalidatePath("/dashboard")
}