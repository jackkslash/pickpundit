import AddFixtureForm from "@/app/components/AddFixtureForm"
import Fixtures from "@/app/components/Fixtures"
import db from "@/db"
import { competitions, fixtures, groupTeams, groups, teams, teamsCompetitions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export default async function page({ params }: { params: { id: number } }) {

    const dataComp = await db.select()
        .from(competitions)
        .where(eq(competitions.id, params.id))

    const dataTeams = await db.select({
        id: teams.id,
        name: teams.name,
        tla: teams.tla,
        venue: teams.venue,
        comp: competitions.id,
        groupName: groups.name,
        groupId: groupTeams.groupId
    }).from(teams)
        .innerJoin(teamsCompetitions,
            eq(teamsCompetitions.teamId, teams.id)
        )
        .innerJoin(groupTeams,
            eq(groupTeams.teamId, teams.id)
        )
        .innerJoin(groups,
            eq(groups.id, groupTeams.groupId)
        )
        .innerJoin(competitions,
            eq(competitions.id, teamsCompetitions.competitionId)
        )
        .where(eq(teamsCompetitions.competitionId, params.id))


    const homeTeamAlias = alias(teams, 'homeTeam');
    const awayTeamAlias = alias(teams, 'awayTeam');

    const fixturesData = await db.select({
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
        .where(eq(fixtures.competitionId, params.id))
        .orderBy(fixtures.matchday);

    console.log(dataComp)
    console.log(dataTeams)
    console.log(fixturesData)


    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <h2 className="">{dataComp[0].formalName}</h2>
            <Fixtures fixtures={fixturesData} />
            <AddFixtureForm teams={dataTeams} comp={dataComp[0]} />
        </div>
    )
}