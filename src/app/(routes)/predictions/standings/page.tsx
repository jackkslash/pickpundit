import StandingsPredict from '@/app/components/StandingsPredict'
import { auth } from '@/auth'
import db from '@/db'
import { competitions, teams, standings, standingPredictions } from '@/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import React from 'react'

export default async function leagueStandings({ searchParams }: { searchParams: { competitionId: number } }) {
    console.log("params", searchParams.competitionId)
    const session = await auth();
    const userId = session?.user?.id
    if (!session || !session.user || !session.user.id) {
        throw new Error('User is not authenticated');
    }
    const havePredicted = await db.select({
        standingPredictions: standingPredictions.predictions
    }).from(standingPredictions)
        .where(and(
            eq(standingPredictions.userId, userId!),
            eq(standingPredictions.competitionId, searchParams.competitionId)))

    let data = null

    if (havePredicted.length > 0) {
        let predictions: any = havePredicted[0].standingPredictions!
        console.log("havePredicted", havePredicted)
        return (<div className='flex flex-col items-center mx-auto'>
            <h2 className=" mb-2">{session.user.name} predictions!</h2>
            {
                predictions.map((prediction: any, index: any) => (
                    <div key={index}>
                        <div className={`
          ${index % 2 === 0 ? 'text-white' : 'text-cyan-400'}
        `}>{`${index + 1} ${prediction.team}`}</div>
                    </div>
                ))
            }
        </div>)
    } else {
        data = await db.select({
            id: teams.id,
            team: teams.name,
        }).from(standings)
            .fullJoin(teams, eq(standings.teamId, teams.id))
            .fullJoin(competitions, eq(standings.competitionId, competitions.id))
            .where(eq(standings.competitionId, searchParams.competitionId))
            .orderBy(asc(teams.name))
    }


    return (
        <StandingsPredict data={data} competitionId={searchParams.competitionId} />
    )
}
