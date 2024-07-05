import { Link, useNavigate } from 'react-router-dom'

const Landingnav = () => {
    const navigate = useNavigate();
  return <div>
    <div className='flex justify-between bg-black p-5 '>
    <div className="">
      <p className='text-2xl md:text-3xl lg:text-4xl ml-4 text-white font-bold'>ProBu</p>
    </div>
    <div className="flex justify-start w-1/3 pt-2">
            <Link to='/' className='text-white md:text-xl pr-4 font-normal hover:underline underline-offset-4'>Features</Link>
            <Link to='/' className='text-white md:text-xl pr-4 font-normal hover:underline underline-offset-4'>Pricing</Link>
            <Link to='/' className='text-white md:text-xl pr-4 font-normal hover:underline underline-offset-4'>About</Link>

    </div>
    <div className="flex space-x-2 justify-end w-1/3 pt-2">
    <div id="tooltip-bottom" role="tooltip" className="absolute z-10 invisible inline-block mb-10 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
    Get Started
    <div className="tooltip-arrow" data-popper-arrow></div>
    </div>
    <Link to='/signin' className='text-white text-xl md:text-xl pr-5 font-normal hover:underline underline-offset-4'>Login</Link>
            <button data-tooltip-target="tooltip-bottom" className='bg-white ease-out duration-500 hover:ease-in border-white rounded-md w-32  font-semibold px-2 text-lg md:text-xl' onClick={()=>{
                navigate('/signup');
            }}>Get Started</button>
    </div>
    </div>   
  </div>
  
}

export default Landingnav
