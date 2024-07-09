import { auth, signIn, signOut } from '@/auth';
import db from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export default async function NavBar() {
    const session = await auth();
    const debug = false;
    return (
        <nav className='flex flex-col font-ceefaxBulletin uppercase pt-4 space-y-8 pb-4 w-full'>
            <div className='flex flex-row items-center justify-center space-x-8 text-[8px]'>
                <p>PickPundit</p>
                {session != null ? (
                    <div className='flex flex-row space-x-2 justify-center sm:space-x-4' >
                        <a href={"/" + session.user.username}>Me</a>
                        {debug &&
                            <form
                                action={async () => {
                                    "use server";
                                    let userRole = session.user.role;
                                    userRole = (userRole === "admin") ? "user" : "admin";

                                    await db.update(users)
                                        .set({ role: userRole })
                                        .where(eq(users.id, session.user.id as string))
                                    revalidatePath('/')
                                }}

                            >
                                <button type="submit" className='uppercase'>Switch Role</button>
                            </form>}

                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                            }}
                        >
                            <button type="submit" className='uppercase'>Sign Out</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <form
                            action={async () => {
                                "use server"
                                await signIn("google")
                            }}
                        >
                            <button type="submit">Signin</button>
                        </form>
                    </div>

                )}
            </div>
            <div className='flex flex-row items-center justify-center space-x-2 text-m '>
                <a className=' text-black space-x-2' href="/">
                    <span className='bg-white p-4'>P</span>
                    <span className='bg-white p-4'>P</span>
                    <span className='bg-white p-4'>D</span>
                </a>
                <h1><span className=' bg-blue-500 p-4'>Football</span></h1>
            </div>

        </nav>

    )
}
