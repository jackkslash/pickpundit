import AddFixtureForm from "@/app/components/AddFixtureForm"
import Fixtures from "@/app/components/Fixtures"
import { auth } from "@/auth"
import db from "@/db"
import { competitions, fixtures, groupTeams, groups, teams, teamsCompetitions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export default async function page({ params }: { params: { compId: number } }) {
    console.log(params)
    const session = await auth();
    const dataComp = await db.select()
        .from(competitions)
        .where(eq(competitions.id, params.compId))
    let dataTeams
    if (dataComp?.[0].type === "CUP") {
        dataTeams = await db.select({
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
            .where(eq(teamsCompetitions.competitionId, params.compId))
    } else {
        dataTeams = await db.select({
            id: teams.id,
            name: teams.name,
            tla: teams.tla,
            venue: teams.venue,
            comp: competitions.id,
        }).from(teams)
            .innerJoin(teamsCompetitions,
                eq(teamsCompetitions.teamId, teams.id)
            )
            .innerJoin(competitions,
                eq(competitions.id, teamsCompetitions.competitionId)
            )
            .where(eq(teamsCompetitions.competitionId, params.compId))
    }



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
        venue: fixtures.venue
    }).from(fixtures)
        .leftJoin(homeTeamAlias, eq(homeTeamAlias.id, fixtures.homeTeamId))
        .leftJoin(awayTeamAlias, eq(awayTeamAlias.id, fixtures.awayTeamId))
        .where(eq(fixtures.competitionId, params.compId))
        .orderBy(fixtures.matchday);

    console.log(dataComp)
    console.log(dataTeams)
    console.log(fixturesData)


    return (
        <div className="flex flex-col items-center justify-center gap-6 pt-6 text-sm">
            <h2>{dataComp[0].formalName}</h2>
            <Fixtures fixtures={fixturesData} role={session?.user.role} />
            {session?.user.role === "admin" &&
                <AddFixtureForm teams={dataTeams} comp={dataComp[0]} />}
        </div>
    )
}