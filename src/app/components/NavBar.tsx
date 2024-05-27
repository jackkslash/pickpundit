import { auth, signIn, signOut } from '@/auth';

export default async function NavBar() {
    const session = await auth();
    return (
        <nav className='flex h-full justify-between items-center space-x-4'>
            <a href="/">Home</a>
            {session != null ? (
                <div className='flex flex-row items-center justify-center space-x-4'>
                    <a href="/me">Me</a>
                    {session?.user.role == "admin" ? (
                        <a href="/dashboard">Dashboard</a>
                    ) : (
                        null
                    )}
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
