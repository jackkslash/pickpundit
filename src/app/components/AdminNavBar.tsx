import { auth } from '@/auth';

export default async function NavBar() {
    const session = await auth();
    return (
        <nav className='flex flex-row items-center justify-center space-x-4 pt-6'>
            <a href="/dashboard/comps">Comps</a>
            <a href="/dashboard/teams">Teams</a>
        </nav>

    )
}
