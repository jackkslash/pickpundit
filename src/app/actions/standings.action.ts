'use server'

import { auth } from "@/auth";
import db from "@/db";
import { standingPredictions } from "@/db/schema";
import { standingPredictionSchema } from "../types/zod.schema";
import { revalidatePath } from "next/cache";

export async function standingsPrediction(predictStand: any, competitionId: number) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('User is not authenticated');
    }

    const standingPrediction = standingPredictionSchema.safeParse({
        userId: session.user.id,
        competitionId: Number(competitionId),
        predictions: predictStand
    });

    if (!standingPrediction.success) {
        console.error(standingPrediction.error.message);
        return {
            type: "error",
            message: standingPrediction.error.message
        };
    }

    await db.insert(standingPredictions).values(standingPrediction.data);
    revalidatePath('/');

    return {
        type: "success",
        message: "Predictions sent"
    };
}