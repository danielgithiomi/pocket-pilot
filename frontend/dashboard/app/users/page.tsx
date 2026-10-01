import { User, UsersList } from '@features/users';

export default async function Users() {
    const users = await fetch('https://jsonplaceholder.typicode.com/users', {
        cache: 'no-store'
    }).then((res) => res.json());

    return (
        <div id="users-page" className="flex-1 bg-inverted-background/5 m-8 p-8">
            <h1 className="mb-4 font-bold text-2xl">This is the Users page</h1>

            <UsersList users={users as User[]} />
        </div>
    );
}
