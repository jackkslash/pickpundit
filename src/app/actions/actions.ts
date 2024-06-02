"use server"

import db from "@/db"
import { competitions, groupTeams, groups, teams, teamsCompetitions } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const competitionSchema = z.object({
    formalName: z.string().min(1),
    informalName: z.string().min(1),
    code: z.string().min(1),
    type: z.string().min(1),
    emblem: z.string().min(1),
})

const teamSchema = z.object({
    name: z.string().min(1),
    shortName: z.string().min(1),
    tla: z.string().min(1),
    crest: z.string().min(1),
    address: z.string().min(1),
    website: z.string().min(1),
    founded: z.string().min(1),
    clubColors: z.string().min(1),
    venue: z.string().min(1),
})

const groupSchema = z.object({
    id: z.number().min(1).optional(),
    competitionId: z.number().min(1),
    name: z.string().min(1),
})

const groupTeamSchema = z.object({
    teamId: z.number().min(1),
    groupId: z.number().min(1),
})

const teamsCompetitionsSchema = z.object({
    teamId: z.number().min(1),
    competitionId: z.number().min(1),
})

export async function SubmitComp(formData: FormData) {
    try {
        const competition = competitionSchema.safeParse({
            formalName: formData.get("formalName"),
            informalName: formData.get("informalName"),
            code: formData.get("code"),
            type: formData.get("type"),
            emblem: formData.get("emblem")
        })
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
        const cIdSchema = z.number().min(1)
        const cId = cIdSchema.safeParse(competitionId)
        if (!cId.success) {
            return {
                type: "error",
                message: cId.error.message
            }
        }

        await db.delete(competitions).where(eq(competitions.id, cId.data))
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

export async function SubmitTeam(formData: FormData) {

    try {
        const team = teamSchema.safeParse({
            name: formData.get("name"),
            shortName: formData.get("shortName"),
            tla: formData.get("tla"),
            crest: formData.get("crest"),
            address: formData.get("address"),
            website: formData.get("website"),
            founded: formData.get("founded"),
            clubColors: formData.get("clubColors"),
            venue: formData.get("venue"),
        })

        if (!team.success) {
            return {
                type: "error",
                message: team.error.message
            }
        }

        await db.insert(teams).values(
            team.data
        )

        revalidatePath("/")
        return {
            type: "success",
            message: "Team added"
        }
    } catch (error) {
        return {
            type: "error",
            message: "Error submitting team: " + error
        }
    }
}

//ZOD'd this

export async function DeleteTeam(teamId: number, competitionId: number) {
    try {

        if (!competitionId) {
            console.log("no competition id")
            await db.delete(teams).where(eq(teams.id, teamId))
        } else {
            console.log("competition id")
            await db.delete(teamsCompetitions).where(and(
                eq(teamsCompetitions.teamId, teamId),
                eq(teamsCompetitions.competitionId, competitionId)
            )
            )

            await db.delete(groupTeams).where(eq(groupTeams.teamId, teamId)
            )
        }

        revalidatePath("/")
    } catch (error) {
        return {
            type: "error",
            message: "Error delteing team: " + error
        }
    }
}

export async function SubmitTeamToGroup(teamId: any, formData: FormData,) {
    try {
        const groupTeam = groupTeamSchema.safeParse({
            groupId: formData.get("groupId"),
            teamId: formData.get("teamId")
        })

        if (!groupTeam.success) {
            return {
                type: "error",
                message: groupTeam.error.message
            }
        }

        await db.insert(groupTeams).values(groupTeam.data)
        revalidatePath("/")
        return {
            type: "success",
            message: "Team added to group"
        }
    } catch (error) {
        return {
            type: "error",
            message: "Error adding team to competition: " + error
        }
    }
}

export async function AddTeamToComp(competitionId: number, prevState: any, formData: FormData,) {
    try {

        const teamsComp = teamsCompetitionsSchema.safeParse({
            teamId: formData.get("teamId"),
            competitionId: competitionId
        })

        if (!teamsComp.success) {
            return {
                type: "error",
                message: teamsComp.error.message
            }
        }

        const exists = await db.select().from(teamsCompetitions)
            .where(eq(teamsCompetitions.teamId, teamsComp.data.teamId))

        if (exists.length == 0) {
            await db.insert(teamsCompetitions).values(teamsComp.data)
            revalidatePath("/")
            return {
                type: "success",
                message: "Team added to competition"
            }
        } else {
            return {
                type: "error",
                message: "Team already in competition"
            }
        }

    } catch (error) {
        return {
            type: "error",
            message: "Error adding team to competition: " + error
        }
    }
}

export async function DeleteGroup(groupId: any, competitionId: any) {
    try {
        const groupSchema = z.object({
            id: z.number().min(1),
            competitionId: z.number().min(1)
        })

        const group = groupSchema.safeParse({
            id: groupId,
            competitionId: competitionId
        })

        if (!group.success) {
            return {
                type: "error",
                message: group.error.message
            }
        }

        await db.delete(groups).where(and(
            eq(groups.id, group.data.id),
            eq(groups.competitionId, group.data.competitionId)
        )
        )
        revalidatePath("/")
        return {
            type: "success",
            message: "Group deleted"
        }
    } catch (error) {
        return {
            type: "error",
            message: "Error delteing group: " + error
        }
    }
}

export async function AddGroup(id: number, formData: FormData) {
    try {

        const group = groupSchema.safeParse({
            competitionId: id,
            name: formData.get("group")
        })

        if (!group.success) {
            return {
                type: "error",
                message: group.error.message
            }
        }
        await db.insert(groups).values(group.data)
        revalidatePath("/")
        return {
            type: "success",
            message: "Group added"
        }
    } catch (error) {
        return {
            type: "error",
            message: "Error adding group: " + error
        }
    }
}

