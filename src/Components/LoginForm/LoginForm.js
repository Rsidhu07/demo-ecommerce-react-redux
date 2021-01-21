import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import checkValidity from '../formValidation';
import convertFormDataToArray from '../convertFormDataToArray';
import Input from '../UI/Input/Input';
import { auth, getUserDocument } from '../../firebase';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import {updateLoggedInUserID, initDataInCart} from '../../store/Actions/actions';

const LoginForm = (props) => {


    const initialState = {
        formData:
            {
                email: {

                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Email (should not be registered)'
                    },
                    value: '',
                    validation: {
                        required: true,
                        isEmail: true,
                        maxLength: 50
                    },
                    valid: false,
                    touched: false
                },
                   
                password: {

                    elementType: 'input',
                    elementConfig: {
                        type: 'password',
                        placeholder: 'Your password(between 10-20 letters)'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 10,
                        maxLength: 20  
                    },
                    valid: false,
                    touched: false
                }
                   
            },
        isValidForm: false

    };

    const [formValues,setFormValues] = useState(initialState);

    const {onUpdateLoggedInUserID, history, cookies, onInitDataInCart} = props;


    const authListener = ()=>{
        auth.onIdTokenChanged(user => {
            if(user){
                onUpdateLoggedInUserID(user.uid);
                cookies.set('UserId', user.uid, {path:'/'});
                cookies.set('userIsLoggedIn',true, {path:'/'});

                history.push('/');
                
            } else {
                onUpdateLoggedInUserID(null);
                cookies.set('UserId', null, {path:'/'});
                cookies.set('userIsLoggedIn',false, {path:'/'});
            }
        });
    };

    useEffect(() => {
        
        authListener();
        
    }, []);



    const inputChangeHandler = (e,id,formData) => {
        const updateFormData = {
            ...formData
        };
       
        const updatedFormElement = {
            ...updateFormData[id]
        };

        updatedFormElement.value = e.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched =true;

        let formIsValid = true;

        for(let inputIdentifier in updateFormData) {
            
            formIsValid = updateFormData[inputIdentifier].valid && formIsValid;

        }

        updateFormData[id] = updatedFormElement;

        setFormValues({
            ...formValues,
            formData:updateFormData,
            isValidForm: formIsValid
        });

    };

    const signInWithEmailAndPasswordHandler = (event, formData) => {

        event.preventDefault();
        const dataToBeSend ={
            password: formData.password.value,
            email: formData.email.value,
        };

        const { email, password} = dataToBeSend;
        auth.signInWithEmailAndPassword(email, password)
        .then(user => {
            console.log('user signed in ', user.user);
            cookies.set('UserId', user.uid, {path:'/'});
            cookies.set('userIsLoggedIn',true, {path:'/'});

            getUserDocument(user.user['uid'])
            .then((userRecord) => {
    
                cookies.set('userDetails', userRecord, {path:'/'});

                const convertedCartDataToArray = Object.values(userRecord.cart[0]);

                onInitDataInCart(convertedCartDataToArray);
                console.log('Successfully fetched user data', userRecord, userRecord.cart,
                convertedCartDataToArray);
    
            })
            .catch((error) => {
                console.log('Error fetching user data:', error);
            });
        })
        .catch(error => {
          console.error("Error signing in with password and email", error);
        });
      };

    return (
        <div className='LoginForm'>
           <form className='Login-form'>
                {
                convertFormDataToArray(formValues.formData).map(formElement => {
                    return (
                        <Input  key = {formElement.id}
                        elementType = {formElement.config.elementType}
                        elementConfig = {formElement.config.elementConfig}
                        value = {formElement.config.value} 
                        invalid={!formElement.config.valid}
                        valid= {formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched} 
                        name = {formElement.id}
                        changed = {event => inputChangeHandler(event,formElement.id,formValues.formData)}  />
                    );
                })}
                <button type='button' onClick={e => {signInWithEmailAndPasswordHandler(e,formValues.formData)}} >Login</button>
            </form>          
        </div>
    )
};

const mapStateToProps = state => {
    return {
        loggedInID: state.logged.userLoggedInID,
        isloggedIn: state.logged.isLoggedIn,
        openCart: state.logged.openCart
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onUpdateLoggedInUserID:(userId) => { dispatch(updateLoggedInUserID(userId))},
        onInitDataInCart: (initCartData) => { dispatch( initDataInCart(initCartData)) }
    }
};


export default connect(mapStateToProps,mapDispatchToProps)(withCookies(withRouter(LoginForm)));