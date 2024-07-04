import StandingsPredict from '@/app/components/StandingsPredict'
import { auth } from '@/auth'
import db from '@/db'
import { competitions, teams, standings } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import React from 'react'

export default async function leagueStandings({ searchParams }: { searchParams: { competitionId: number } }) {
    console.log("params", searchParams.competitionId)
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error('User is not authenticated');
    }
    const data = await db.select({
        id: teams.id,
        team: teams.name,
    }).from(standings)
        .fullJoin(teams, eq(standings.teamId, teams.id))
        .fullJoin(competitions, eq(standings.competitionId, competitions.id))
        .where(eq(standings.competitionId, searchParams.competitionId))
        .orderBy(asc(teams.name))
    console.log("data", data)

    return (
        <StandingsPredict data={data} competitionId={searchParams.competitionId} />
    )
}
