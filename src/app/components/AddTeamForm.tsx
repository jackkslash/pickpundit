import db from "@/db"
import { teams } from "@/db/schema"
import { asc } from "drizzle-orm";
import { AddTeamToComp } from "../actions/actions";

export default async function AddTeamForm({ competitionId }: { competitionId: any }) {
    const allTeams = await db.query.teams.findMany(
        { orderBy: [asc(teams.name)] }
    );

    const AddTeamToCompWithCompID = AddTeamToComp.bind(null, competitionId);

    return (
        <div>
            <h2>Add Teams</h2>
            <form action={AddTeamToCompWithCompID}>
                <select className='text-black' name='id'>
                    <option value={0}>Select a team</option>
                    {
                        allTeams.map((t) =>
                            <option className='text-black' value={t.id}>{t.name}</option>
                        )
                    }</select>

                <button type="submit">Add</button>
            </form>
        </div>
    )
}