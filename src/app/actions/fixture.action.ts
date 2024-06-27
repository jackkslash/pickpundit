'use server'
import db from "@/db";
import { fixtures, predictions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { fixtureSchema, predictionFormSchema } from "../types/zod.schema";

export async function AddFixture(compId: number, formData: FormData) {
    try {
        console.log(formData)
        console.log(compId)
        const fixturePartialSchema = fixtureSchema.pick({
            competitionId: true,
            homeTeamId: true,
            awayTeamId: true,
            date: true,
            venue: true,
            homeTeamScore: true,
            awayTeamScore: true,
            matchday: true,
        });

        const fixture = fixturePartialSchema.safeParse({
            competitionId: compId,
            homeTeamId: formData.get("homeTeamId"),
            awayTeamId: formData.get("awayTeamId"),
            date: formData.get("date"),
            venue: formData.get("venue"),
            homeTeamScore: formData.get("homeTeamScore"),
            awayTeamScore: formData.get("awayTeamScore"),
            matchday: formData.get("matchday"),
        });

        if (!fixture.success) {
            console.log(fixture.error.message);
            return {
                type: "error",
                message: fixture.error.message
            }
        }

        await db.insert(fixtures).values(
            fixture.data
        )

        revalidatePath("/");

        return {
            type: "success",
            message: "Fixture added"
        };
    } catch (error) {
        console.log(error);
        return {
            type: "error",
            message: "Error adding fixture: " + error
        };
    }
}

export async function DeleteFixture(fixtureId: number, competitionId: number) {
    try {
        const fixture = fixtureSchema.pick({
            id: true
        }).safeParse({
            id: fixtureId,
            competitionId: competitionId
        });

        if (!fixture.success) {
            console.log(fixture.error.message);
            return {
                type: "error",
                message: fixture.error.message
            }
        }

        await db.delete(fixtures).where(
            and(
                eq(fixtures.id, fixture.data.id),
                eq(fixtures.competitionId, competitionId)
            )
        );

        revalidatePath("/");

        return {
            type: "success",
            message: "Fixture deleted"
        };
    } catch (error) {
        console.log(error);
        return {
            type: "error",
            message: "Error deleting fixture: " + error
        };
    }
}

export async function UpdateFixture(fixtureId: number, homeTeamScore: number, awayTeamScore: number, status: string) {
    try {
        const fixture = fixtureSchema.pick({
            id: true,
            homeTeamScore: true,
            awayTeamScore: true,
            status: true
        }).safeParse({
            id: fixtureId,
            homeTeamScore: homeTeamScore,
            awayTeamScore: awayTeamScore,
            status: status
        });

        if (!fixture.success) {
            console.log(fixture.error.message);
            return {
                type: "error",
                message: fixture.error.message
            }
        }

        await db.update(fixtures).set({
            homeTeamScore: fixture.data.homeTeamScore,
            awayTeamScore: fixture.data.awayTeamScore,
            status: fixture.data.status
        }).where(
            eq(fixtures.id, fixture.data.id)
        );

        revalidatePath("/");

        return {
            type: "success",
            message: "Fixture updated"
        };
    } catch (error) {
        console.log(error);
        return {
            type: "error",
            message: "Error updating fixture scores: " + error
        };
    }
}

export async function PredictFixture(id: any, formData: FormData) {
    try {

        const predictionData: any = {}
        formData.forEach((value, key) => {

            const [fixtureId, competitionId, team] = key.split("-")


            const predictForm = predictionFormSchema.safeParse({
                competitionId: competitionId,
                id: fixtureId,
                score: value,
                team: team
            })


            if (!predictForm.success) {
                throw new Error(`Validation failed for key ${key}: ${JSON.stringify(predictForm.error.errors)}`);
            }


            if (!predictionData[fixtureId]) {
                predictionData[fixtureId] = {};
            }
            if (!predictionData[fixtureId][competitionId]) {
                predictionData[fixtureId][competitionId] = {};
            }
            predictionData[fixtureId][competitionId][team] = Number(value);
        })

        const predictionArray = Object.keys(predictionData).flatMap(fixtureId =>
            Object.keys(predictionData[fixtureId]).map(competitionId => ({
                fixtureId,
                competitionId,
                ...predictionData[fixtureId][competitionId]
            }))
        );

        const insertPromises = predictionArray.map(async (prediction: any) => {
            await db.insert(predictions).values({
                userId: id,
                competitionsId: prediction.competitionId,
                fixtureId: prediction.fixtureId,
                predictedHomeScore: prediction.predictedHomeScore,
                predictedAwayScore: prediction.predictedAwayScore
            })
        })

        await Promise.all(insertPromises)
        revalidatePath("/")
    } catch (error) {
        console.log(error)
        return {
            type: "error",
            message: "Error updating fixture scores: " + error
        };
    }
}