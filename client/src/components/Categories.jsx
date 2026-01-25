import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {
  const { navigate } = useAppContext()

  return (
    <div className=''>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">Inventory Index</span>
          <h2 className='text-3xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 tracking-tight uppercase italic'>Browse Domains</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Systematic categorization of agricultural and household output.</p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="group flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest border-b-2 border-primary/20 hover:border-primary transition-all pb-1"
        >
          Access Collective
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </button>
      </div>


      <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4'>
        {categories.map((category, index) => (
          <div
            key={index}
            className='bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 group cursor-pointer relative overflow-hidden flex flex-col items-center p-4 text-center hover:shadow-lg hover:border-primary dark:hover:border-primary transition-all duration-300'
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0)
            }}
          >
            <div
              className='w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-500 group-hover:rotate-[10deg]'
              style={{ backgroundColor: `${category.bgColor}22` }}
            >
              <img
                src={category.image}
                alt={category.text}
                className='w-8 h-8 object-contain group-hover:scale-110 transition-transform'
              />
            </div>
            <h3 className='font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors text-xs uppercase tracking-tight'>
              {category.text}
            </h3>
          </div>
        ))}
      </div>

    </div>

  )
}

export default Categories
