import { SubmitTeam } from "@/app/actions/actions";
import SubmitTeamForm from "@/app/components/SubmitTeamForm";
import db from "@/db";
import { teams } from "@/db/schema";
import Teams from "@/app/components/Teams";

export default async function TeamPage() {
    const dataTeams = await db.select().from(teams)
    return (
        <div className="flex min-h-screen flex-col items-center py-6 space-y-10">
            <Teams t={dataTeams} />
            <br />
            <SubmitTeamForm SubmitTeam={SubmitTeam} />
        </div>
    )
}