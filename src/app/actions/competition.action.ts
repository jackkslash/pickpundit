'use server'
import db from "@/db";
import { competitions, teamsCompetitions, standings } from "@/db/schema";
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


        const competition = await db.query.competitions.findFirst({
            where: eq(competitions.id, competitionId)
        })


        if (exists.length == 0) {
            await db.insert(teamsCompetitions).values(teamsComp.data)
            if (competition?.type === 'LEAGUE') {

                await db.insert(standings).values({
                    teamId: teamsComp.data.teamId,
                    competitionId: teamsComp.data.competitionId,
                    position: 0,
                    playedGames: 0,
                    won: 0,
                    drawn: 0,
                    lost: 0,
                    points: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    goalDifference: 0
                })

            }
            revalidatePath("/")
            return {
                type: "success",
                message: "Team added to competition successfully"
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

export async function StateChange(competitionId: number) {
    const compId = Number(competitionId)

    // Fetch the current active state
    const currentComp = await db.select({ active: competitions.active })
        .from(competitions)
        .where(eq(competitions.id, compId))
        .limit(1)

    if (currentComp.length === 0) {
        return {
            type: "error",
            message: "Competition not found"
        }
    }

    const newActiveState = !currentComp[0].active

    await db.update(competitions)
        .set({ active: newActiveState })
        .where(eq(competitions.id, compId))

    revalidatePath("/")

    return {
        type: "success",
        message: `Competition set to ${newActiveState ? 'active' : 'inactive'}`
    }
}