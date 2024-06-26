'use client'
import { use, useEffect, useState } from "react";
import Fixture from "./Fixture";
import Link from "next/link";

export default function Fixtures({ fixtures, role, matchdays }: { fixtures: any, role?: string, matchdays: any }) {
    const [matchday, setMatchday] = useState('1');

    const currentDate = new Date();

    const mostCurrentMatchday = fixtures.reduce((current: any, match: any) => {
        const matchDate = new Date(match.date);
        if (matchDate <= currentDate && matchDate > new Date(current.date)) {
            return match;
        }
        return current;
    }, fixtures[0]).matchday;

    useEffect(() => {
        setMatchday(mostCurrentMatchday);
    }, [mostCurrentMatchday]);

    if (fixtures.length === 0) {
        return <div>No Fixtures</div>
    } else {
        return (
            <div className="flex flex-col items-center justify-center gap-6 ">
                <p>Matchday {matchday}</p>
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
                    <Link href={`/predictions/fixtures?competitionId=${fixtures[0]?.competitionId}&matchday=${matchday}`}> - Predict Matchday {matchday} Matches - </Link>}
            </div>
        )
    }
}