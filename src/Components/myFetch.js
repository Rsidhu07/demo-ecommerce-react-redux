import {gettingProductsBegin,gettingProductsfailed} from '../store/Actions/actions';

const myFetch = async (url, dispatch) => {
    
    try {

        dispatch(gettingProductsBegin());

        const result = await fetch(url);
        if(result){
            const data = await result.json();

            if(data){
                return data;
            }
        }

    } catch (error) {

        dispatch(gettingProductsfailed());
        console.log('HTPP ERROR: --' , error);
    }
   
};

export default myFetch;