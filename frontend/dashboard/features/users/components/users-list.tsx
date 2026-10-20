'use client';

import { ReactNode } from 'react';
import { User } from '@features/users';

export const UsersList = ({ users }: { users: User[] }): ReactNode => {
    return (
        <div>
            {users.map((user) => (
                <div key={user.id} onClick={() => alert(`user clicked: ${user.name}`)} className="cursor-pointer">
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
};
