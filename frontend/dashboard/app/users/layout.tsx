export default function UsersLayout({ children }: LayoutProps<'/users'>) {
    return (
        <section className="flex flex-col flex-1 justify-center items-center bg-red-600 font-sans">
            <div className="flex flex-col flex-1 justify-between items-center sm:items-start bg-white dark:bg-black px-16 py-32 w-full max-w-3xl">
                {children}
            </div>
        </section>
    );
}