import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../../context/authentication/AuthContext";

const Signout = () => {
    const navigate= useNavigate();
    const { setIsLoggedIn,setCurrentUser} = useAuth();

  return (
    <div>
       <MdLogout onClick={()=>{
         localStorage.removeItem('token');
         localStorage.removeItem('username');
         localStorage.removeItem('orgId');
         localStorage.removeItem('loggedUser');
         localStorage.removeItem('role');
         localStorage.removeItem('currentUser');
         localStorage.removeItem('userDetails');
         localStorage.removeItem('loggedUser');
         setIsLoggedIn(false);
         setCurrentUser(null);
         navigate('/');
       }} className="text-white w-8 h-8 hover:cursor-pointer"/>
    </div>
  )
}

export default Signout