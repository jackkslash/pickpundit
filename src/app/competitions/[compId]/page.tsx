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

export default async function page({ params, searchParams }: { params: { id: number }, searchParams: { formalName: string, type: string } }) {

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
        .where(eq(competitions.id, params.id))

    const allGroups = await db.select().from(groups).where(eq(groups.competitionId, params.id))
    const allTeams = await db.query.teams.findMany(
        { orderBy: [asc(teams.name)] }
    );
    return (
        <div>
            <h1>{searchParams.formalName} {searchParams.type}</h1>
            <h2>Teams</h2>
            {comp.map((c: any) =>
                <div>
                    <Team team={c} competitionId={params.id}>
                        {searchParams.type === "CUP" &&
                            c.id != null &&
                            c.group == null &&
                            <AssignGroupForm groupList={allGroups} teamId={c.id} />
                        }
                    </Team>
                </div>)}
            <br />
            <AddTeamForm allTeams={allTeams} competitionId={params.id} />
            <br />
            <div>
                {searchParams.type === "CUP" &&
                    <div>
                        <h2>Groups</h2>
                        {
                            allGroups.map((g: any) => (
                                <div key={g.id}>
                                    <Group id={params.id} g={g} />
                                </div>
                            ))
                        }
                        <AddGroupFrom id={params.id} />
                    </div>
                }
            </div>
            <br />
            <Link href={`/dashboard/comps/${params.id}/fixtures`}>
                <p>See Fixture List</p>
            </Link>
        </div>
    )
}
