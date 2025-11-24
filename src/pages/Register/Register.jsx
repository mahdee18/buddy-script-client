import React, { useState, useCallback } from 'react';
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


// A static, memoized component for the decorative background.
const BackgroundShapes = React.memo(() => (
    <div className="absolute inset-0 z-0">
        <img src={shape1} alt="" className="absolute top-0 left-0 opacity-50 -translate-x-1/3 -translate-y-1/3" />
        <img src={shape2} alt="" className="absolute bottom-0 left-0 opacity-50 translate-x-1/3 translate-y-1/3" />
        <img src={shape3} alt="" className="absolute top-0 right-0 opacity-50 translate-x-1/3 -translate-y-1/3" />
    </div>
));


// The main interactive form component.
const RegisterForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { registerAction } = useAuth();
    const navigate = useNavigate();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (formData.password !== formData.repeatPassword) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Passwords do not match!' });
            return;
        }
        
        setLoading(true);
        try {
            // Destructure to avoid sending repeatPassword to the API.
            const { repeatPassword, ...registrationData } = formData;
            const userData = await registerAction(registrationData);

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Welcome, ${userData.firstName}! Your account is created.`,
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
            });
            navigate('/feed');
        } catch (err) {
            const errorMessage = err.message || "Registration failed. Please try again.";
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: errorMessage });
        } finally {
            setLoading(false);
        }
    }, [formData, registerAction, navigate]);

    return (
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
            <div className="px-6 py-10 bg-white rounded-xl shadow-2xl md:px-10">
                <img src={logo} alt="Buddy Script Logo" className="mb-7" />
                <p className="mb-2 text-gray-500">Get Started Now</p>
                <h4 className="mb-10 text-4xl font-bold text-gray-800">Registration</h4>
                <button type="button" className="flex items-center justify-center w-full py-3 mb-8 font-semibold text-gray-600 transition duration-300 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                    <img src={googleIcon} alt="Google Icon" className="mr-3" />
                    <span>Register with google</span>
                </button>
                <div className="flex items-center mb-8"><hr className="flex-grow" /><span className="mx-4 text-gray-400">Or</span><hr className="flex-grow" /></div>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <label className="block mb-2 font-medium text-gray-700">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-2 font-medium text-gray-700">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Repeat Password</label>
                        <input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center mb-8">
                        <input type="checkbox" id="terms" name="terms" required className="w-4 h-4 text-blue-600" />
                        <label htmlFor="terms" className="ml-2 text-gray-600">I agree to terms & conditions</label>
                    </div>
                    <button type="submit" disabled={loading} className="flex items-center justify-center w-full py-3 mb-12 text-lg font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                       {loading ? <ClipLoader color="#ffffff" size={24} /> : 'Register'}
                    </button>
                </form>
                <p className="text-center text-gray-600">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Login</Link></p>
            </div>
        </div>
    );
};


// The main page component, focused on layout.
const Register = () => {
    return (
        <section className="relative min-h-screen bg-[#F3F5F9] flex items-center justify-center p-4 overflow-hidden">
            <BackgroundShapes />
            <div className="container relative z-10 w-full max-w-6xl">
                <div className="grid items-center grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="hidden lg:block">
                        <img src={registerImage} alt="Illustration of people registering online" className="w-full h-auto" />
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </section>
    );
};

export default Register;