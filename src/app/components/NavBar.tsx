import { auth, signIn, signOut } from '@/auth';
import db from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export default async function NavBar() {
    const session = await auth();
    return (
        <nav className='flex h-full justify-between items-center space-x-4'>
            <a href="/">Home</a>
            {session != null ? (
                <div className='flex flex-row items-center justify-center space-x-4'>
                    <a href="/competitions">Competitions</a>
                    <a href="/teams">Teams</a>
                    <a href="/me">Me</a>
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
                        <button type="submit">Switch Role</button>
                    </form>

                    <form
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                    >
                        <button type="submit">Sign Out</button>
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
        </nav>

    )
}
