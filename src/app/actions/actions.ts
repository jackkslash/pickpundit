"use server"

import db from "@/db"
import { competitions } from "@/db/schema"
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
