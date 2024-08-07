import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useHistory,Link } from 'react-router-dom';

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AdminRegister() {
    const [adminname, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const  [RegisterLoading,setRegistorLoading]=useState(false)
    const history = useHistory();

    const onChangeRegisterUserName = (e) => {
        setUsername(e.target.value);
    };

    const onChangeRegisterPassword = (e) => {
        setPassword(e.target.value);
    };

    const onChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const onSubmitRegister = async (e) => {
        e.preventDefault();
        setRegistorLoading(true)
        if (password !== confirmPassword) {
            toast.error("Passwords do not match", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setRegistorLoading(false)
            return;
        }
    
        const userDetails = { adminname, password };
        const jwtToken = Cookies.get('jwt_Admin_Token');
        const apiUrl = import.meta.env.VITE_API_URL; 
        const url = `${apiUrl}admin/register/`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(userDetails)
        };
    
        console.log('Sending request to server:', options); // Log request options
    
        try {
            const response = await fetch(url, options);
            const data = await response.json();
    
            console.log('Response status:', response.status); // Log status code
            console.log('Response data:', data); // Log response data
    
            if (response.ok) {
                 toast.success("Account created successfully", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => history.replace("/admin-site"), 2000);
            } else {
                toast.error(data.errMsg || "An error occurred", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.error('Fetch error:', error); // Log fetch error
            toast.error("An error occurred", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }finally {
          setRegistorLoading(false);
        }
    };
    
        return(
<><Link to="/admin-site" className="">
<button className='h-12 w-20 fixed top-4 bg-sky-400 mt-6 mx-10 rounded-lg'>
Go Back
</button></Link>
<div className='bg-slate-900 max-h-screen p-7 flex justify-center'>
      <div className='flex flex-row'>
        
      <div className=" flex w-96 flex-1 flex-col justify-center  py-12 lg:px-8 ">
        
        <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
        <img  className="w-1/2  mx-auto" src="https://fontmeme.com/permalink/240504/21eced2740090b43bd0001634ee2db4e.png" alt="brushers-hands-font" border="0"/>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-sky-400">
            Create a New Admin account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6"  onSubmit={onSubmitRegister}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-sky-400">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="usernmae"
                  type="text"
                  onChange={onChangeRegisterUserName}
                   className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   required
               />
              </div>
             
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-sky-400">
                  Password
                </label>
             
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={onChangeRegisterPassword}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-sky-400">
                Confirm Password
                </label>
             
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={onChangeConfirmPassword}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <ToastContainer/>
            <div>
              <button
                type="submit"
                disabled={RegisterLoading}
                className="flex w-full justify-center rounded-md bg-red-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white  hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                {RegisterLoading ? "Loading..." :"Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
      </div>
    </>
        )

    }

export default AdminRegister
