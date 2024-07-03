import db from '@/db'
import { eq } from 'drizzle-orm'
import React from 'react'
import { competitions, standings, teams } from '@/db/schema'
import Link from 'next/link'

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
            <table className="w-full table-auto">
                <colgroup>
                    <col className="w-1/3" />
                    <col className="w-1/12" />
                </colgroup>
                <thead>
                    <tr className=" text-left">
                        <th>Team</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>F</th>
                        <th>A</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((team, index) => (
                        <tr key={team.team} className={`
              ${index % 2 === 0 ? 'text-white' : 'text-cyan-400'}
            `}>
                            <td className="text-left">{`${team.position} ${team.team}`}</td>
                            <td>{team.played}</td>
                            <td>{team.won}</td>
                            <td>{team.drawn}</td>
                            <td>{team.lost}</td>
                            <td>{team.goalsFor}</td>
                            <td>{team.goalsAgainst}</td>
                            <td>{team.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link href={`/predictions/standings?competitionId=${params.compId}`}> - Predict Standings - </Link>
        </div>

    )
}
