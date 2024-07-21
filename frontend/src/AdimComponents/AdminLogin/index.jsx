import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function AdminLoginForm() {
  const [adminname, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const history = useHistory();


  const onChangeUserName = (e) => {
    setUsername(e.target.value);
  };

  
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  
  const onSubmitLogin = async (e) => {
    e.preventDefault();

    const userDetails = { adminname, password };
    const url = "http://localhost:5001/admin-login/";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userDetails)
    };

    const response = await fetch(url, options);
    const data = await response.json();

      if (response.ok) {
        Cookies.set('jwt_Admin_Token', data.jwtToken, { expires: 30 });
        console.log(data.jwtToken)
        setIsError(false);        
        history.replace("/admin-site");
      } else {
        
        setIsError(true);
        toast.error(data.errMsg, { position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        return;
      }
    
  };
  
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img  className="w-1/2  mx-auto" src="https://fontmeme.com/permalink/240504/21eced2740090b43bd0001634ee2db4e.png" alt="brushers-hands-font" border="0"/> 
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Admin Login
          </h2>
        </div>
        {isError && <ToastContainer/>}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmitLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  onChange={onChangeUserName}
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={onChangePassword}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>             
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminLoginForm;
