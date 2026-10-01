export default function UsersLayout({ children }: LayoutProps<'/users'>) {
    return (
        <section id="section-users" className="flex flex-col flex-1 bg-white/3 m-8 p-8">
            <h1>This is the Users Layout</h1>
            <div className="flex flex-col flex-1">{children}</div>
        </section>
    );
}
