import AdminNavBar from "../components/AdminNavBar";

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminNavBar />
            <main>{children}</main>
        </>
    )
}