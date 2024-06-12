import { SubmitTeam } from "@/app/actions/actions";
import TeamForm from "@/app/components/TeamForm";
import db from "@/db";
import { teams } from "@/db/schema";
import Team from "@/app/components/Team";
import { auth } from "@/auth";

export default async function TeamPage() {
    const dataTeams = await db.select().from(teams)
    const session = await auth();
    return (
        <div className="flex min-h-screen flex-col items-center py-6 space-y-10">
            <div className='flex flex-col gap-4'>
                <h1>Teams</h1>
                {dataTeams.map((team: any) => (
                    <Team team={team} />
                ))}
            </div>
            <br />
            {session?.user?.role === 'admin' && (
                <TeamForm SubmitTeam={SubmitTeam} />
            )}
        </div>
    )
}