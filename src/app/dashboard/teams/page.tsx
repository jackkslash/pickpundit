import { SubmitTeam } from "@/app/actions/actions";
import TeamForm from "@/app/components/TeamForm";
import db from "@/db";
import { teams } from "@/db/schema";
import Team from "@/app/components/Team";

export default async function TeamPage() {
    const dataTeams = await db.select().from(teams)
    return (
        <div className="flex min-h-screen flex-col items-center py-6 space-y-10">
            <div className='flex flex-col gap-4'>
                <h1>Teams</h1>
                {dataTeams.map((team: any) => (
                    <Team team={team} />
                ))}
            </div>
            <br />
            <TeamForm SubmitTeam={SubmitTeam} />
        </div>
    )
}