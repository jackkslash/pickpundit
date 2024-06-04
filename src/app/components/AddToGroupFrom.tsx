import { AddGroup } from "../actions/actions"

export default function AddToGroupFrom({ id }: { id: number }) {

    const AddGroupWithId = AddGroup.bind(null, id)

    return (
        <form action={AddGroupWithId}>
            <label htmlFor="group" />
            <input className='text-black' type="text" name='group' />
            <button type="submit">Add</button>
        </form>
    )
}