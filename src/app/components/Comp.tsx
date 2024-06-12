import Link from "next/link";
import { DeleteComp } from "../actions/actions";
import { auth } from "@/auth";

const Comp = async ({ competition }: { competition: any }) => {
    const session = await auth()

    const deleteCompWithId = DeleteComp.bind(null, competition.id);
    return (
        <div>
            <h1>{competition.formalName} ({competition.informalName})</h1>
            <div className="text-white pt-2">
                <p>Name: {competition.formalName}</p>
                <p>Formal Name: {competition.informalName}</p>
                <p>Code: {competition.code}</p>
                <p>Type: {competition.type}</p>
                <br />
                <div className='flex gap-6'>
                    <Link href={`/competitions/${competition.id}/fixtures`}>Fixtures</Link>
                    {session?.user.role == "admin" &&
                        <>
                            <Link href={`/competitions/` + competition.id + `?formalName=` + competition.formalName + '&type=' + competition.type}>Edit</Link>
                            <form action={deleteCompWithId}>
                                <button type="submit">Delete</button>
                            </form>
                        </>
                    }

                </div>

            </div>
        </div>
    );
};

export default Comp;