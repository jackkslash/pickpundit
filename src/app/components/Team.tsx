'use client'
import { useState } from "react";
import { DeleteTeam } from "../actions/actions";

const Team = ({ team, children, competitionId, role }: { team: any, children?: any, competitionId?: any, role?: any }) => {
    const [open, setOPen] = useState(false);
    const toggle = () => {
        setOPen(!open);
    };

    const deleteTeamBind = DeleteTeam.bind(null, team.id, competitionId);
    console.log("role", role)
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

                {role == "admin" &&
                    <form action={deleteTeamBind}>
                        <button type="submit">DELETE</button>
                    </form>}
                {children}

            </div>}
        </div>
    );
};

export default Team;