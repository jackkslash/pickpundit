import AddTeamForm from '@/app/components/AddTeamForm'
import Team from '@/app/components/Team'
import db from '@/db'
import { competitions, teamsCompetitions, teams } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import React from 'react'
import Link from 'next/link'
import { auth } from '@/auth'

export default async function page({ params, searchParams }: { params: { compId: number }, searchParams: { formalName: string, type: string } }) {
    console.log(searchParams)
    console.log(params)
    const session = await auth();
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
    })
        .from(teams)
        .fullJoin(teamsCompetitions, eq(teams.id, teamsCompetitions.teamId))
        .fullJoin(competitions, eq(teamsCompetitions.competitionId, competitions.id))
        .where(eq(competitions.id, params.compId))

    console.log("comp", comp)
    const allTeams = await db.query.teams.findMany(
        { orderBy: [asc(teams.name)] }
    );

    console.log("allTeams", allTeams)

    return (
        <div>
            <h1>{searchParams.formalName}</h1>
            <h2>Teams</h2>
            {comp.map((c: any) =>
                <div>
                    <Team team={c} competitionId={params.compId} role={session?.user.role}></Team>
                </div>)}
            <br />
            {session?.user.role === "admin" &&
                <AddTeamForm allTeams={allTeams} competitionId={params.compId} />}
            <br />
            <div>
            </div>
            <br />
            <Link href={`/competitions/${params.compId}/fixtures`}>
                <p>See Fixture List</p>
            </Link>
        </div>
    )
}
