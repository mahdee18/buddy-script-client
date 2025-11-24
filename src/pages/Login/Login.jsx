import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import ClipLoader from "react-spinners/ClipLoader";
import Swal from 'sweetalert2'; // 1. Import SweetAlert2

// Import your images
import shape1 from '../../assets/images/shape1.svg';
import shape2 from '../../assets/images/shape2.svg';
import shape3 from '../../assets/images/shape3.svg';
import loginImage from '../../assets/images/login.png';
import logo from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google.svg';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginAction } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = await loginAction(credentials);
      
      // 2. Show the success alert
      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Welcome back, ${userData.firstName}!`,
        showConfirmButton: false,
        timer: 2000, // Alert will close after 2 seconds
        timerProgressBar: true,
      });

      // 3. Navigate after the alert has closed
      navigate('/feed');

    } catch (err) {
      // Use SweetAlert2 for errors as well for a consistent look
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || "Please check your credentials and try again.",
      });
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#F3F5F9] flex items-center justify-center p-4 overflow-hidden">
      
      {/* Background Shapes Layer */}
      <div className="absolute inset-0 z-0">
        <img src={shape1} alt="shape" className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 opacity-50" />
        <img src={shape2} alt="shape" className="absolute bottom-0 left-0 translate-x-1/3 translate-y-1/3 opacity-50" />
        <img src={shape3} alt="shape" className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 opacity-50" />
      </div>

      {/* Main Content Wrapper */}
      <div className="container relative z-10 w-full max-w-6xl">
        <div className="grid items-center grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="hidden lg:block">
            <img src={loginImage} alt="Login Illustration" className="w-full h-auto" />
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
            <div className="px-6 py-10 bg-white rounded-xl shadow-2xl md:px-10">
              <div className="mb-7"><img src={logo} alt="Buddy Script Logo" /></div>
              <p className="mb-2 text-gray-500">Welcome back</p>
              <h4 className="mb-10 text-4xl font-bold text-gray-800">Login to your account</h4>
              <button type="button" className="flex items-center justify-center w-full py-3 mb-8 font-semibold text-gray-600 transition duration-300 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"><img src={googleIcon} alt="Google Icon" className="mr-3" /><span>Or sign-in with google</span></button>
              <div className="flex items-center mb-8"><hr className="flex-grow border-gray-300" /><span className="mx-4 text-gray-400">Or</span><hr className="flex-grow border-gray-300" /></div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-700">Email</label>
                  <input type="email" name="email" value={credentials.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-700">Password</label>
                  <input type="password" name="password" value={credentials.password} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                {/* Error is now shown in the alert, but you can keep this as a fallback if you like */}
                {/* {error && <p className="mb-4 text-sm text-center text-red-600">{error}</p>} */}
                <div className="flex flex-wrap items-center justify-between mb-8">
                  <div className="flex items-center"><input type="radio" id="rememberMe" name="remember" className="w-4 h-4 text-blue-600" defaultChecked /><label htmlFor="rememberMe" className="ml-2 text-gray-600">Remember me</label></div>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                </div>
                <button type="submit" disabled={loading} className="flex items-center justify-center w-full py-3 mb-12 text-lg font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                  {loading ? <ClipLoader color={"#ffffff"} size={24} /> : 'Login'}
                </button>
              </form>
              <p className="text-center text-gray-600">
                Dont have an account? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create New Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;