import StandingsPredict from '@/app/components/StandingsPredict'
import db from '@/db'
import { competitions, teams, standings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import React from 'react'

export default async function leagueStandings({ searchParams }: { searchParams: { competitionId: number } }) {
    console.log("params", searchParams.competitionId)
    const data = await db.select({
        standingsId: standings.id,
        id: teams.id,
        comp: competitions.formalName,
        team: teams.name,
        position: standings.position,
        played: standings.playedGames,
        won: standings.won,
        drawn: standings.drawn,
        lost: standings.lost,
        points: standings.points,
        goalsFor: standings.goalsFor,
        goalsAgainst: standings.goalsAgainst,
        goalDifference: standings.goalDifference
    }).from(standings)
        .fullJoin(teams, eq(standings.teamId, teams.id))
        .fullJoin(competitions, eq(standings.competitionId, competitions.id))
        .where(eq(standings.competitionId, searchParams.competitionId))
    console.log("data", data)

    return (
        <StandingsPredict data={data} />
    )
}
