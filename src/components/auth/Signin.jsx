import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loginnav from '../Loginnav';
import { useAuth } from '../../context/authentication/AuthContext';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

const Signin = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { login, setAccessToken, getUserSecurityData, setUser, setUserSecurity,user } = useAuth(); // Use AuthContext functions

  const onSubmit = async (values) => {
    try {
      console.log('Attempting login...');
      const data = await login(values.username, values.password);
      console.log('Login response:', data);

      if (data !== 'Bad credentials') {
        setAccessToken(data.access_token);
        localStorage.setItem('loggedUser', values.username);
        
        // Ensure the access token is correctly set before making the request
        const token = data.access_token;
        if (token) {
          const userSecurityData = await getUserSecurityData(values.username, token);
          console.log('User security data:', userSecurityData);

          setUser(userSecurityData);
          setUserSecurity(userSecurityData);

          const role = userSecurityData.roles[0];
          const fullName = userSecurityData.fullName;
          const orgId = userSecurityData.orgId;

          localStorage.setItem('orgId', orgId);
          localStorage.setItem('role', role);
            if(userSecurityData.firstLogin){
              navigate('/change-password')
            }
            else{
              navigate('/home');
            }
        
        } else {
          setError('Invalid Credentials1');
        }
      } else {
        setError('Invalid Credentials2');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid Credentials3');
    }
  };
  return (
    <div>
      <Loginnav />
      <div className="h-screen mb-12 flex justify-center flex-col">
        <div className="flex justify-center">
          <div className="bg-zinc-300 px-12 md:px-20 hover:bg-slate-200 pb-5 rounded-md">
            <div className="px-10">
              <div className="text-2xl text-center italic font-extrabold mt-2">
                SIGNIN
              </div>
            </div>
            <div className="">
              <form className="grid col-span-1 justify-center" onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                  <label className="block mb-1 text-sm text-black md:text-xl text-center font-semibold p-2 pb-0">Enter Username</label>
                  <input className="p-2 px-4 rounded-md text-center" {...register('username')} type="text" placeholder="Username" />
                  {errors.username && <div className='text-red-500 text-center'>{errors.username.message}</div>}
                </div>
                <div>
                  <label className="block mb-2 text-sm text-black text-center md:text-xl font-semibold pt-4">Enter Password</label>
                  <input className="border rounded-md border-slate-200 p-2 px-4 text-center" {...register('password')} type="password" placeholder="Password" />
                  {errors.password && <div className='text-red-500 text-center'>{errors.password.message}</div>}
                </div>
                <button disabled={isSubmitting} className="bg-black font-bold text-xl text-white hover:bg-blue-300 w-full rounded mt-3 p-2" type="submit">
                  {isSubmitting ? 'Logging In' : 'Login'}
                </button>
                <div className='flex justify-start pb-3 pt-2'>
                  <p className='text-semibold'>New User?</p>
                  <Link className='text-[#0D21D9] ml-1 hover:underline underline-offset-4' to='/signup'>Click here to signup</Link>
                </div>
                {error && <div className='text-red-500 font-semibold text-xl'>{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
