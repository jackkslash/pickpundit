import { DeleteFixture } from "../actions/actions";

export default function Fixture({ fixture }: { fixture: any }) {
    const DeleteFixtureWithIds = DeleteFixture.bind(null, fixture.id, fixture.competitionId)
    const event = new Date(fixture.date)
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col justify-center w-full h-full">
                <p>Matchday {fixture.matchday}</p>
                <p className="text-white">{fixture.homeTeam} v {fixture.awayTeam}</p>
                <p>{event.toLocaleDateString()} at {event.toLocaleTimeString()}</p>
                <p>{fixture.venue}</p>
                <p>{fixture.status}</p>
                <p>{fixture.round}</p>
            </div>
            <form action={DeleteFixtureWithIds} >
                <button type="submit">Delete</button>
            </form>
        </div>
    );
}