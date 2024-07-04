'use server'
import { auth } from "@/auth";
import db from "@/db";
import { standingPredictions } from "@/db/schema";
import { standingPredictionSchema } from "../types/zod.schema";

export async function standingsPrediction(predictStand: any, competitionId: number) {
    const compId = Number(competitionId)
    const sesson = await auth();
    if (!sesson || !sesson.user || !sesson.user.id) {
        throw new Error('User is not authenticated');
    }

    const standingPrediction = standingPredictionSchema.safeParse({
        userId: sesson.user.id,
        competitionId: compId,
        predictions: predictStand
    })

    if (!standingPrediction.success) {
        console.log(standingPrediction.error.message);
        return {
            type: "error",
            message: standingPrediction.error.message
        }
    }

    await db.insert(standingPredictions).values(standingPrediction.data)

    return {
        type: "success",
        message: "Predictions sent"
    }
}