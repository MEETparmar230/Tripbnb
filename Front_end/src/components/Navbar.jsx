import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HomePng from '../assets/Home.png'
import Searchbox from './Searchbox';





export default function Navbar() {

    const location = useLocation()
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false)
    const [isAuth, setIsAuth] = useState(false);
    
    const isHome = location.pathname === "/"

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const checkAuth = () => {
        axios.get('http://localhost:8080/check-auth', { withCredentials: true })
            .then((res) => {
                setIsAuth(Boolean(res.data.isAuthenticated))
            })
            .catch((err) => console.error('Error:', err));
    }

    const handleLogOut = () => {
        axios
            .get('http://localhost:8080/logout', { withCredentials: true })
            .then(() => {
                setIsAuth(false);
                navigate('/');
            })
            .catch((err) => console.log('Logout error:', err));
            setMenuOpen(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    



    return (
        <div className='bg-gray-200'>
            <div className='mx-5 flex justify-between flex-wrap py-7'>
                <div onClick={() => navigate('/')} className=' text-3xl text-gray-700 flex items-center gap-1 hover:text-gray-800 cursor-pointer'><i className="fa-brands fa-airbnb "></i> <h3 className='font-medium'>Tripbnb</h3>
                </div>
                {isHome && <div className=' hidden md:block lg:block'><Searchbox/></div>}
                <div className='flex items-center gap-5'>
                    {isHome && <button className='text-gray-700 hover:text-gray-800 font-medium cursor-pointer md:block lg:block hidden' onClick={() => {navigate('listings/new'); setMenuOpen(false);}}>Become Host</button>}
                    <div className='relative'>

                        <button ref={buttonRef} onClick={toggleMenu}><i className="fa-solid fa-bars px-3 py-[10px] bg-gray-300 rounded-full cursor-pointer"></i></button>
                        {menuOpen &&
                            <div ref={menuRef} className='bg-white absolute w-70  right-0 z-50 rounded-lg shadow-lg py-4 mt-2  '>
                                <div className='flex flex-col gap-2 items-start '>

                                    <button className='flex justify-start items-center gap-2  border-b border-gray-300  hover:bg-gray-200 w-full px-5 ' onClick={() => {navigate('listings/new');  setMenuOpen(false);}}><p className='font-semibold'>Become Host</p> <img className='w-12 inline ' src={HomePng} alt="PNG" /></button>

                                    {!isAuth && (
                                        <>
                                            <button className='font-semibold py-1 border-b border-gray-300 w-full text-left hover:bg-gray-200 px-5' onClick={() => {navigate('/signup');  setMenuOpen(false);}}>Sign Up</button>
                                            <button className='font-semibold py-1 border-b border-gray-300 w-full text-left hover:bg-gray-200 px-5 ' onClick={() => {navigate('/login'); setMenuOpen(false);}}>Login</button>
                                        </>
                                    )}
                                    {isAuth && <button className='font-semibold py-1 border-b border-gray-300 w-full text-left hover:bg-gray-200 px-5' onClick={handleLogOut}>Log Out</button>}
                                </div>
                            </div>}
                    </div>
                </div>
                {isHome && <div className='md:hidden lg:hidden mx-auto'><Searchbox/></div>}

            </div>

        </div>
    )
}
