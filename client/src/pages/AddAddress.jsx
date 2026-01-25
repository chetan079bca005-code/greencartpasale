import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'


//input field component
const InputField = ({ type, placeholder, name, handleChange, address, label }) => (
    <div className="space-y-1.5 flex-1 text-left">
        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{label || name}</label>
        <input
            className='w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-500'
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            name={name}
            value={address[name] || ''}
            required />
    </div>
)

const AddAddress = () => {
    const { axios, user, navigate, setUser } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);


    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,

        }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        // Validate user is loaded
        if (!user || !user._id) {
            toast.error('User information not loaded. Please refresh the page.');
            window.location.reload();
            return;
        }
        
        try {
            const { data } = await axios.post('/api/address/add', { userId: user._id, address });
            if (data.success) {
                toast.success(data.message)
                navigate('/cart')
            } else {
                toast.error(data.message)

            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to add address')


        }
    }

    useEffect(() => {
        const loadUser = async () => {
            try {
                // Fetch fresh user data from server
                const { data } = await axios.get('/api/user/is-auth');
                if (data.success && data.user) {
                    setUser(data.user);
                    setIsLoading(false);
                } else {
                    // User not authenticated
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Failed to load user:', error);
                setIsLoading(false);
            }
        };
        
        // If user already exists in context, don't reload
        if (user && user._id) {
            setIsLoading(false);
        } else {
            loadUser();
        }

    }, [])

    return (
        <div className='pb-24 bg-white dark:bg-slate-900 transition-colors duration-500'>
            {/* Header Section */}
            <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 py-16 px-6 text-center relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 inline-block">Shipping Address</span>
                    <h1 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter italic">Add New Address</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                        Please provide your delivery details below to help us get your order to you quickly and safely.
                    </p>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-6 mt-8 relative z-20'>
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your information...</p>
                        </div>
                    </div>
                ) : !user ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                        <p className="text-red-700 dark:text-red-300 font-bold">You need to be logged in to add an address.</p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/80 transition-all"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col lg:flex-row gap-12'>
                        <div className='flex-1 lg:max-w-2xl'>
                            <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 dark:shadow-black/30 border border-slate-100 dark:border-slate-700">
                                <div className="mb-10">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Delivery Details</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Please fill in the form below with your accurate address information.</p>
                                </div>

                                <form onSubmit={onSubmitHandler} className='space-y-6'>
                                    <div className='flex flex-col sm:flex-row gap-6'>
                                        <InputField handleChange={handleChange} address={address}
                                            name="firstName" type="text" placeholder="John" label="First Name" />

                                        <InputField handleChange={handleChange} address={address}
                                            name="lastName" type="text" placeholder="Doe" label="Last Name" />
                                    </div>

                                    <InputField handleChange={handleChange} address={address}
                                        name="email" type="email" placeholder="john.doe@email.com" label="Email Address" />

                                    <InputField handleChange={handleChange} address={address}
                                        name="street" type="text" placeholder="House 123, Sector 4..." label="Street Address" />

                                    <div className='grid grid-cols-2 gap-6'>
                                        <InputField handleChange={handleChange} address={address}
                                            name="city" type="text" placeholder="Kathmandu" label="City" />

                                        <InputField handleChange={handleChange} address={address}
                                            name="state" type="text" placeholder="Bagmati" label="State" />
                                    </div>

                                    <div className='grid grid-cols-2 gap-6'>
                                        <InputField handleChange={handleChange} address={address}
                                            name="zipcode" type="number" placeholder="44600" label="Zip Code" />

                                        <InputField handleChange={handleChange} address={address}
                                            name="country" type="text" placeholder="Nepal" label="Country" />
                                    </div>

                                    <InputField handleChange={handleChange} address={address}
                                        name="phone" type="text" placeholder="+977 98..." label="Phone Number" />

                                    <button className='w-full mt-10 bg-slate-900 dark:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary dark:hover:bg-primary/80 transition-all active:scale-95'>
                                        Save Address
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-1 flex-col justify-center items-center">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all"></div>
                                <img
                                    className='relative w-full max-w-sm transform group-hover:-translate-y-2 transition-transform duration-700'
                                    src={assets.add_address_iamge}
                                    alt='Shipping Illustration'
                                />
                            </div>
                            <div className="mt-12 text-center max-w-sm">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Reliable Delivery</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Your information is secure and will only be used for shipping and processing your orders.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddAddress

