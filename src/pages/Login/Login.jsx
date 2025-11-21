import React from 'react';
import shape1 from '../../assets/images/shape1.svg';
import shape2 from '../../assets/images/shape2.svg';
import shape3 from '../../assets/images/shape3.svg';
import loginImage from '../../assets/images/login.png';
import logo from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google.svg';

const Login = () => {
  return (
    <section className="relative flex items-center min-h-screen bg-white overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4">
        <img src={shape1} alt="shape" />
      </div>
      <div className="absolute bottom-0 left-0 translate-x-1/4 translate-y-1/4">
        <img src={shape2} alt="shape" />
      </div>
      <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4">
        <img src={shape3} alt="shape" />
      </div>

      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          {/* Left Side: Image */}
          <div className="w-full px-4 lg:w-2/3">
            <div className="hidden lg:block">
              <img src={loginImage} alt="Login Illustration" className="w-full h-auto" />
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full px-4 lg:w-1/3">
            <div className="px-6 py-12 bg-white rounded-lg shadow-lg md:px-12">
              <div className="mb-7">
                <img src={logo} alt="Buddy Script Logo" />
              </div>
              <p className="mb-2 text-gray-500">Welcome back</p>
              <h4 className="mb-12 text-4xl font-bold text-gray-800">Login to your account</h4>

              <button
                type="button"
                className="flex items-center justify-center w-full py-3 mb-10 font-semibold text-gray-600 transition duration-300 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <img src={googleIcon} alt="Google Icon" className="mr-3" />
                <span>Or sign-in with google</span>
              </button>

              <div className="flex items-center mb-10">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-4 text-gray-400">Or</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <form>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between mb-10">
                  <div className="flex items-center">
                    <input type="radio" id="rememberMe" name="remember" className="w-4 h-4 text-blue-600" defaultChecked />
                    <label htmlFor="rememberMe" className="ml-2 text-gray-600">Remember me</label>
                  </div>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mb-16 text-lg font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Login now
                </button>
              </form>

              <p className="text-center text-gray-600">
                Dont have an account? <a href="/register" className="font-semibold text-blue-600 hover:underline">Create New Account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;