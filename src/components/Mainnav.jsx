import Signout from "./auth/Signout";

const Mainnav = () => {
  return (
    <div>
      <div className='fixed top-0 z-auto w-full bg-black flex justify-between p-3'>
    <img className="h-10 w-36" src="/logo.png"/>
    <Signout/>
    </div>
    </div>   
  )
}

export default Mainnav;
