import { PredictFixture } from '@/app/actions/fixture.action';
import FixturePrediction from '@/app/components/FixturePrediction';
import { auth } from '@/auth';
import db from '@/db';
import { competitions, fixtures, predictions, teams } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import React from 'react'

export default async function page({ searchParams }: { searchParams: { competitionId: number, matchday: number, informalName: string } }) {

    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error('User is not authenticated');
    }

    const PredictFixturesWithID = PredictFixture.bind(null, session?.user.id);
    const homeTeamAlias = alias(teams, 'homeTeam');
    const awayTeamAlias = alias(teams, 'awayTeam');

    const competitionsData = await db.select().from(competitions).where(eq(competitions.id, searchParams.competitionId));

    const matchdayFixturesData = await db.select({
        id: fixtures.id,
        date: fixtures.date,
        competitionsId: fixtures.competitionId,
        homeTeamId: fixtures.homeTeamId,
        homeTeam: homeTeamAlias.name,
        homeTla: homeTeamAlias.tla,
        awayTeam: awayTeamAlias.name,
        awayTeamId: fixtures.awayTeamId,
        awayTla: awayTeamAlias.tla,
        homeTeamScore: fixtures.homeTeamScore,
        awayTeamScore: fixtures.awayTeamScore,
        status: fixtures.status,
        competitionId: fixtures.competitionId,
        matchday: fixtures.matchday,
        round: fixtures.round,
        venue: fixtures.venue,
        userHomePrediction: predictions.predictedHomeScore,
        userAwayPrediction: predictions.predictedAwayScore
    }).from(fixtures)
        .leftJoin(homeTeamAlias, eq(homeTeamAlias.id, fixtures.homeTeamId))
        .leftJoin(awayTeamAlias, eq(awayTeamAlias.id, fixtures.awayTeamId))
        .leftJoin(predictions, and(
            eq(predictions.fixtureId, fixtures.id),
            eq(predictions.userId, session.user.id)
        ))
        .where(
            and(
                eq(fixtures.competitionId, searchParams.competitionId),
                eq(fixtures.matchday, searchParams.matchday),
            ))
        .orderBy(fixtures.matchday);

    return (
        <div>
            <p>{competitionsData[0].formalName}</p>
            <p>MATCHDAY - {searchParams.matchday}</p>
            <br />
            <p>FIXTURES</p>
            <form action={PredictFixturesWithID} >
                {matchdayFixturesData.map((fixture) => (
                    <FixturePrediction key={fixture.id} fixture={fixture} />
                ))}
                <input type="submit" value="Submit" />
            </form>

        </div>
    )
}
