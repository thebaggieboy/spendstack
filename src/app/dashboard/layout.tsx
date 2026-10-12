export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="dashboard-typography dashboard-layout">{children}</div>
}
