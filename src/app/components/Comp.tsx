import Link from "next/link";
import { DeleteComp } from "../actions/actions";
import { auth } from "@/auth";

const Comp = async ({ competition }: { competition: any }) => {
    const session = await auth();

    const deleteCompWithId = DeleteComp.bind(null, competition.id);
    return (
        <div className="flex flex-col px-4 w-full h-16 mb-6 space-y-2 mx-auto sm:w-72 ">
            <div className='flex justify-between items-center'>
                <h1>
                    <Link href={`/competitions/${competition.id}/fixtures`}>
                        {competition.formalName}
                    </Link>
                </h1>
                <div>{competition.id}</div>
            </div>

            {session?.user.role === "admin" && (
                <div className="flex text-white gap-4 pb-4">
                    <Link href={`/competitions/${competition.id}/fixtures`}>Fixtures</Link>
                    <Link href={`/competitions/` + competition.id + `?formalName=` + competition.formalName + '&type=' + competition.type}>Edit</Link>
                    <form action={deleteCompWithId}>
                        <button type="submit">Delete</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Comp;