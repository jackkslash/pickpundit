import { auth, signOut } from "@/auth"
import Competitions from "@/app/components/Competitions";
import SubmitCompForm from "@/app/components/SubmitCompForm";
import db from "@/db";
import { competitions, teams } from "@/db/schema";
import { redirect } from "next/navigation";
import { SubmitComp, SubmitTeam } from "../actions/actions";
import Teams from "../components/Teams";
import SubmitTeamForm from "../components/SubmitTeamForm";

export default async function Home() {
    const session = await auth();

    if (session == null || session.user.role != "admin") {
        redirect("/")
    }

    const dataComps = await db.select().from(competitions)
    const dataTeams = await db.select().from(teams)
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
            <Competitions comps={dataComps} />
            <br />
            <SubmitCompForm SubmitComp={SubmitComp} />
            <br />
            <Teams t={dataTeams} />
            <br />
            <SubmitTeamForm SubmitTeam={SubmitTeam} />
        </main>
    );
}
