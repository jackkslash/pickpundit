'use client'
import { useState } from "react";
import { DeleteFixture, UpdateFixtureScores } from "../actions/actions";

export default function Fixture({ fixture }: { fixture: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [homeTeamScore, setHomeTeamScore] = useState(fixture.homeTeamScore);
    const [awayTeamScore, setAwayTeamScore] = useState(fixture.awayTeamScore);

    const DeleteFixtureWithIds = DeleteFixture.bind(null, fixture.id, fixture.competitionId);
    const event = new Date(fixture.date);

    const toggleEdit = () => {
        if (isEditing) {
            handleSave(homeTeamScore, awayTeamScore, fixture.id);
        }
        setIsEditing(!isEditing);
    };

    console.log("fixture", fixture.id);
    const handleSave = (homeTeamScore: number, awayTeamScore: number, fixtureId: number) => {
        UpdateFixtureScores(fixtureId, homeTeamScore, awayTeamScore);
        console.log('Saving scores', { homeTeamScore, awayTeamScore });
    };
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
                <p>{fixture.status}</p>
                <p>{fixture.round}</p>
            </div>

            <div className="flex">
                <button onClick={toggleEdit}>
                    {isEditing ? 'Save Score' : 'Edit Score'}
                </button>
                <form action={DeleteFixtureWithIds} className="ml-2">
                    <button type="submit">Delete</button>
                </form>
            </div>
        </div>
    );
}