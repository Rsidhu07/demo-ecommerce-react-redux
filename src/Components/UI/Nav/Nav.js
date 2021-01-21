import React, { useState, useEffect } from 'react';
import './Nav.css';
import {NavLink} from  'react-router-dom';
import {withCookies} from 'react-cookie';
import { auth, updateUserDocument } from '../../../firebase';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeAllDataFromCart } from '../../../store/Actions/actions';

const Nav = (props) => {


    const { cookies, history, openCart, onRemoveAllDataFromCart } = props;

    const [isLoggedIn, setIsLoggedIn] =useState(false);

    const [userName, setUserName] = useState('');

    const [userLoggedInId, setUserLoggedInId] = useState('');


  
    useEffect(()=>{
        
        const userIsLoggedIn = cookies.get('userIsLoggedIn');
        const userLoggedId = cookies.get('UserId');
        const name = cookies.get('userDetails').name;
        if(userIsLoggedIn){

            setIsLoggedIn(JSON.parse(userIsLoggedIn));
            setUserLoggedInId(userLoggedId);
            setUserName(name );
        }
    });

    

    const onSignOutHandler = (openCartData) => {

        const cartDataObject = {};
        if(openCartData.length>0){

            for(let i in openCartData){
                cartDataObject[i] = openCartData[i];
            }
        }
        updateUserDocument(userLoggedInId, cartDataObject).then(()=>{
            console.log('updated data successfully to user document', userLoggedInId,openCartData);
            auth.signOut().then(()=>{
                console.log('Signed Out');
                setIsLoggedIn(false);
                cookies.set('userDetails', null,{path:'/'} );
                history.push('/');
                
            }).catch((e => {
                    console.error(e);
                    alert('something went wrong while signing out');
                }));
        });

        onRemoveAllDataFromCart();
        
    };

    const signedIn =  (
        <ul>
            <li><NavLink className='nav-link' to= '/'> Home </NavLink></li>
            <li><NavLink className='nav-link' to= '/products'> Products </NavLink></li>
            <li> <h3>Hi { userName } :</h3> <button type='button' onClick={()=>{onSignOutHandler(openCart)}} > SignOut</button></li>
            <li><NavLink className='nav-link' to= '/cart'> Cart </NavLink></li>
        </ul>
    );

    const signedOut = (
        <ul>
            <li><NavLink className='nav-link' to= '/'> Home </NavLink></li>
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

const mapStateToProps =(state) => {
    return {
        loggedInID: state.logged.userLoggedInID,
        isloggedIn: state.logged.isLoggedIn,
        openCart: state.logged.openCart
    };
};

const mapDispatchToprops = dispatch => {
    return {
        onRemoveAllDataFromCart: ()=>{ dispatch(removeAllDataFromCart()) }
    }
}


export default connect(mapStateToProps, mapDispatchToprops)(withCookies(withRouter(Nav)));
