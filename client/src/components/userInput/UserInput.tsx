import React,{useState} from 'react'
import { User } from '../../interfaces/chatInterfaces';
import {useSetRecoilState} from 'recoil'
import { userAtom } from '../../context/chatStateManagment';

const UserInput = ({socket}:any) => {
    
    const [name, setName] = useState('');
    const setUser = useSetRecoilState(userAtom);

    function changeUser(){
        if(name.trim() === '') return;
        setUser({name,id:socket.id});
    }

    function onEnter(e:any){
        if(e.key == 'Enter')
            changeUser();
    }

    return (
    <div className='w-screen h-screen justify-center items-center flex bg-[#1D1E24]'>
        <div className='rounded-[5px]  p-4 border border-black w-fit bg-[#2b3141] text-white'>
            <h2>User Name</h2>
            <input className='p-1 my-2 border-b outline-none rounded text-black' type={'text'} onKeyDown={(e)=>onEnter(e)} onChange={(e)=>setName(e.target.value)}/>
            <br />
            <button onClick={changeUser} className='rounded m-auto block hover:bg-green-500 duration-200 p-2 bg-green-400 mt-2'>Enter Name</button>
        </div>
    </div>
  )
}

export default UserInput