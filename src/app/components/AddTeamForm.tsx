import { AddTeamToComp } from "../actions/actions";

export default function AddTeamForm({ allTeams, competitionId }: { allTeams: any, competitionId: any }) {

    const AddTeamToCompWithCompID = AddTeamToComp.bind(null, competitionId);

    return (
        <div>
            <h2>Add Teams</h2>
            <form action={AddTeamToCompWithCompID}>
                <select className='text-black' name='id'>
                    <option value={0}>Select a team</option>
                    {
                        allTeams.map((t: any) =>
                            <option className='text-black' value={t.id}>{t.name}</option>
                        )
                    }</select>

                <button type="submit">Add</button>
            </form>
        </div>
    )
}