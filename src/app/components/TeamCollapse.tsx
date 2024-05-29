'use client'
import { useState } from "react";
import { DeleteTeam } from "../actions/actions";

const TeamCollapse = ({ team }: { team: any }) => {
    const [open, setOPen] = useState(false);
    const toggle = () => {
        setOPen(!open);
    };

    const deleteTeamWithId = DeleteTeam.bind(null, team.id);

    return (
        <div>
            <button onClick={toggle}>{team.name} ({team.tla})</button>
            {open && <div key={team.id}>
                <p>{team.name}</p>
                <p>{team.shortName}</p>
                <p>{team.tla}</p>
                <p>{team.crest}</p>
                <p>{team.address}</p>
                <p>{team.website}</p>
                <p>{team.founded}</p>
                <p>{team.clubColors}</p>
                <p>{team.venue}</p>
                {team.group && <p>{team.group}</p>}
                <form action={deleteTeamWithId}>
                    <button type="submit">DELETE</button>
                </form>
            </div>}
        </div>
    );
};

export default TeamCollapse;