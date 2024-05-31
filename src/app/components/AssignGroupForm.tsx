import { SubmitTeamToGroup } from "../actions/actions";

export default function AssignGroupForm({ groupList, teamId }: { groupList: any, teamId: any }) {
    const SubmitTeamToGroupWithTeamId = SubmitTeamToGroup.bind(null, teamId)
    return (
        <div>
            <form action={SubmitTeamToGroupWithTeamId}>
                <select className='text-black' name='id'>
                    {groupList.map((g: any) =>
                        <option className='text-black' value={g.id}>{g.name}</option>
                    )}
                </select>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}