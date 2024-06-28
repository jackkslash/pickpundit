'use client'
import { useState } from "react";
import Fixture from "./Fixture";
import Link from "next/link";

export default function Fixtures({ fixtures, role, matchdays }: { fixtures: any, role?: string, matchdays: any }) {
    const [matchday, setMatchday] = useState('1');
    console.log(fixtures[0])

    if (fixtures.length === 0) {
        return <div>No Fixtures</div>
    } else {
        return (
            <div className="flex flex-col items-center justify-center gap-6 ">
                <select onChange={(e) => setMatchday(e.target.value)} className="text-white bg-black" value={matchday}>
                    {matchdays.map((m: any) => (
                        <option className="text-white" key={m} value={m}>{m}</option>
                    ))}
                </select>
                {
                    fixtures
                        .filter((fixture: { homeTeam: string; awayTeam: string; matchday: number }) =>
                            fixture.matchday === parseInt(matchday)
                        )
                        .map((f: any) => (
                            <Fixture key={f.id} fixture={f} role={role} />
                        ))
                }
                {matchday !== "" &&
                    <Link href={`/predictions?competitionId=${fixtures[0]?.competitionId}&matchday=${matchday}`}> - Predict Matchday {matchday} Matches - </Link>}
            </div>
        )
    }
}