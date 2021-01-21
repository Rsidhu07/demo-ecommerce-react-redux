import * as actions from '../Actions/actions';



const initialState = {
    isLoggedIn : false,
    userLoggedInID: null,
    openCart: []
};

const users = ( state = initialState, action) => {
   
    switch (action.type) {
        case actions.UPDATE_LOGGED_IN_USER_ID:
            if(action.payload){
                return {
                    ...state,
                    isLoggedIn: true,
                    userLoggedInID: action.payload
                };
        
            }else{
                return {
                    ...state,
                    isLoggedIn:false
                };
            }
            

        case actions.UPDATE_OPEN_CART: 
            const newArray = [...state.openCart];
            newArray.push(action.payload);
            return {
                ...state,
                openCart:newArray

            };

        case actions.REMOVE_DATA_FROM_CART:
            const updatedCart = [...state.openCart];

            return {
                ...state,
                openCart: updatedCart.filter((product) => {
                    return product.id!==action.payload;
                })
            };

        case actions.REMOVE_ALL_DATA_FROM_CART:
            return {
                ...state,
                openCart:[]
            };

        case actions.INIT_DATA_IN_CART:
            return {
                ...state,
                openCart: action.payload
            };
            
        default:
            return state;
    }
};

export default users;