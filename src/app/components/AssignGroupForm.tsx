import { SubmitTeamToGroup } from "../actions/actions";

export default function AssignGroupForm({ groupList, competitionId }: { groupList: any, competitionId: number }) {
    return (
        <div>
            <form action={SubmitTeamToGroup}>
                <select className='text-black' name='id'>
                    {groupList.map((g: any) =>
                        <option className='text-black' value={g.id}>{g.name}</option>
                    )}
                    <input type="hidden" name="teamId" value={competitionId} />
                </select>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}