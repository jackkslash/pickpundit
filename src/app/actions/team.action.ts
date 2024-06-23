import db from "@/db";
import { teams, teamsCompetitions, groupTeams } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { teamSchema, teamsCompetitionsSchema } from "../types/zod.schema";

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
