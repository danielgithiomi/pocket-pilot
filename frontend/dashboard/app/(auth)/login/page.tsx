import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Login',
    description: 'This is the Login Page'
};

export default function LoginPage() {
    return (
        <div id="login-page">
            <h1 className="mb-4 font-bold text-2xl">This is the Login page</h1>
        </div>
    )
}