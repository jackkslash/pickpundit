import React from 'react'
import Comp from './Comp'

function Competitions({ comps }: { comps: any }) {
    return (
        <div className='flex flex-col gap-4'>
            <h1 className='flex items-center justify-center text-4xl font-ceefaxBulletin uppercase'>Competitions</h1>
            {comps.map((competition: any) => (
                <div className=' '>
                    <Comp competition={competition} />
                </div>
            ))}
        </div>
    )
}

export default Competitions