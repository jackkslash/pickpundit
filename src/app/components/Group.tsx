import React from 'react'
import { DeleteGroup } from '../actions/actions'

export default async function Group({ id, g }: { id: any, g: any }) {
    console.log(g)
    const DeleteGroupWithId = DeleteGroup.bind(null, g.id, id)
    return (
        <div>
            <div>
                <p>Group: {g.name}</p>
                <p>Comp: {g.competitionId}</p>
                <br />
                <form action={DeleteGroupWithId}>
                    <button type="submit">DELETE</button>
                </form>
                <br />
            </div>
        </div>
    )
}
