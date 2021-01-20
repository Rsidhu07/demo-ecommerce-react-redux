import * as actions from '../Actions/actions';



const initialState = {
    isLoggedIn : false,
    userLoggedInID: null
};

const users = ( state = initialState, action) => {
   
    switch (action.type) {
        case actions.UPDATE_LOGGED_IN_USER_ID:
            console.log('payload is ===>>', action.payload);
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
            
        default:
            return state;
    }
};

export default users;