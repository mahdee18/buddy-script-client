import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import ClipLoader from "react-spinners/ClipLoader";

// Asset Imports
import shape1 from '../../assets/images/shape1.svg';
import shape2 from '../../assets/images/shape2.svg';
import shape3 from '../../assets/images/shape3.svg';
import registerImage from '../../assets/images/registration.png';
import logo from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google.svg';

const BackgroundShapes = React.memo(() => (
    <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={shape1} alt="" className="absolute top-0 left-0 opacity-50 -translate-x-1/3 -translate-y-1/3" />
        <img src={shape2} alt="" className="absolute bottom-0 left-0 opacity-50 translate-x-1/3 translate-y-1/3" />
        <img src={shape3} alt="" className="absolute top-0 right-0 opacity-50 translate-x-1/3 -translate-y-1/3" />
    </div>
));

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: '',
        terms: false
    });
    const [loading, setLoading] = useState(false);
    const { registerAction } = useAuth();
    const navigate = useNavigate();

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    }, []);

    // ─── STRICT CLIENT-SIDE VALIDATION ───
    const isFormValid = useMemo(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
            formData.firstName.trim().length > 0 &&
            formData.lastName.trim().length > 0 &&
            emailRegex.test(formData.email) &&
            formData.password.length >= 6 &&
            formData.password === formData.repeatPassword &&
            formData.terms === true
        );
    }, [formData]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!isFormValid) return;
        setLoading(true);

        try {
            const { repeatPassword, terms, ...registrationData } = formData;
            const userData = await registerAction(registrationData);

            await Swal.fire({
                toast: true, position: 'top-end', icon: 'success',
                title: `Welcome, ${userData.firstName}! Your account is created.`,
                showConfirmButton: false, timer: 2500, timerProgressBar: true,
            });
            navigate('/feed');
            
        } catch (err) {
            // Extracts exact message whether using Axios or standard Fetch
            const backendError = err.response?.data?.message || err.message;
            
            Swal.fire({ 
                icon: 'error', 
                title: 'Registration Failed', 
                text: backendError || "Please try again." 
            });
        } finally {
            setLoading(false);
        }
    }, [formData, isFormValid, registerAction, navigate]);

    return (
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none relative z-10">
            <div className="px-6 py-10 bg-white rounded-xl shadow-2xl md:px-10">
                <img src={logo} alt="Logo" className="mb-7" />
                <p className="mb-2 text-gray-500">Get Started Now</p>
                <h4 className="mb-10 text-4xl font-bold text-gray-800">Registration</h4>
                
                <button type="button" className="flex items-center justify-center w-full py-3 mb-8 font-semibold text-gray-600 transition duration-300 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                    <img src={googleIcon} alt="Google" className="mr-3" />
                    <span>Register with Google</span>
                </button>
                
                <div className="flex items-center mb-8"><hr className="flex-grow" /><span className="mx-4 text-gray-400">Or</span><hr className="flex-grow" /></div>
                
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <label className="block mb-2 font-medium text-gray-700">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-2 font-medium text-gray-700">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Repeat Password</label>
                        <input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-colors ${formData.repeatPassword && formData.password !== formData.repeatPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
                    </div>
                    <div className="flex items-center mb-8">
                        <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} className="w-4 h-4 text-blue-600 cursor-pointer" />
                        <label htmlFor="terms" className="ml-2 text-gray-600 cursor-pointer">I agree to terms & conditions</label>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={!isFormValid || loading} 
                        className={`flex items-center justify-center w-full py-3 mb-12 text-lg font-bold text-white transition duration-300 rounded-lg 
                            ${!isFormValid || loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                    >
                       {loading ? <ClipLoader color="#ffffff" size={24} /> : 'Register'}
                    </button>
                </form>
                <p className="text-center text-gray-600">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Login</Link></p>
            </div>
        </div>
    );
};

const Register = () => {
    return (
        <section className="relative min-h-screen bg-[#F3F5F9] flex items-center justify-center p-4 overflow-hidden">
            <BackgroundShapes />
            <div className="container relative z-10 w-full max-w-6xl">
                <div className="grid items-center grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="hidden lg:block">
                        <img src={registerImage} alt="Illustration" className="w-full h-auto drop-shadow-xl hover:-translate-y-2 transition-transform duration-500" />
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </section>
    );
};

export default Register;