import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
  const [state, setState] = React.useState("login")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setShowUserLogin, setUser, axios, navigate } = useAppContext()

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (state === 'register' && !value) {
          error = 'Name is required';
        } else if (state === 'register' && (value.length < 2 || value.length > 50)) {
          error = 'Name must be between 2 and 50 characters';
        } else if (state === 'register' && !/^[a-zA-Z\s]*$/.test(value)) {
          error = 'Name can only contain letters and spaces';
        }
        break;
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (state === 'register') {
          if (value.length < 8) {
            error = 'Password must be at least 8 characters long';
          } else if (!/(?=.*[a-z])/.test(value)) {
            error = 'Password must contain at least one lowercase letter';
          } else if (!/(?=.*[A-Z])/.test(value)) {
            error = 'Password must contain at least one uppercase letter';
          } else if (!/(?=.*\d)/.test(value)) {
            error = 'Password must contain at least one number';
          } else if (!/(?=.*[@$!%*?&])/.test(value)) {
            error = 'Password must contain at least one special character (@$!%*?&)';
          }
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
    
    // Validate field on change
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors = {};
    if (state === 'register') {
      const nameError = validateField('name', name);
      if (nameError) newErrors.name = nameError;
    }
    const emailError = validateField('email', email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validateField('password', password);
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password
      });
      
      if (data.success) {
        toast.success(data.message);
        navigate('/');
        setUser(data.user);
        setShowUserLogin(false);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Toaster position="top-center" />
      <div className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
        <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-xl shadow-2xl">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setShowUserLogin(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {state === "login" ? "Welcome back! Please enter your details." : "Create your account to get started."}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {state === "register" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {state === "register" && (
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Password must contain:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li className={password.length >= 8 ? 'text-green-600' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/(?=.*[a-z])/.test(password) ? 'text-green-600' : ''}>
                    One lowercase letter
                  </li>
                  <li className={/(?=.*[A-Z])/.test(password) ? 'text-green-600' : ''}>
                    One uppercase letter
                  </li>
                  <li className={/(?=.*\d)/.test(password) ? 'text-green-600' : ''}>
                    One number
                  </li>
                  <li className={/(?=.*[@$!%*?&])/.test(password) ? 'text-green-600' : ''}>
                    One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : state === "register" ? "Create Account" : "Sign In"}
              </button>
            </div>

            <div className="text-center text-sm">
              {state === "register" ? (
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setState("login")}
                    className="text-primary hover:text-primary-dull font-medium"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setState("register")}
                    className="text-primary hover:text-primary-dull font-medium"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login