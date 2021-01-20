import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import checkValidity from '../formValidation';
import convertFormDataToArray from '../convertFormDataToArray';
import Input from '../UI/Input/Input';
import { auth } from '../../firebase';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {updateLoggedInUserID} from '../../store/Actions/actions';

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
    const [errorMsg, setErrorMsg] =useState(null);
    const [cookies, setCookie] = useCookies([]);

    const {onUpdateLoggedInUserID, history, isloggedIn} = props;

    const authListener = ()=>{
        auth.onIdTokenChanged(user => {
            if(user){
                onUpdateLoggedInUserID(user.uid);
                setCookie('UserId', user.uid, {path:'/'});
                setCookie('userIsLoggedIn',true, {path:'/'});

                history.push('/');
                
            } else {
                onUpdateLoggedInUserID(null);
                setCookie('UserId', null, {path:'/'});
                setCookie('userIsLoggedIn',false, {path:'/'});
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

        console.log('formData is =>',updatedFormElement.valid);
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
            console.log('user signed in ', user);
            onUpdateLoggedInUserID(user.uid);
            setCookie('UserId', user.uid, {path:'/'});
            setCookie('userIsLoggedIn',true, {path:'/'});
        })
        .catch(error => {
          setErrorMsg("Error signing in with password and email!");
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
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onUpdateLoggedInUserID:(userId) => { dispatch(updateLoggedInUserID(userId))}
    }
};


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(LoginForm));