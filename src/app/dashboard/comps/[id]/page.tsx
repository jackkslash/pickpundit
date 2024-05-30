import { SubmitTeamToGroup } from '@/app/actions/actions'
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
    const allGroups = await db.select().from(groups).where(eq(groups.competitionId, params.id))
    console.log(comp)
    return (
        <div>
            <h1>{searchParams.formalName} {searchParams.type}</h1>
            <h2>Teams</h2>
            {comp.map((c: any) =>
                <div>
                    <p>{c.id}</p>
                    <p>{c.name}</p>
                    <p>{c.shortName}</p>
                    <p>{c.tla}</p>
                    <p>{c.crest}</p>
                    <p>{c.address}</p>
                    <p>{c.website}</p>
                    <p>{c.founded}</p>
                    <p>{c.clubColors}</p>
                    <p>{c.venue}</p>
                    {c.group && <p>{c.group}</p>}
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
                    <form action={async () => {
                        "use server"
                        await db.delete(teamsCompetitions).where(and(
                            eq(teamsCompetitions.teamId, c.id),
                            eq(teamsCompetitions.competitionId, params.id)
                        )
                        )

                        await db.delete(groupTeams).where(eq(groupTeams.teamId, c.id)
                        )

                        revalidatePath("/")
                    }}>
                        {c.id && <button type="submit">DELETE TEAM</button>}
                    </form>

                </div>)}
            <h2>Groups</h2>
            {allGroups.map((g) =>
                <div>
                    <p>Group: {g.name}</p>
                    <p>Comp: {g.competitionId}</p>
                    <br />
                    <form action={async () => {
                        "use server"
                        await db.delete(groups).where(and(
                            eq(groups.id, g.id),
                            eq(groups.competitionId, params.id)
                        )
                        )
                        revalidatePath("/")
                    }}>
                        <button type="submit">DELETE</button>
                    </form>
                    <br />

                </div>)}

            <div>
                {searchParams.type === "CUP" &&
                    <div>
                        <form action={async (formData) => {
                            "use server"
                            const name = formData.get("group") as string
                            await db.insert(groups).values({
                                competitionId: params.id,
                                name: name
                            })
                            revalidatePath("/")
                        }}>
                            <label htmlFor="group" />
                            <input className='text-black' type="text" name='group' />
                            <button type="submit">Add</button>
                        </form>
                    </div>
                }


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
            </div>

        </div>
    )
}
