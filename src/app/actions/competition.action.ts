'use server'
import db from "@/db";
import { competitions, teamsCompetitions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { competitionSchema, teamsCompetitionsSchema } from "../types/zod.schema";

export async function SubmitComp(formData: FormData) {
    try {
        const competitionPartialSchema = competitionSchema.pick({
            formalName: true,
            informalName: true,
            code: true,
            type: true,
            emblem: true
        });

        const competition = competitionPartialSchema.safeParse({
            formalName: formData.get("formalName"),
            informalName: formData.get("informalName"),
            code: formData.get("code"),
            type: formData.get("type"),
            emblem: formData.get("emblem")
        });
        if (!competition.success) {
            return {
                type: "error",
                message: competition.error.message
            }
        }

        await db.insert(competitions).values(
            competition.data
        )

        revalidatePath("/")
        return {
            type: "success",
            message: "Competition added"
        }
    } catch (error) {
        return {
            type: "error",
            message: "Error submitting competition: " + error
        }
    }
}

export async function DeleteComp(competitionId: number) {

    try {
        const compPartialSchema = competitionSchema.pick({
            id: true
        })
        const compId = compPartialSchema.safeParse({ id: competitionId })
        if (!compId.success) {
            return {
                type: "error",
                message: compId.error.message
            }
        }

        await db.delete(competitions).where(eq(competitions.id, compId.data.id))
        revalidatePath("/")
        return {
            type: "success",
            message: "Competition deleted"
        }
    } catch (error) {
        return {
            type: "error",
            message: "Error deleting competition: " + error
        }
    }
}

export async function AddTeamToComp(competitionId: number, prevState: any, formData: FormData,) {
    try {
        console.log(competitionId)
        const teamsComp = teamsCompetitionsSchema.safeParse({
            teamId: formData.get("id"),
            competitionId: competitionId
        })

        if (!teamsComp.success) {
            return {
                type: "error",
                message: "Error adding team to competition: " + teamsComp.error.message
            }
        }

        const exists = await db.select().from(teamsCompetitions)
            .where(and(
                eq(teamsCompetitions.teamId, teamsComp.data.teamId),
                eq(teamsCompetitions.competitionId, teamsComp.data.competitionId)))

        if (exists.length == 0) {
            await db.insert(teamsCompetitions).values(teamsComp.data)
            revalidatePath("/")
            return {
                type: "success",
                message: "Team added to competition"
            }
        }
        return {
            type: "error",
            message: "Team already in competition"
        }


    } catch (error) {
        return {
            type: "error",
            message: "Error adding team to competition: " + error
        }
    }
}