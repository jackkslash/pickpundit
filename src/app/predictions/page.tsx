import React from 'react'

export default function page({ searchParams }: { searchParams: { competitionId: string, matchday: string } }) {
    return (
        <div>
            <p>COMP ID - {searchParams.competitionId} </p>
            <p>MATCHDAY - {searchParams.matchday}</p>
        </div>
    )
}
