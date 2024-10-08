import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../../context/authentication/AuthContext";

const Signout = () => {
    const navigate= useNavigate();
    const { setIsLoggedIn,setCurrentUser,logout} = useAuth();

  return (
    <div>
       <MdLogout onClick={()=>{
        logout();
        navigate('/');
       }} className="text-white w-8 h-8 hover:cursor-pointer"/>
    </div>
  )
}

export default Signout