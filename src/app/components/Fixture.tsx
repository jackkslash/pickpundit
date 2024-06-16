'use client'
import { use, useEffect, useState } from "react";
import { DeleteFixture, UpdateFixture } from "../actions/actions";

export default function Fixture({ fixture, role }: { fixture: any, role?: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [homeTeamScore, setHomeTeamScore] = useState(fixture.homeTeamScore);
    const [awayTeamScore, setAwayTeamScore] = useState(fixture.awayTeamScore);
    const [matchStatus, setMatchStatus] = useState(fixture.status);

    const DeleteFixtureWithIds = DeleteFixture.bind(null, fixture.id, fixture.competitionId);
    const UpdateFixtureWithIds = UpdateFixture.bind(null, fixture.id, homeTeamScore, awayTeamScore, matchStatus);
    const event = new Date(fixture.date);


    const toggleEdit = () => {
        if (isEditing) {
            UpdateFixtureWithIds();
        }
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        if (role === "admin") {
            setIsEditing(false);
        }
    }, [role])
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col justify-center w-full h-full">
                <p>Matchday {fixture.matchday}</p>
                <p className="text-white">
                    {fixture.homeTeam}{' '}
                    {isEditing ? (
                        <input
                            className="text-black"
                            type="number"
                            value={homeTeamScore}
                            onChange={(e) => setHomeTeamScore(e.target.value)}
                        />
                    ) : (
                        homeTeamScore
                    )}
                    {' '} v {' '}
                    {isEditing ? (
                        <input
                            className="text-black"
                            type="number"
                            value={awayTeamScore}
                            onChange={(e) => setAwayTeamScore(e.target.value)}
                        />
                    ) : (
                        awayTeamScore
                    )}
                    {' '} {fixture.awayTeam}
                </p>
                <p>{event.toLocaleDateString()} at {event.toLocaleTimeString()}</p>
                <p>{fixture.venue}</p>
                <p>{fixture.round}</p>
                <p>{isEditing ? <select className="text-black" name="matchStatus" value={matchStatus} onChange={(e) => setMatchStatus(e.target.value)}>
                    <option value="scheduled">Scheduled</option>
                    <option value="inprogress">In Progress</option>
                    <option value="postponed">Postponed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="finished">Finished</option>
                </select> : matchStatus}</p>
            </div>
            {role === "admin" &&
                <div className="flex">
                    <button onClick={toggleEdit}>
                        {isEditing ? 'Save Score' : 'Edit Score'}
                    </button>
                    <form action={DeleteFixtureWithIds} className="ml-2">
                        <button type="submit">Delete</button>
                    </form>
                </div>}
        </div>
    );
}