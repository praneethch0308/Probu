import { Link } from 'react-router-dom'
import Landingnav from '../components/Landingnav'


const Landing = () => {
  return (
    <div>
        <Landingnav/>
        <div className='h-screen bg-gradient-to-b  from-black  to-neutral-600'>
            <div className=' grid col-span-1 justify-center'>
            <p className='text-white text-3xl text-center pt-24  '>ProBu is the easiest way for teams to track project budget, track
                team’s work from start to finish.  </p>
                <div className='justify-self-center mt-10'>
                <Link to='/signup' className='bg-white px-10 hover:bg-black hover:text-white hover:border-2 border-white rounded-md mt-3 object-center p-2 text-3xl font-semibold'>Get started</Link>
                </div>               
            </div>
        </div>
    </div>
  )
}

export default Landing
