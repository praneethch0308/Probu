import { useNavigate } from "react-router-dom";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import axios from "axios";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";

const UserSchema = z.object({
    userUsername: z.string(),
    userFullName: z.string().min(1, "Enter your full name")
});

function UserUpdate() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(UserSchema)
    });

    const onSubmit = async (formData) => {
        try {
            const accessToken = localStorage.getItem("token");

            const response = await axios.post(
                `${process.env.REACT_API_URL}/user/update?access_token=${accessToken}`,
                formData,
                {
                   
                }
            );

            console.log(response.data);
            navigate("/user");
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <>
            <div className="pb-10">
                <Mainnav />
            </div>
            <div className="flex justify-between">
                <div className="flex">
                    <Sidebar />
                </div>
                <div className="w-2/3 mr-24 mt-10">
                    <div className="text-center text-4xl w-full p-5 bg-gradient-to-r from-black to-neutral-400 py-4 rounded-md">
                        <h1 className="text-white font-semibold">User Update</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-300 p-5 mt-4">
                        <div className="flex justify-between rounded-md mt-6">
                            <div className="w-1/3 mr-4 ">
                                <input disabled
                                    type="text"
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Username"
                                    {...register("userUsername")}
                                />
                                {errors.userUsername && (
                                    <p className="text-red-600 text-sm pl-8">
                                        {errors.userUsername.message}
                                    </p>
                                )}
                            </div>

                            <div className="w-1/3 mr-4">
                                <input
                                    type="text"
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Fullname"
                                    {...register("userFullName")}
                                />
                                {errors.userFullName && (
                                    <p className="text-red-600 text-sm pl-8">
                                        {errors.userFullName.message}
                                    </p>
                                )}
                            </div>

                            <div className="w-1/3">
                                <select
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Roles"
                                    {...register("userRole", { required: true })}
                                >
                                    <option disabled selected>Select Role</option>
                                    <option value="admin">ADMIN</option>
                                </select>
                            </div>
                        </div>
                        <label className="flex items-center space-x-2 mt-3">
                            <input disabled type="checkbox" defaultChecked className="form-checkbox" />
                            <span>Org User</span>
                        </label>
                        <div className="flex justify-evenly mt-4">
                            <button type="submit" className="bg-black w-36 text-white hover:bg-neutral-700 h-8 rounded-lg">
                                Save
                            </button>
                            <button type="button" className="bg-black w-36 text-white hover:bg-neutral-700 h-8 rounded-lg" onClick={() => { navigate('/user') }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserUpdate;
