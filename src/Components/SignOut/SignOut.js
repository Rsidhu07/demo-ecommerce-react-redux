import React, {Fragment, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import './SignOut.css';
import { auth } from '../../firebase';
import {useCookies} from 'react-cookie';
import {connect} from 'react-redux';
import { updateLoggedInUserID } from '../../store/Actions/actions';

const SignOut = (props) => {

    const {onUpdateLoggedInUserID, history} = props;

    useEffect(() => {

        
        auth.onIdTokenChanged(user => {
            if(!user){
                onUpdateLoggedInUserID(null);
                history.push('/');

            } 
        });
        
    }, []);
    
    return (
        <Fragment>
            <h1>Signing Out.....</h1>
        </Fragment>
    )
};

const mapStateToProps = state => {
    return {
        loggedInID: state.logged.userLoggedInID,
        isloggedIn: state.logged.isLoggedIn,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onUpdateLoggedInUserID:(userId) => { dispatch(updateLoggedInUserID(userId))}
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignOut));