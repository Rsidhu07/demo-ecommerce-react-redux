import React, { useState, useEffect } from 'react';
import './Nav.css';
import {NavLink} from  'react-router-dom';
import {withCookies} from 'react-cookie';
import { auth } from '../../../firebase';
import { withRouter } from 'react-router-dom';

const Nav = (props) => {

    const [isLoggedIn, setIsLoggedIn] =useState(false);

    const { cookies, history } = props;

    useEffect(()=>{
        console.log('runs on render');
        setIsLoggedIn(JSON.parse(cookies.get('userIsLoggedIn')));

    }, [cookies]);

    const onSignOutHandler = () => {
        
        auth.signOut().then(()=>{
            console.log('Signed Out');
            setIsLoggedIn(false);
            history.push('/');
            
        }).catch((e => {
                console.error(e);
                alert('something went wrong while signing out');
            }));
    };

    const signedIn =  (<ul>
                            <li><NavLink className='nav-link' to= '/'> Home </NavLink></li>
                            <li><NavLink className='nav-link' to= '/products'> Products </NavLink></li>
                            <li><button type='button' onClick={onSignOutHandler} >SignOut</button></li>
                            <li><NavLink className='nav-link' to= '/cart'> Cart </NavLink></li>
                        </ul>
    );

    const signedOut = (
        <ul>
            <li><NavLink className='nav-link' to= '/'> Home </NavLink></li>
            <li><NavLink className='nav-link' to= '/products'> Products </NavLink></li>
            <li><NavLink className='nav-link' to= '/login'> Login </NavLink></li>
            <li><NavLink className='nav-link' to= '/signup'> SignUp </NavLink></li> 
        </ul>
    );

    return (
        <div className = 'Nav'>
        
            {isLoggedIn ? signedIn : signedOut }
                    
        </div>
    )
};

export default withCookies(withRouter(Nav));
