import React ,{Fragment} from 'react';
import './Input.css'

const Input = (props) => {

    const dynamicInput =()=> {

        let inputClasses = '';


        if (props.invalid && props.shouldValidate && props.touched) {
            inputClasses = 'Invalid';
        }
        switch(props.elementType){
            case 'input':
                return (
                    <input className={inputClasses} type={props.elementConfig.type} name={props.name}
                    placeholder={props.elementConfig.placeholder} onChange={props.changed}
                    ></input> 
                );
                default:
                    return (<input type='text'></input>)
        }

    }
    
    return (
        <Fragment>
            <label>{props.name.toUpperCase()}</label>
            {dynamicInput()}
        </Fragment>
    )
}

export default Input;