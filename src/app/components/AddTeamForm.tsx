'use client'
import { useFormState } from "react-dom";
import { AddTeamToComp } from "../actions/competition.action";

const initialState = {
    message: "",
    type: ""
}

export default function AddTeamForm({ allTeams, competitionId }: { allTeams: any, competitionId: any }) {

    const AddTeamToCompWithCompID = AddTeamToComp.bind(null, competitionId);
    const [state, formAction] = useFormState(AddTeamToCompWithCompID, initialState)

    return (
        <div>
            <h2>Add Teams</h2>
            <form action={formAction}>
                <select className='text-black' name='id'>
                    <option value={0}>Select a team</option>
                    {
                        allTeams.map((t: any) =>
                            <><option className='text-black' value={parseInt(t.id)}>{t.name}</option></>
                        )
                    }</select>
                <p className="text-red-500">{state.message}</p>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}