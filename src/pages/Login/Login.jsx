import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import ClipLoader from "react-spinners/ClipLoader";

// Asset Imports
import shape1 from '../../assets/images/shape1.svg';
import shape2 from '../../assets/images/shape2.svg';
import shape3 from '../../assets/images/shape3.svg';
import loginImage from '../../assets/images/login.png';
import logo from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google.svg';

const BackgroundShapes = React.memo(() => (
    <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={shape1} alt="" className="absolute top-0 left-0 opacity-50 -translate-x-1/3 -translate-y-1/3" />
        <img src={shape2} alt="" className="absolute bottom-0 left-0 opacity-50 translate-x-1/3 translate-y-1/3" />
        <img src={shape3} alt="" className="absolute top-0 right-0 opacity-50 translate-x-1/3 -translate-y-1/3" />
    </div>
));

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginAction } = useAuth();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    }, []);

    // ─── STRICT CLIENT-SIDE VALIDATION ───
    const isFormValid = useMemo(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
            emailRegex.test(credentials.email) &&
            credentials.password.length >= 6
        );
    }, [credentials]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!isFormValid) return;
        setLoading(true);

        try {
            const userData = await loginAction(credentials);
            
            await Swal.fire({
                toast: true, position: 'top-end', icon: 'success',
                title: `Welcome back, ${userData.firstName}!`,
                showConfirmButton: false, timer: 2000, timerProgressBar: true,
            });
            navigate('/feed');
            
        } catch (err) {
            // Extracts exact message whether using Axios or standard Fetch
            const backendError = err.response?.data?.message || err.message;

            // Handle the Rate Limiter specific error
            if (err.response?.status === 429 || backendError.includes('Too many')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Blocked',
                    text: 'Due to multiple failed login attempts, your IP has been temporarily blocked for 1 hour for security reasons.',
                    confirmButtonColor: '#d33',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: backendError || "Invalid email or password. Please try again.",
                });
            }
        } finally {
            setLoading(false);
        }
    }, [credentials, isFormValid, loginAction, navigate]);

    return (
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none relative z-10">
            <div className="px-6 py-10 bg-white rounded-xl shadow-2xl md:px-10">
                <img src={logo} alt="Buddy Script Logo" className="mb-7" />
                <p className="mb-2 text-gray-500">Welcome back</p>
                <h4 className="mb-10 text-4xl font-bold text-gray-800">Login to your account</h4>
                
                <button type="button" className="flex items-center justify-center w-full py-3 mb-8 font-semibold text-gray-600 transition duration-300 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                    <img src={googleIcon} alt="Google" className="mr-3" />
                    <span>Or sign-in with Google</span>
                </button>
                
                <div className="flex items-center mb-8"><hr className="flex-grow" /><span className="mx-4 text-gray-400">Or</span><hr className="flex-grow" /></div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={credentials.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Password</label>
                        <input type="password" name="password" value={credentials.password} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between mb-8">
                        <div className="flex items-center">
                            <input type="checkbox" id="rememberMe" name="remember" className="w-4 h-4 text-blue-600 cursor-pointer" defaultChecked />
                            <label htmlFor="rememberMe" className="ml-2 text-gray-600 cursor-pointer">Remember me</label>
                        </div>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                    </div>

                    <button 
                        type="submit" 
                        disabled={!isFormValid || loading} 
                        className={`flex items-center justify-center w-full py-3 mb-12 text-lg font-bold text-white transition duration-300 rounded-lg
                            ${!isFormValid || loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                    >
                        {loading ? <ClipLoader color="#ffffff" size={24} /> : 'Login'}
                    </button>
                </form>

                <p className="text-center text-gray-600">
                    Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create New Account</Link>
                </p>
            </div>
        </div>
    );
};

const Login = () => {
    return (
        <section className="relative min-h-screen bg-[#F3F5F9] flex items-center justify-center p-4 overflow-hidden">
            <BackgroundShapes />
            <div className="container relative z-10 w-full max-w-6xl">
                <div className="grid items-center grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="hidden lg:block">
                        <img src={loginImage} alt="Illustration" className="w-full h-auto drop-shadow-xl hover:-translate-y-2 transition-transform duration-500" />
                    </div>
                    <LoginForm />
                </div>
            </div>
        </section>
    );
};

export default Login;