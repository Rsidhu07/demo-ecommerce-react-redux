import * as actionTypes from '../Actions/actions';

const initialState = {
    products : [],
    loading:false
};

const products = ( state = initialState, action) => {

    switch (action.type) {

        case actionTypes.GETTING_PRODUCTS_BEGIN:
            return {
                ...state,
                loading:true
            };
            
        case actionTypes.GETTING_PRODUCTS_FAILED:
            return {
                ...state,
                loading:false
            };

        case actionTypes.GETTING_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.payload
            };
    
        default:
            return {
                ...state
            };
            
    }

};

export default products;