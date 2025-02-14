import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { backend_url } from '../config';
import { useRef, useState } from 'react';
import axios from 'axios';
import { LoadingAtom, IncorrectAtom, CorrectAtom } from '../atoms/LoadingAtom';
import { useRecoilState } from 'recoil';
import { Loader } from './Loader';
import { Spinner } from './Spinner';
import { Tick } from './Tick';
import { Cross } from './Cross';

export function Signup(){
    const [loading, setLoading] = useRecoilState(LoadingAtom);
    const [incorrect, setIncorrect] = useRecoilState(IncorrectAtom);
    const [correct, setCorrect] = useRecoilState(CorrectAtom);
    const [loaderText , setLoaderText] = useState("");

    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    function incorrectCreds(){
        setIncorrect(true)
        setTimeout(() => {
            setIncorrect(false);
        }, 1000);
    }

    function correctCreds(){
        setCorrect(true)
        setTimeout(() => {
            setCorrect(false);
            navigate("/signin")
        }, 1000);
    }

    async function signup(){
        try{
            setLoading(true);
            const response = await axios.post(`${backend_url}/api/v1/signup`,{
                username:usernameRef.current?.value,
                password:passwordRef.current?.value
            })
           setLoaderText(response.data.message)
            setLoading(false)
            correctCreds();
        }catch(e:any){
            setLoaderText(e.response.data.message)
            setLoading(false);
            incorrectCreds();
        }
    }

    return <div className={`flex items-center w-screen min-h-screen bg-black text-[#eeeeee] justify-center`}  style={{fontFamily:'"Figtree", serif'}}>

        { correct &&  <Loader svg={<Tick />} text={loaderText} /> }
        { incorrect &&  <Loader svg={<Cross />} text={loaderText} /> }

        { loading && <Loader svg={<Spinner />} text="Please wait" /> }
        
        <div className='lg:w-[30%] w-[60%] flex flex-col gap-10 items-center'>
            <img onClick={() => navigate("/")} className='w-14 cursor-pointer' src={logo} alt="" />

            <div className='flex flex-col items-center gap-2'>
                <h1 className='text-4xl font-semibold'>Sign up for free</h1>
                <p className='text-md text-[#9CA3AF]'>Already have an account? <span onClick={() => navigate("/signin")} className='cursor-pointer text-[#6b72ff]'>Sign in.</span></p>
            </div>

            <div className='flex flex-col items-start justify-start w-full gap-2'>
                <label className='text-[#9CA3AF] text-sm' htmlFor="username">Username</label>
                <input autoFocus ref={usernameRef} id='username' className='outline-none w-[100%] border-[1px] border-[#232323] px-4 p-2 rounded-lg bg-[#131313]' type="text" placeholder='Your Username' />
            </div>

            <div className='flex flex-col items-start justify-start w-full gap-2'>
                <label className='text-[#9CA3AF] text-sm' htmlFor="password">Password</label>
                <input ref={passwordRef} id='password' className='outline-none w-[100%] border-[1px] border-[#232323] fill-white px-4 p-2 rounded-lg bg-[#131313]' type="password" placeholder='Your Password' />
            </div>

            <button onClick={signup} className="text-[#eeeeee] font-medium px-4 py-2 rounded-lg bg-[#6b72ff] border-2 border-[#6b72ff] hover:bg-black  transition-all duration-300 w-full">Sign Up</button>
        </div>

    </div>
}