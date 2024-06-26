import AddTeamForm from '@/app/components/AddTeamForm'
import AddGroupFrom from '@/app/components/AddGroupFrom'
import AssignGroupForm from '@/app/components/AssignGroupForm'
import Group from '@/app/components/Group'
import Team from '@/app/components/Team'
import db from '@/db'
import { competitions, teamsCompetitions, teams, groups, groupTeams } from '@/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import React from 'react'
import Link from 'next/link'
import { auth } from '@/auth'

export default async function page({ params, searchParams }: { params: { compId: number }, searchParams: { formalName: string, type: string } }) {
    console.log(searchParams)
    console.log(params)
    const session = await auth();
    const comp = await db.select({
        id: teams.id,
        name: teams.name,
        shortName: teams.shortName,
        tla: teams.tla,
        crest: teams.crest,
        address: teams.address,
        website: teams.website,
        founded: teams.founded,
        clubColors: teams.clubColors,
        venue: teams.venue,
        group: groups.name
    })
        .from(teams)
        .fullJoin(teamsCompetitions, eq(teams.id, teamsCompetitions.teamId))
        .fullJoin(competitions, eq(teamsCompetitions.competitionId, competitions.id))
        .fullJoin(groupTeams, eq(teams.id, groupTeams.teamId))
        .fullJoin(groups,
            and(
                eq(groupTeams.groupId, groups.id),
                eq(competitions.id, groups.competitionId))
        )
        .where(eq(competitions.id, params.compId))

    console.log("comp", comp)
    const allGroups = await db.select().from(groups).where(eq(groups.competitionId, params.compId))
    const allTeams = await db.query.teams.findMany(
        { orderBy: [asc(teams.name)] }
    );

    console.log("allTeams", allTeams)
    console.log("allGroups", allGroups)

    return (
        <div>
            <h1>{searchParams.formalName} {searchParams.type}</h1>
            <h2>Teams</h2>
            {comp.map((c: any) =>
                <div>
                    <Team team={c} competitionId={params.compId} role={session?.user.role}>
                        {searchParams.type === "CUP" &&
                            c.id != null &&
                            c.group == null &&
                            <AssignGroupForm groupList={allGroups} teamId={c.id} />
                        }
                    </Team>
                </div>)}
            <br />
            {session?.user.role === "admin" &&
                <AddTeamForm allTeams={allTeams} competitionId={params.compId} />}
            <br />
            <div>
                {searchParams.type === "CUP" &&
                    <div>
                        <h2>Groups</h2>
                        {
                            allGroups.map((g: any) => (
                                <div key={g.id}>
                                    <Group id={params.compId} g={g} />
                                </div>
                            ))
                        }
                        {session?.user.role === "admin" &&
                            <AddGroupFrom id={params.compId} />}
                    </div>
                }
            </div>
            <br />
            <Link href={`/competitions/${params.compId}/fixtures`}>
                <p>See Fixture List</p>
            </Link>
        </div>
    )
}
