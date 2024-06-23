import db from "@/db";
import { groupTeams, groups } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { groupSchema, groupTeamSchema } from "../types/zod.schema";

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