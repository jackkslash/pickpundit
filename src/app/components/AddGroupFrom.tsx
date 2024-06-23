import { AddGroup } from "../actions/group.action"

export default function AddGroupFrom({ id }: { id: number }) {

    const AddGroupWithId = AddGroup.bind(null, id)

    return (
        <form action={AddGroupWithId}>
            <label htmlFor="group" />
            <input className='text-black' type="text" name='group' />
            <button type="submit">Add</button>
        </form>
    )
}