import myFetch from "../../Components/myFetch";

export const GETTING_PRODUCTS_BEGIN = 'GETTING_PRODUCTS_BEGIN';
export const GETTING_PRODUCTS_FAILED = 'GETTING_PRODUCTS_FAILED';
export const GETTING_PRODUCTS_SUCCESS = 'GETTING_PRODUCTS_SUCCESS';
export const UPDATE_LOGGED_IN_USER_ID = 'UPDATE_LOGGED_IN_USER_ID';
export const UPDATE_OPEN_CART = 'UPDATE_OPEN_CART';
export const REMOVE_DATA_FROM_CART = 'REMOVE_DATA_FROM_CART';

export const removeDataFromCart = (removeDataId) => {
    return {
        type: REMOVE_DATA_FROM_CART,
        payload: removeDataId
    };
};

export const updateOpenCart = (selectedData) => {
    return {
        type:UPDATE_OPEN_CART,
        payload: selectedData
    };
}


export const updateLoggedInUserID =(userId) => {
    return {
        type: UPDATE_LOGGED_IN_USER_ID,
        payload : userId
    }
};


export const gettingProductsBegin = () => {
    return {
        type: GETTING_PRODUCTS_BEGIN
    };
};

export const gettingProductsfailed = () => {
    return {
        type: GETTING_PRODUCTS_FAILED
    };
};

export const gettingProductsSuccess = (data) => {
    return {
        type: GETTING_PRODUCTS_SUCCESS,
        payload: data
    };
} ;

export const gettingProducts = () => {
    return async dispatch => {
       
        const data = await myFetch('https://fakestoreapi.com/products', dispatch);
        dispatch(gettingProductsSuccess(data));
    };
}
