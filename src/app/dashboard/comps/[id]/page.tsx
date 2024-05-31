import { SubmitTeamToGroup } from '@/app/actions/actions'
import Groups from '@/app/components/Groups'
import Team from '@/app/components/Team'
import db from '@/db'
import { competitions, teamsCompetitions, teams, groups, groupTeams } from '@/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import React from 'react'

export default async function page({ params, searchParams }: { params: { id: number }, searchParams: { formalName: string, type: string } }) {

    const comp = await db.select({
        id: teams.id,
        name: teams.name,
        shortName: teams.shortName,
        tla: teams.tla,
        crest: teams.crest,
        address: teams.address,
        website: teams.website,
        founded: teams.founded,
        clubColors: teams.clubColors,
        venue: teams.venue,
        group: groups.name
    })
        .from(teams)
        .fullJoin(teamsCompetitions, eq(teams.id, teamsCompetitions.teamId))
        .fullJoin(competitions, eq(teamsCompetitions.competitionId, competitions.id))
        .fullJoin(groupTeams, eq(teams.id, groupTeams.teamId))
        .fullJoin(groups,
            and(
                eq(groupTeams.groupId, groups.id),
                eq(competitions.id, groups.competitionId))
        )
        .where(eq(competitions.id, params.id))

    //all teams in db
    const allTeams = await db.query.teams.findMany(
        { orderBy: [asc(teams.name)] }
    );
    //all groups in db
    console.log(comp)
    const allGroups = await db.select().from(groups).where(eq(groups.competitionId, params.id))
    return (
        <div>
            <h1>{searchParams.formalName} {searchParams.type}</h1>
            <h2>Teams</h2>
            {comp.map((c: any) =>
                <div>
                    <Team team={c} competitionId={params.id}>
                        {searchParams.type === "CUP" &&
                            c.id != null &&
                            c.group == null &&
                            <div>
                                <form action={SubmitTeamToGroup}>
                                    <select className='text-black' name='id'>
                                        {allGroups.map((g) =>
                                            <option className='text-black' value={g.id}>{g.name}</option>
                                        )}
                                        <input type="hidden" name="teamId" value={c.id} />
                                    </select>
                                    <button type="submit">Add</button>
                                </form>
                            </div>
                        }
                    </Team>
                </div>)}
            <br />
            <h2>Add Teams</h2>
            <form action={async (formData) => {
                "use server"

                const id = formData.get("id") as unknown as number
                console.log(id)
                await db.insert(teamsCompetitions).values({
                    teamId: id,
                    competitionId: params.id
                })
                revalidatePath("/")
            }}>
                <select className='text-black' name='id'>
                    <option value={0}>Select a team</option>
                    {
                        allTeams.map((t) =>
                            <option className='text-black' value={t.id}>{t.name}</option>
                        )
                    }</select>

                <button type="submit">Add</button>
            </form>
            <br />
            <div>
                <h2>Groups</h2>
                {searchParams.type === "CUP" &&
                    <Groups id={params.id} groupList={allGroups} />
                }
            </div>
        </div>
    )
}
