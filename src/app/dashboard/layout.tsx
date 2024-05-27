import AdminNavBar from "../components/AdminNavBar";


export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {/*@ts-expect-error*/}
            <AdminNavBar />
            <main>{children}</main>
        </>
    )
}