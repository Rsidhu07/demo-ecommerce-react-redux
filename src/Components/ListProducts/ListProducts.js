import React, { useEffect, useState} from 'react';
import './ListProducts.css';
import {connect} from 'react-redux';
import { gettingProducts, updateLoggedInUserID, updateOpenCart,removeDataFromCart } from '../../store/Actions/actions';
import {withCookies} from 'react-cookie';
import { auth } from '../../firebase';
import ListProduct from './ListProduct/ListProduct';


const checkIfDataExistsAlready =(productId, productData) => {
    
    const found = productData.find(element => element.id === productId);
    
    if(found){
        return true;
    } 
    return false;
};

const dynamicLi = (onPageNumberClickedHandler, prods) => {

    const li = [];

    for(let i=0; i<4;i++){

        li.push((<li href='#top' key={Math.random()*2} value={i+1}

    onClick={ () => { onPageNumberClickedHandler(prods, i+1) }}>{i+1}</li>));
   }


    return li;
};

const scrollToTop =() => window.scrollTo({top: 0, behavior: 'smooth'});


const ListProducts = (props) => {

    const {
        onGetProducts,
        prods, 
        onUpdateLoggedInUserID,
        cookies, 
        openCart,
        onUpdateCart,
        onRemoveDataFromCart,
        isloggedIn
    } = props; 

    useEffect(()=>{
        onGetProducts();
    },[onGetProducts]);

    useEffect(()=>{

        cookies.set('openCart', openCart);

    }, [openCart]);

    useEffect(()=>{
        const paginatedProductData = prods.slice(0,5);
        setPaginatedData(paginatedProductData);
    }, [prods]);

    useEffect(() => {
        
        auth.onIdTokenChanged(user => {
            if(user){
                onUpdateLoggedInUserID(user.uid);
                cookies.set('UserId', user.uid, {path:'/'});
                cookies.set('userIsLoggedIn',true, {path:'/'});

                
            } else {
                onUpdateLoggedInUserID(null);
                cookies.set('UserId', null, {path:'/'});
                cookies.set('userIsLoggedIn',false, {path:'/'});
            }
        });
        
    }, []);

    const [paginatedData, setPaginatedData] = useState([]);

    const onPageNumberClickedHandler = (datatToBePaginated,pageNum) => {

        const updatedData = [...datatToBePaginated];
        const paginatedProductData = updatedData.slice((pageNum*5)-5,(pageNum*5));

        setPaginatedData(paginatedProductData);
        
        console.log('event is===>>', pageNum, paginatedData);
        scrollToTop();

    };


    const onAddToCartHandler =(selectedProduct) => {

        if(checkIfDataExistsAlready(selectedProduct.id, openCart)){
        
            return onRemoveDataFromCart(selectedProduct.id);
        } 
        
        return onUpdateCart(selectedProduct);
    };
   

    return (
        <div className='ListProducts' >

        {isloggedIn? <ListProduct 
            loading={props.loading}
            paginatedData={paginatedData}
            onAddToCartHandler={onAddToCartHandler}
            checkIfDataExistsAlready={checkIfDataExistsAlready}
            openCart={openCart}
            dynamicLi={dynamicLi}
            onPageNumberClickedHandler={onPageNumberClickedHandler}
            prods={prods}/> : <h3>User must be logged in to view products</h3>}

        </div>
    )
};

const mapStateToProps =(state) => {
    return {
        prods: state.prods.products,
        loading: state.prods.loading,
        loggedInID: state.logged.userLoggedInID,
        isloggedIn: state.logged.isLoggedIn,
        openCart: state.logged.openCart
    };
};

const mapDispatchToprops = dispatch => {
    return {
        onGetProducts: () => { dispatch(gettingProducts()) },
        onUpdateLoggedInUserID:(userId) => { dispatch(updateLoggedInUserID(userId))},
        onUpdateCart: (selectedData) => { dispatch(updateOpenCart(selectedData))  },
        onRemoveDataFromCart: (removeDataId) => { dispatch ( removeDataFromCart(removeDataId))}
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(withCookies(ListProducts));
