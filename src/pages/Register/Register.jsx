import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ClipLoader from "react-spinners/ClipLoader";

// images
import shape1 from '../../assets/images/shape1.svg';
import shape2 from '../../assets/images/shape2.svg';
import shape3 from '../../assets/images/shape3.svg';
import registerImage from '../../assets/images/registration.png';
import logo from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google.svg';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { registerAction } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await registerAction({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#F3F5F9] flex items-center justify-center p-4 overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <img src={shape1} alt="shape" className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 opacity-50" />
        <img src={shape2} alt="shape" className="absolute bottom-0 left-0 translate-x-1/3 translate-y-1/3 opacity-50" />
        <img src={shape3} alt="shape" className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 opacity-50" />
      </div>

      <div className="container relative z-10 w-full max-w-6xl">
        <div className="grid items-center grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="hidden lg:block">
            <img src={registerImage} alt="Registration Illustration" className="w-full h-auto" />
          </div>

          {/* Form Card */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
            <div className="px-6 py-10 bg-white  rounded-xl shadow-2xl md:px-10">
              <div className="mb-7"><img src={logo} alt="Buddy Script Logo" /></div>
              <p className="mb-2 text-gray-500">Get Started Now</p>
              <h4 className="mb-10 text-4xl font-bold text-gray-800 ">Registration</h4>
              <button type="button" className="flex items-center justify-center w-full py-3 mb-8 font-semibold text-gray-600 transition duration-300 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"><img src={googleIcon} alt="Google Icon" className="mr-3" /><span>Register with google</span></button>
              <div className="flex items-center mb-8"><hr className="flex-grow border-gray-300" /><span className="mx-4 text-gray-400">Or</span><hr className="flex-grow border-gray-300" /></div>
              <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2"><label className="block mb-2 font-medium text-gray-700">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div className="w-1/2"><label className="block mb-2 font-medium text-gray-700">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                </div>
                <div className="mb-4"><label className="block mb-2 font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div className="mb-4"><label className="block mb-2 font-medium text-gray-700">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div className="mb-4"><label className="block mb-2 font-medium text-gray-700">Repeat Password</label><input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} required className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                {error && <p className="mb-4 text-sm text-center text-red-600">{error}</p>}
                <div className="flex items-center mb-8"><input type="radio" id="terms" name="terms" className="w-4 h-4 text-blue-600" defaultChecked /><label htmlFor="terms" className="ml-2 text-gray-600 text-gray-300">I agree to terms & conditions</label></div>
                <button type="submit" disabled={loading} className="flex items-center justify-center w-full py-3 mb-12 text-lg font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                   {loading ? <ClipLoader color={"#ffffff"} size={24} /> : 'Register now'}
                </button>
              </form>
              <p className="text-center text-gray-600 text-gray-300">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;