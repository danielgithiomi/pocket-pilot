import { User } from './_models/user';
import { UsersRender } from './users-list';

export default async function Users() {
    const users = await fetch('https://jsonplaceholder.typicode.com/users', {
        cache: 'no-store'
    }).then((res) => res.json());

    return (
        <div id="users-page" className="flex-1 bg-white/5 m-8 p-8">
            <h1>This is the Users page</h1>

            <UsersRender users={users as User[]} />
        </div>
    );
}
