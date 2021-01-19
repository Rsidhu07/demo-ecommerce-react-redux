import React from 'react';
import './Nav.css';
import {NavLink} from  'react-router-dom';

const Nav = () => {
    return (
        <div className = 'Nav'>
                <ul>
                    <li><NavLink className='nav-link' to= '/'> Home </NavLink></li>
                    <li><NavLink className='nav-link' to= '/products'> Products </NavLink></li>
                    <li><NavLink className='nav-link' to= '/login'> Login </NavLink></li>
                    <li><NavLink className='nav-link' to= '/signup'> SignUp </NavLink></li>
                    <li><NavLink className='nav-link' to= '/cart'> Cart </NavLink></li>
                </ul>
           
        </div>
    )
};

export default Nav;
