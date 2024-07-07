import { auth, signOut } from "@/auth"
import db from "@/db";
import { predictions, standingPredictions } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm/expressions";

export default async function Home() {
    const session = await auth();

    if (session == null) {
        redirect("/")
    }

    const userPredictions = await db.select().from(predictions)
        .where(eq(predictions.userId, session?.user?.id as string))

    const userStandingPrediction = await db.select().from(standingPredictions)
        .where(eq(standingPredictions.userId, session?.user?.id as string))

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <p>Hello {session?.user?.name} !</p>
                <form
                    action={async () => {
                        "use server"
                        await signOut()
                    }}
                >
                    <button type="submit">Sign Out</button>
                </form>
                <div>Predictions</div>
                <pre>{JSON.stringify(userPredictions, null, 2)}</pre>
                <div>Standing Predictions</div>
                <pre>{JSON.stringify(userStandingPrediction, null, 2)}</pre>
            </div>
        </main>
    );
}
