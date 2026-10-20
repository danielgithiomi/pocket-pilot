import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register',
    description: 'This is the Register Page'
};

export default function RegisterPage() {
    return (
        <div id="register-page">
            <h1 className="mb-4 font-bold text-2xl">This is the Register page</h1>
        </div>
    );
}
