import React, { useState, useEffect } from 'react';
import './SignupForm.css';
import Input from '../UI/Input/Input';
import checkValidity from '../formValidation';
import {auth, generateUserDocument } from '../../firebase';
import {connect } from 'react-redux';
import convertFormDataToArray from '../convertFormDataToArray';
import { updateLoggedInUserID } from '../../store/Actions/actions';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

const SignupForm = (props) => {

    const initialState = {
        formData:
            {
                name: {

                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Name (max 30 letters)'
                    },
                    value: '',
                    validation: {
                        required: true,
                        maxLength: 30  
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
                    },
        
            
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
                
                
                
                    phoneNumber: {

                        elementType: 'input',
                        elementConfig: {
                            type: 'text',
                            placeholder: 'Phone Number(should not be registered)'
                        },
                        value: '',
                        validation: {
                            required: true,
                            minLength: 10,
                            maxLength: 10,
                            isNumber:true
                        },
                        valid: false,
                        touched: false
                    }
            },
        isValidForm: false

    };

    const {onUpdateLoggedInUserID, history, cookies} =  props;

    useEffect(()=>{
        if(JSON.parse(cookies.get('userIsLoggedIn'))){
            history.push('/');
        }
    }, []);
    

    const [formValues,setFormValues] = useState(initialState);
    const [errorMsg, setErrorMsg] =useState(null);

    
    console.log('all cookies are ====>>>> ', cookies.userIsLoggedIn, props);


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
        console.log('form is valid====>>', formIsValid);
        updateFormData[id] = updatedFormElement;

        setFormValues({
            ...formValues,
            formData:updateFormData,
            isValidForm: formIsValid
        });

    };
    
    const createUserWithEmailAndPasswordHandler = async (event, formData) => {
        
        event.preventDefault();

        const dataToBeSend ={
            name: formData.name.value,
            password: formData.password.value,
            email: formData.email.value,
            phoneNumber: formData.phoneNumber.value
        };
        const {name, password, email, phoneNumber} = dataToBeSend;

        try{

          const {user} = await auth.createUserWithEmailAndPassword(email, password);
          console.log('user is signed in ====>>', user);
          
          generateUserDocument(user, {name,phoneNumber});
          setFormValues(initialState);
          alert('Successfully registered');
          const userDetails = {
            name, 
            email,
            phoneNumber
          };
          console.log('userdtails when clicked signup are ====>>', userDetails, cookies.set('userDetails', userDetails, {path:'/'}));
          cookies.set('userDetails', userDetails, {path:'/'});
          history.push('/');
        }
        catch(error){
          setErrorMsg('Error Signing up with email and password');
          alert(errorMsg);
        }
      };

    return (
        <div className='SignupForm'>
            <form className='Signup-form'>
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
                <button type='button' onClick={(e)=>{createUserWithEmailAndPasswordHandler(e,formValues.formData)}}  >SignUp</button>
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
}

export default connect(mapStateToProps,mapDispatchToProps)(withCookies(withRouter(SignupForm)));
