'use client'
import Link from "next/link";
import { useState } from "react";
import { DeleteComp } from "../actions/actions";

const CompCollapse = ({ competition }: { competition: any }) => {
    const [open, setOPen] = useState(false);
    const toggle = () => {
        setOPen(!open);
    };

    const deleteCompWithId = DeleteComp.bind(null, competition.id);
    return (
        <div>
            <button onClick={toggle}>{competition.formalName} ({competition.informalName})</button>
            {open && <div className="text-white pt-2">
                <p>Name: {competition.formalName}</p>
                <p>Formal Name: {competition.informalName}</p>
                <p>Code: {competition.code}</p>
                <p>Type: {competition.type}</p>
                <br />
                <div className='flex gap-2'>
                    <Link href={`/dashboard/comps/` + competition.id + `?formalName=` + competition.formalName}>Edit</Link>
                    <br />
                    <form action={deleteCompWithId}>
                        <button type="submit">Delete</button>
                    </form>
                </div>

            </div>}
        </div>
    );
};

export default CompCollapse;