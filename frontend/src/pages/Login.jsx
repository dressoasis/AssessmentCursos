import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased min-h-screen flex flex-col">
            <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="w-8 h-8 text-primary">
                                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path>
                                </svg>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">CoursePlatform</span>
                        </div>
                        <div>
                            <a className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Help Center</a>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl dark:shadow-none dark:border dark:border-slate-800 overflow-hidden">
                        <div className="p-8 sm:p-10">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                                <p className="text-slate-500 dark:text-slate-400">Log in to continue your learning journey</p>
                            </div>
                            {error && (
                                <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                    <span className="font-medium">Error!</span> {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200 mb-2" htmlFor="email">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-[#111722] dark:ring-slate-700 dark:text-white dark:placeholder:text-slate-500 sm:text-sm sm:leading-6"
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200" htmlFor="password">
                                            Password
                                        </label>
                                        <div className="text-sm">
                                            <a className="font-semibold text-primary hover:text-primary/80 transition-colors" href="#">Forgot password?</a>
                                        </div>
                                    </div>
                                    <div className="relative rounded-lg shadow-sm">
                                        <input
                                            className="block w-full rounded-lg border-0 py-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-[#111722] dark:ring-slate-700 dark:text-white dark:placeholder:text-slate-500 sm:text-sm sm:leading-6"
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <button className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none" type="button">
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-bold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200" type="submit">
                                        Log In
                                    </button>
                                    <Link className="flex w-full justify-center rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-bold leading-6 text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 transition-all duration-200 dark:border-slate-700 dark:bg-transparent dark:text-white dark:hover:bg-slate-800" to="/register">
                                        Register
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
