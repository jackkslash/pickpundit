import React from 'react'
import Comp from './Comp'
import Link from 'next/link'

function Competitions({ comps }: { comps: any }) {
    return (
        <div>
            <h1 className='flex justify-center py-4 text-3xl font-ceefaxBulletin uppercase'>Competitions</h1>
            {comps.map((competition: any) => (
                <div className=''>
                    <Comp competition={competition} />
                </div>
            ))}
            <Link className='flex justify-center' href="/competitions">All Competitions</Link>
        </div>
    )
}

export default Competitions