import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useSelector } from 'react-redux';
import { authSelector , LoginAsync } from './authSlice';

export function Auth() {
  const { currentUser, isLoading, error, isAuth } = useSelector(authSelector)
  const dispatch = useAppDispatch();
  console.log("Current user: " ,currentUser);
  console.log('Loading: ', isLoading);
  console.log('error: ',error);
  console.log('is Auth: ',isAuth);
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");


  return (
    <div>
      {
        !isAuth ? 
        <div> 
            <input onChange={(e)=>setUsernameInput(e.target.value)} value={usernameInput} name='Username' placeholder='username' />
            <input onChange={(e)=>setPasswordInput(e.target.value)} value={passwordInput} type='password' name='Password' placeholder='password' />
            <button onClick={() => dispatch(LoginAsync({Username : usernameInput, Password : passwordInput}))}>Log</button>
        </div> : 
        <div> 
            <p>{currentUser?.Id}</p>
            <p>{currentUser?.Name}</p>
        </div>
      }
    </div>
  );
}
