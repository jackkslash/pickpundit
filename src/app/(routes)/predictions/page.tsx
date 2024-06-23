import { PredictFixture } from '@/app/actions/fixture.action';
import { auth } from '@/auth';
import db from '@/db';
import { competitions, fixtures, teams } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import React from 'react'

export default async function page({ searchParams }: { searchParams: { competitionId: number, matchday: number, informalName: string } }) {

    const session = await auth();
    const PredictFixturesWithID = PredictFixture.bind(null, session?.user.id);
    const homeTeamAlias = alias(teams, 'homeTeam');
    const awayTeamAlias = alias(teams, 'awayTeam');

    const competitionsData = await db.select().from(competitions).where(eq(competitions.id, searchParams.competitionId));

    const matchdayFixturesData = await db.select({
        id: fixtures.id,
        date: fixtures.date,
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
        venue: fixtures.venue
    }).from(fixtures)
        .leftJoin(homeTeamAlias, eq(homeTeamAlias.id, fixtures.homeTeamId))
        .leftJoin(awayTeamAlias, eq(awayTeamAlias.id, fixtures.awayTeamId))
        .where(
            and(
                eq(fixtures.competitionId, searchParams.competitionId),
                eq(fixtures.matchday, searchParams.matchday)
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
                    <div key={fixture.id}>
                        <p>Date: {fixture.date.toLocaleDateString()}</p>
                        <p>Kickoff :{fixture.date.toLocaleTimeString()}</p>
                        <p>Home Team: {fixture.homeTeam}</p>
                        <p>Away Team: {fixture.awayTeam}</p>
                        <p>Home Team Score: {fixture.homeTeamScore}</p>
                        <p>Away Team Score: {fixture.awayTeamScore}</p>
                        <input type="text" placeholder={"Home Team Prediction"} className='bg-black text-white outline-dashed outline-white' name={`${fixture.id}-predictedHomeScore`} />
                        <br />
                        <input type="text" placeholder={"Away Team Prediction"} className='bg-black text-white outline-dashed outline-white' name={`${fixture.id}-predictedAwayScore`} />
                        <br />
                    </div>
                ))}
                <input type="submit" value="Submit" />
            </form>

        </div>
    )
}
