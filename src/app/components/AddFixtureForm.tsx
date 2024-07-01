'use client'
import { useState } from "react";
import { AddFixture } from "../actions/fixture.action"

export default function AddFixtureForm({ teams, comp }: { teams: any, comp: any }) {
    const [selectedVenues, setSelectedVenues] = useState<any>([]);

    const handleTeamSelection = (event: any) => {
        const selectedTeamId = event.target.value;

        const selectedTeam = teams.find((team: { id: any }) => team.id.toString() === selectedTeamId);

        if (selectedTeam) {
            if (!selectedVenues.includes(selectedTeam.venue)) {
                setSelectedVenues((prevSelectedVenues: any) => {
                    const newVenues = [...prevSelectedVenues, selectedTeam.venue];
                    return newVenues;
                });
            }
        }
    };

    const AddFixturesWithId = AddFixture.bind(null, comp.id)

    return (
        <div className="items-center justify-center">
            <form action={AddFixturesWithId} className="flex flex-col gap-2 w-64 p-2">
                <label>Home Team</label>
                <select name="homeTeamId" id="homeTeam" className="text-black" onChange={handleTeamSelection}>
                    <option value="">Select Home Team</option>
                    {teams.map((t: any) => (
                        <option className="text-black" key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
                <label>Away Team</label>
                <select name="awayTeamId" id="awayTeam" className="text-black" onChange={handleTeamSelection}>
                    <option value="">Select Away Team</option>
                    {teams.map((t: any) => (
                        <option className="text-black" key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
                <label>Date</label>
                <input className="text-black" type="datetime-local" name="date" id="date" />
                <label>Venue</label>
                <select name="venue" id="venue" className="text-black">
                    <option value="" className="text-black">Select Venue</option>
                    {selectedVenues.map((v: any, index: number) => (
                        <option className="text-black" key={index} value={v}>{v}</option>
                    ))}
                </select>
                <label>New Venue</label>
                <input className="text-black" type="text" name="newVenue" id="newVenue" />
                <label>Matchday</label>
                <input className="text-black" type="text" name="matchday" id="matchday" />
                <button type="submit">Add</button>
            </form>
        </div>
    );
}