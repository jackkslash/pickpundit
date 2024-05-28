import db from '@/db'
import { competitions, teamsCompetitions, teams } from '@/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { get } from 'http'
import { revalidatePath } from 'next/cache'
import React from 'react'

export default async function page({ params, searchParams }: { params: { id: number }, searchParams: { formalName: string } }) {

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
        venue: teams.venue
    })
        .from(teams)
        .innerJoin(teamsCompetitions, eq(teams.id, teamsCompetitions.teamId))
        .innerJoin(competitions, eq(teamsCompetitions.competitionId, competitions.id))
        .where(eq(competitions.id, params.id))

    const allTeams = await db.query.teams.findMany(
        { orderBy: [asc(teams.name)] }
    );
    console.log(comp)
    return (
        <div>
            <h1>{searchParams.formalName}</h1>
            {comp.map((c) =>
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
                    <br />
                    <form action={async () => {
                        "use server"
                        await db.delete(teamsCompetitions).where(and(
                            eq(teamsCompetitions.teamId, c.id),
                            eq(teamsCompetitions.competitionId, params.id)
                        )
                        )
                        revalidatePath("/dashboard/comps/" + params.id + "?formalName=" + searchParams.formalName)
                    }}>
                        <button type="submit">DELETE</button>
                    </form>
                    <br />

                </div>)}

            <div>
                <form action={async (formData) => {
                    "use server"

                    const id = formData.get("id") as unknown as number
                    console.log(id)
                    await db.insert(teamsCompetitions).values({
                        teamId: id,
                        competitionId: params.id
                    })
                    revalidatePath("/dashboard/comps/" + params.id + "?formalName=" + searchParams.formalName)
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
