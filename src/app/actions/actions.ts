"use server"

import db from "@/db"
import { competitions, groupTeams, groups, teams, teamsCompetitions } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const competitionSchema = z.object({
    id: z.number().min(1),
    formalName: z.string().min(1),
    informalName: z.string().min(1),
    code: z.string().min(1),
    type: z.string().min(1),
    emblem: z.string().min(1),
})

const teamSchema = z.object({
    id: z.number().min(1),
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
    id: z.number().min(1),
    competitionId: z.coerce.number().min(1),
    name: z.string().min(1),
})

const groupTeamSchema = z.object({
    teamId: z.number().min(1),
    groupId: z.coerce.number().min(1),
})

const teamsCompetitionsSchema = z.object({
    teamId: z.coerce.number().min(1),
    competitionId: z.coerce.number().min(1),
})

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

export async function SubmitTeam(formData: FormData) {

    try {
        const teamPartialSchema = teamSchema.pick({
            name: true,
            shortName: true,
            tla: true,
            crest: true,
            address: true,
            website: true,
            founded: true,
            clubColors: true,
            venue: true
        });
        const team = teamPartialSchema.safeParse({
            name: formData.get("name"),
            shortName: formData.get("shortName"),
            tla: formData.get("tla"),
            crest: formData.get("crest"),
            address: formData.get("address"),
            website: formData.get("website"),
            founded: formData.get("founded"),
            clubColors: formData.get("clubColors"),
            venue: formData.get("venue"),
        });
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

export async function DeleteTeam(teamId: number, competitionId: number) {
    try {
        if (!competitionId) {
            const teamCompsPartialSchema = teamsCompetitionsSchema.pick({
                teamId: true,
            })
            const tId = teamCompsPartialSchema.safeParse({ teamId: teamId })
            if (!tId.success) {
                console.log(tId.error.message);
                return {
                    type: "error",
                    message: tId.error.message
                };
            }

            await db.delete(teams).where(eq(teams.id, tId.data.teamId));
        } else {
            const teamCompsPartialSchema = teamsCompetitionsSchema.pick({
                teamId: true,
                competitionId: true
            })
            const teamComps = teamCompsPartialSchema.safeParse({
                teamId: teamId,
                competitionId: competitionId
            });

            if (!teamComps.success) {
                return {
                    type: "error",
                    message: teamComps.error.message
                };
            }

            await db.delete(teamsCompetitions).where(and(
                eq(teamsCompetitions.teamId, teamComps.data.teamId),
                eq(teamsCompetitions.competitionId, teamComps.data.competitionId)
            ));

            await db.delete(groupTeams).where(
                eq(groupTeams.teamId, teamComps.data.teamId)
            );
        }

        revalidatePath("/");
        return {
            type: "success",
            message: "Team deleted"
        };
    } catch (error) {
        return {
            type: "error",
            message: "An error occurred while deleting the team."
        };
    }
}

export async function SubmitTeamToGroup(teamId: any, formData: FormData) {
    try {
        const groupTeam = groupTeamSchema.safeParse({
            teamId: teamId,
            groupId: formData.get("id")
        })
        console.log(groupTeam.data);
        if (!groupTeam.success) {
            return {
                type: "error",
                message: "Error adding team to competition: " + groupTeam.error.message
            }
        }

        await db.insert(groupTeams).values(groupTeam.data)
        revalidatePath("/")
        return {
            type: "success",
            message: "Team added to group"
        }
    } catch (error) {
        console.log(error);
        return {
            type: "error",
            message: "Error adding team to competition: " + error
        }
    }
}

export async function AddTeamToComp(competitionId: number, prevState: any, formData: FormData,) {
    try {

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
            .where(eq(teamsCompetitions.teamId, teamsComp.data.teamId))

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

export async function DeleteGroup(groupId: number, competitionId: number) {
    try {
        const group = groupSchema.pick({
            id: true,
            competitionId: true
        }).safeParse({
            id: groupId,
            competitionId: competitionId
        });

        if (!group.success) {
            console.log(group.error.message);
            return {
                type: "error",
                message: group.error.message
            };
        }

        await db.delete(groups).where(
            and(
                eq(groups.id, group.data.id),
                eq(groups.competitionId, group.data.competitionId)
            )
        );

        revalidatePath("/");

        return {
            type: "success",
            message: "Group deleted"
        };
    } catch (error) {
        console.log(error);
        return {
            type: "error",
            message: "Error deleting group: " + error
        };
    }
}

export async function AddGroup(id: number, formData: FormData) {
    try {
        const groupPartialSchema = groupSchema.pick({
            competitionId: true,
            name: true
        });

        const groupName = formData.get("group");
        if (typeof groupName !== 'string' || !groupName) {
            return {
                type: "error",
                message: "Group name is required and must be a string"
            };
        }

        const group = groupPartialSchema.safeParse({
            competitionId: id,
            name: groupName
        });

        if (!group.success) {
            return {
                type: "error",
                message: group.error.message
            };
        }

        await db.insert(groups).values({
            competitionId: group.data.competitionId,
            name: group.data.name
        });

        revalidatePath("/");

        return {
            type: "success",
            message: "Group added"
        };
    } catch (error) {
        return {
            type: "error",
            message: "Error adding group: " + error
        };
    }
}