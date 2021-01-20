import React, { useState, useEffect } from 'react';
import './Nav.css';
import {NavLink} from  'react-router-dom';
import {withCookies} from 'react-cookie';
import { auth, getUserDocument } from '../../../firebase';
import { withRouter } from 'react-router-dom';

const Nav = (props) => {

    const [isLoggedIn, setIsLoggedIn] =useState(false);

    const { cookies, history } = props;

    const [userName, setUserName] = useState('');

  
    useEffect(()=>{
        
        const userIsLoggedIn = cookies.get('userIsLoggedIn');
        const name = cookies.get('userDetails').name;
        if(userIsLoggedIn){

            setIsLoggedIn(JSON.parse(userIsLoggedIn));
            setUserName(name );
        }
    });

    

    const onSignOutHandler = () => {
        
        auth.signOut().then(()=>{
            console.log('Signed Out');
            setIsLoggedIn(false);
            cookies.set('userDetails', null,{path:'/'} );
            history.push('/');
            
        }).catch((e => {
                console.error(e);
                alert('something went wrong while signing out');
            }));
    };

    const signedIn =  (<ul>
                            <li><NavLink className='nav-link' to= '/'> Home </NavLink></li>
                            <li><NavLink className='nav-link' to= '/products'> Products </NavLink></li>
                            <li> <h3>Hi { userName } :</h3> <button type='button' onClick={onSignOutHandler} > SignOut</button></li>
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
