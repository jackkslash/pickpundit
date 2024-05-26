import { auth, signOut } from "@/auth"
import Competitions from "@/components/Competitions";
import SubmitCompForm from "@/components/SubmitCompForm";
import db from "@/db";
import { competitions } from "@/db/schema";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await auth();

    if (session == null) {
        redirect("/")
    }

    const data = await db.select().from(competitions)
    return (
        <main className="flex min-h-screen flex-col items-center py-20 space-y-10">
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

            </div>
            <Competitions comps={data} />
            <SubmitCompForm />
        </main>
    );
}
