import db from '@/db';
import { competitions, fixtures, teams } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import React from 'react'

export default async function page({ searchParams }: { searchParams: { competitionId: number, matchday: number, informalName: string } }) {

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
            {matchdayFixturesData.map((fixture) => (
                <div key={fixture.id}>
                    <p>Date: {fixture.date.toLocaleDateString()}</p>
                    <p>Kickoff :{fixture.date.toLocaleTimeString()}</p>
                    <p>Home Team: {fixture.homeTeam}</p>
                    <p>Away Team: {fixture.awayTeam}</p>
                    <p>Home Team Score: {fixture.homeTeamScore}</p>
                    <p>Away Team Score: {fixture.awayTeamScore}</p>
                    <br />
                </div>
            ))}
        </div>
    )
}
