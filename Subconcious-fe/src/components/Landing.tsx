import logo from '../assets/logo.svg'
import landing_video from '../assets/landing_video.mp4'
import { Button } from './Button'
import { useNavigate } from 'react-router-dom'

export function Landing(){
    const navigate = useNavigate();

    function signup(){
        navigate("/signup")
    }

    function signin(){
        navigate("/signin")
    }
    

    return <div className='w-screen px-20 bg-black text-[#EEEEEE] flex flex-col items-center justify-between min-h-screen'>
        <video src={landing_video} className='fixed top-0 left-0 overflow-hidden md:translate-y-64 translate-y-80' muted autoPlay loop>Your browser does not support video.</video>

        <div onClick={() => navigate("/")} className='fixed cursor-pointer flex gap-2 items-center'>
            <img src={logo} alt="" />
            <p className='font-["Domine"]'>Subconcious.io</p>
        </div>
        
        <div className='z-10 flex flex-col items-center md:leading-[6rem] tracking-[-0.07em] text-center lg:text-[7rem] md:text-[5rem] text-[4rem] leading-[4rem]' style={{fontFamily:'"Old Standard TT", serif'}}>
            <p className='lg:text-[7rem] md:text-[5rem] text-[3rem]'>It’s now your official</p>
            <p className='text-[#6B72FF]'>Second Brain</p>
        </div>

        <div className='z-10 flex justify-between items-center w-[90%] sm:w-[70%] md:w-[43%] px-4 rounded-2xl py-2 bg-[#131313] border-[1px] border-[#242424]' style={{fontFamily:'"Figtree", serif'}}>
            <img onClick={() => navigate("/")} className='cursor-pointer' src={logo} alt="" />
            <div className='flex items-center gap-3'>
                <Button onClick={signup} text='Register'/>
                <Button onClick={signin} text='Login'/>
            </div>
        </div>
    </div>
}