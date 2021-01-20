import React, { useEffect } from 'react';
import './Cart.css';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { updateOpenCart, removeDataFromCart } from '../../store/Actions/actions';

const Cart = (props) => {
   
    const {history, cookies, onUpdateCart, onRemoveDataFromCart, openCart} =props;

    useEffect(()=>{
        if(!JSON.parse(cookies.get('userIsLoggedIn'))){
            history.push('/');
        }
    }, [cookies,history]);
    
    return (
        <div className='Cart'>
            <h3>Cart</h3>
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
        onUpdateCart: (selectedData) => { dispatch(updateOpenCart(selectedData))  },
        onRemoveDataFromCart: (removeDataId) => { dispatch ( removeDataFromCart(removeDataId))}
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(withCookies(withRouter((Cart))));