import React, { useEffect, useState} from 'react';
import './ListProducts.css';
import {connect} from 'react-redux';
import { gettingProducts, updateLoggedInUserID, updateOpenCart,removeDataFromCart } from '../../store/Actions/actions';
import Spinner from '../UI/Spinner/Spinner';
import {withCookies} from 'react-cookie';
import { auth, updateUserDocument } from '../../firebase';

const checkIfDataExistsAlready =(productId, productData) => {
    
    const found = productData.find(element => element.id === productId);
    
    if(found){
        return true;
    } 
    return false;
};

const dynamicLi = (onPageNumberClickedHandler, prods,) => {

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
        onRemoveDataFromCart
    } = props; 

    useEffect(()=>{
        onGetProducts();
    },[onGetProducts]);

    useEffect(()=>{

        cookies.set('openCart', openCart);
        console.log(cookies.get('openCart') );

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
        
        
        // updateUserDocument(userIdAddedProduct, selectedProduct).then(()=>{
        //     console.log('updated data successfully to user document', userIdAddedProduct);
        // });
        
        
    };
   

    return (
        <div className='ListProducts' >

            {props.loading ? <Spinner/> : 
                paginatedData.map( product => {
                    return (
                        <div key={product.id} className="card">
                            <button 
                             onClick={() => onAddToCartHandler(product)} type='button'>
                                 { (checkIfDataExistsAlready(product.id,openCart)) ? 'Added To Cart' :'Add To Cart' }</button>
                            <button type='button'>Buy Now</button>
                            <img src={product.image} width ='120' height= '100' alt="" />
                            <p>{product.category.toUpperCase()}</p>
                            <div className="card-info">
                                <h2>{product.title}</h2>
                                <p>{product.description}</p>
                            </div>
                            <h3> USD {product.price}</h3>
                         </div>
                    );
                })
            }
            
            

            <div className='Page-Numbers'>
                <ul>
                   {dynamicLi(onPageNumberClickedHandler,prods).map(li=>li)}
                </ul>
            </div>
            
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
