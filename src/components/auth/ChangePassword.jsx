import React, { useState } from 'react';
import Loginnav from '../Loginnav';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/authentication/AuthContext';
import { PasswordUpdateData } from '../../context/authentication/AuthState';
import { z } from 'zod';

const schema = z.object({
  newPassword: z.string().min(1, 'New Password is required'),
  confirmpassword: z.string().min(1, 'Confirmation Password is required')
});

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { Chngepass, logout } = useAuth();
  const orgId = localStorage.getItem("orgId");
  const loggedUser  = localStorage.getItem("loggedUser");

  const onSubmit = async (values) => {
    try {
      const passwordData = new PasswordUpdateData();
      passwordData.username = loggedUser ;
      passwordData.newPassword = values.newPassword;
      passwordData.orgId = orgId;
      const response = await Chngepass(passwordData);
      console.log(response.data);
      if (response.data) {
        window.alert("password updated")
        logout();
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid Credentials');
    }
  };

  return (
    <div>
      <Loginnav />
      <div className="h-screen mb-12 flex justify-center items-center">
        <div className="bg-zinc-300 px-12 md:px-20 hover:bg-slate-200 pb-5 rounded-md">
          <h2 className="text-2xl text-center italic font-extrabold mt-2">Change Password</h2>
          <form className="flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full max-w-xs">
              <label className="block mb-1 text-sm text-black md:text-xl text-center font-semibold p-2 pb-0">New Password</label>
              <input
                className="w-full p-2 px-4 rounded-md text-center"
                {...register('newPassword')}
                type="password"
                placeholder="Enter new password"
              />
              {errors.newPassword && <div className='text-red-500 text-center'>{errors.newPassword.message}</div>}
            </div>
            <div className="w-full max-w-xs mt-4">
              <label className="block mb-2 text-sm text-black text-center md:text-xl font-semibold pt-4">Confirm Password</label>
              <input
                className="w-full border rounded-md border-slate-200 p-2 px-4 text-center"
                {...register('confirmpassword')}
                type="password"
                placeholder="Re-enter password"
              />
              {errors.confirmpassword && <div className='text-red-500 text-center'>{errors.confirmpassword.message}</div>}
            </div>
            <button
              disabled={isSubmitting}
              className="bg-black font-bold text-xl text-white hover:bg-blue-300 w-full rounded mt-3 p-2"
              type="submit"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
            <div className='flex justify-start pb-3 pt-2'>
              <p className='text-semibold'>Already have an account?</p>
              <Link className='text-[#0D21D9] ml-1 hover:underline underline-offset-4' to='/signin'>Click here to login</Link>
            </div>
            {error && <div className='text-red-500 font-semibold text-xl'>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;