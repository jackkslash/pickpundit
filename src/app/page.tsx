import db from "@/db";
import { competitions, fixtures, teams } from "@/db/schema";
import { max, sql, eq, gt } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export default async function Home() {
  const homeTeamAlias = alias(teams, 'homeTeam');
  const awayTeamAlias = alias(teams, 'awayTeam');
  const dataComps = await db
    .select({
      id: competitions.id,
      formalName: competitions.formalName,
      informalName: competitions.informalName,
      code: competitions.code,
      type: competitions.type,
      emblem: competitions.emblem,
      currentMatchday: max(fixtures.matchday).as('currentMatchday'),
      fixtures: fixtures.id,
      fixturesDate: fixtures.date,
      fixturesHomeTeamId: fixtures.homeTeamId,
      fixturesAwayTeamId: fixtures.awayTeamId,
      fixturesHomeTeamName: homeTeamAlias.name,
      fixturesAwayTeamName: awayTeamAlias.name,
      fixturesHomeTeamScore: fixtures.homeTeamScore,
      fixturesAwayTeamScore: fixtures.awayTeamScore,
      fixturesStatus: fixtures.status,
      fixturesCompetitionId: fixtures.competitionId,
      fixturesMatchday: fixtures.matchday,
      fixturesRound: fixtures.round,
      fixturesVenue: fixtures.venue
    })
    .from(competitions)
    .leftJoin(fixtures, eq(fixtures.competitionId, competitions.id))
    .leftJoin(homeTeamAlias, eq(homeTeamAlias.id, fixtures.homeTeamId))
    .leftJoin(awayTeamAlias, eq(awayTeamAlias.id, fixtures.awayTeamId))
    .where(gt(fixtures.date, sql`CURRENT_DATE`))
    .groupBy(competitions.id, fixtures.id, homeTeamAlias.id, awayTeamAlias.id)
    .orderBy(competitions.id);

  console.log(dataComps)

  const reducedData = dataComps.reduce((acc: any, cur: any) => {
    // Find competition with current code in accumulator
    const existingComp = acc.find((comp: { code: any; }) => comp.code === cur.code);

    if (existingComp) {
      // If competition already exists, push fixture to its fixtures array
      existingComp.fixtures.push({
        id: cur.fixtures,
        date: cur.fixturesDate,
        homeTeamId: cur.fixturesHomeTeamId,
        awayTeamId: cur.fixturesAwayTeamId,
        homeTeamScore: cur.fixturesHomeTeamScore,
        homeTeamName: cur.fixturesHomeTeamName,
        awayTeamName: cur.fixturesAwayTeamName,
        awayTeamScore: cur.fixturesAwayTeamScore,
        status: cur.fixturesStatus,
        matchday: cur.fixturesMatchday,
        round: cur.fixturesRound,
        venue: cur.fixturesVenue
      });
    } else {
      // If competition doesn't exist, create a new competition object
      const newComp = {
        id: cur.id,
        formalName: cur.formalName,
        informalName: cur.informalName,
        code: cur.code,
        type: cur.type,
        emblem: cur.emblem,
        currentMatchday: cur.currentMatchday,
        fixtures: [{
          id: cur.fixtures,
          date: cur.fixturesDate,
          homeTeamId: cur.fixturesHomeTeamId,
          awayTeamId: cur.fixturesAwayTeamId,
          homeTeamScore: cur.fixturesHomeTeamScore,
          homeTeamName: cur.fixturesHomeTeamName,
          awayTeamScore: cur.fixturesAwayTeamScore,
          awayTeamName: cur.fixturesAwayTeamName,
          status: cur.fixturesStatus,
          matchday: cur.fixturesMatchday,
          round: cur.fixturesRound,
          venue: cur.fixturesVenue
        }]
      };
      // Push the new competition object to accumulator
      acc.push(newComp);
    }
    return acc;
  }, []);

  return (
    <main className="flex flex-col justify-between p-24">
      {reducedData.map((comp: any) => (
        <div key={comp.id}>
          <h1>{comp.formalName}</h1>
          <h2>{comp.informalName}</h2>
          <p>{comp.code}</p>
          <p>{comp.type}</p>
          <p>{comp.emblem}</p>
          <p>{comp.currentMatchday}</p>
          <ul>
            {comp.fixtures.map((fixture: any) => (
              <li key={fixture.id}>
                <p>{fixture.date.toLocaleDateString()}</p>
                <p>{fixture.homeTeamName}</p>
                <p>{fixture.awayTeamName}</p>
                <p>{fixture.homeTeamScore}</p>
                <p>{fixture.awayTeamScore}</p>
                <p>{fixture.status}</p>
                <p>{fixture.matchday}</p>
                <p>{fixture.round}</p>
                <p>{fixture.venue}</p>
                <br />
              </li>

            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
