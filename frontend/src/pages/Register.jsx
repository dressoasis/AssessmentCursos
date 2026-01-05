import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await register(nombre, email, password);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white overflow-x-hidden min-h-screen flex flex-col">
            <div className="relative flex min-h-screen flex-col group/design-root">
                {/* Header / Top Nav */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-[#232f48] px-6 py-4 lg:px-10">
                    <div className="flex items-center gap-4 text-[#111418] dark:text-white">
                        <div className="size-8 text-primary">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">CoursePlatform</h2>
                    </div>
                    <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] dark:bg-[#192233] text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                        <span className="truncate">Log In</span>
                    </Link>
                </header>
                {/* Main Content Area */}
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="layout-content-container flex flex-col w-full max-w-[480px]">
                        {/* Page Heading */}
                        <div className="flex flex-col gap-2 pb-6 pt-2">
                            <h1 className="text-[#111418] dark:text-white tracking-tight text-[32px] font-bold leading-tight">Create your account</h1>
                            <p className="text-[#637588] dark:text-[#92a4c9] text-base font-normal leading-normal">Enter your details to access the courses.</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                <span className="font-medium">Error!</span> {error}
                            </div>
                        )}

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Name Input */}
                            <label className="flex flex-col w-full">
                                <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">Full Name</p>
                                <input
                                    className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#dce0e5] dark:border-[#324467] bg-white dark:bg-[#192233] h-14 placeholder:text-[#637588] dark:placeholder:text-[#92a4c9] p-[15px] text-base font-normal leading-normal transition-colors"
                                    placeholder="Jane Doe"
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </label>
                            {/* Email Input */}
                            <label className="flex flex-col w-full">
                                <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">Email Address</p>
                                <input
                                    className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#dce0e5] dark:border-[#324467] bg-white dark:bg-[#192233] h-14 placeholder:text-[#637588] dark:placeholder:text-[#92a4c9] p-[15px] text-base font-normal leading-normal transition-colors"
                                    placeholder="jane@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>
                            {/* Password Input */}
                            <label className="flex flex-col w-full">
                                <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">Password</p>
                                <div className="flex w-full items-stretch rounded-lg group focus-within:ring-2 focus-within:ring-primary">
                                    <input
                                        className="form-input flex w-full resize-none overflow-hidden rounded-l-lg rounded-r-none text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border border-[#dce0e5] dark:border-[#324467] bg-white dark:bg-[#192233] h-14 placeholder:text-[#637588] dark:placeholder:text-[#92a4c9] p-[15px] border-r-0 pr-2 text-base font-normal leading-normal transition-colors"
                                        placeholder="••••••••"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className="text-[#637588] dark:text-[#92a4c9] flex border border-[#dce0e5] dark:border-[#324467] bg-white dark:bg-[#192233] items-center justify-center pr-[15px] rounded-r-lg border-l-0 cursor-pointer hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined select-none">visibility</span>
                                    </div>
                                </div>
                            </label>
                            {/* Register Button */}
                            <button type="submit" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 mt-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                <span className="truncate">Register</span>
                            </button>
                        </form>
                        {/* Footer Prompt */}
                        <div className="flex justify-center pt-6">
                            <p className="text-[#637588] dark:text-[#92a4c9] text-sm">
                                Already a member?
                                <Link to="/login" className="text-primary font-bold hover:underline ml-1">Log in</Link>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Register;
