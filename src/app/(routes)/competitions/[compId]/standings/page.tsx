import db from '@/db'
import { eq } from 'drizzle-orm'
import React from 'react'
import { competitions, standings, teams } from '@/db/schema'
import Link from 'next/link'
import StandingsTable from '@/app/components/StandingsTable'

export default async function compStandings({ params }: { params: { compId: number } }) {

    const data = await db.select({
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
        .where(eq(standings.competitionId, params.compId))
    return (
        <div className="bg-black text-white p-5 w-full">
            <h2 className=" mb-2">PREMIER LEAGUE TABLE 2019/20</h2>
            <StandingsTable data={data} />
            <Link href={`/predictions/standings?competitionId=${params.compId}`}> - Predict Standings - </Link>
        </div>

    )
}
