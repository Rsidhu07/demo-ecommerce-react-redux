import React, { useState } from 'react';
import './LoginForm.css';
import checkValidity from '../formValidation';
import convertFormDataToArray from '../convertFormDataToArray';
import Input from '../UI/Input/Input';

const LoginForm = () => {


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
                <button type='button' >Login</button>
            </form>          
        </div>
    )
}

export default LoginForm;