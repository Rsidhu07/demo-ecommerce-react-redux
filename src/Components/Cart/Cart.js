import React, { useEffect, useState } from 'react';
import './Cart.css';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { updateOpenCart, removeDataFromCart } from '../../store/Actions/actions';

//function definitions
const ifToDisplayPageNumbers = (array)=>{
    let num = Math.floor(array.length/6);
    if(num === 0){
        return false;
    }
    return true;
};

const dynamicLi = (onPageNumberClickedHandler, prods) => {

    const li = [];

    for(let i=0; i<= Math.floor(prods.length/6);i++){

        li.push((<li href='#top' key={Math.random()*2} value={i+1}
            onClick={ () => { onPageNumberClickedHandler(prods, i+1) }}>{i+1}</li>));
    }
    return li;
};

const scrollToTop =() => window.scrollTo({top: 0, behavior: 'smooth'});

//Cart Component
const Cart = (props) => {
   
    const {history, cookies, onRemoveDataFromCart, openCart} =props;

    const [paginatedData, setPaginatedData] = useState([]);

   

    useEffect(()=>{
        if(!JSON.parse(cookies.get('userIsLoggedIn'))){
            history.push('/');
        }
    }, [cookies,history]);

    useEffect(()=>{
        const paginatedProductData = openCart.slice(0,5);
        setPaginatedData(paginatedProductData);
    }, [openCart]);

    const onPageNumberClickedHandler = (datatToBePaginated,pageNum) => {

        const updatedData = [...datatToBePaginated];
        const paginatedProductData = updatedData.slice((pageNum*5)-5,(pageNum*5));

        setPaginatedData(paginatedProductData);
        
        scrollToTop();

    };

    const removeDataFromCartHandler =(prodId) => {
        onRemoveDataFromCart(prodId);
    };
    
    return (
        <div className='Cart'>
           
           { openCart.length ?
           paginatedData.map( product => {
                    return (
                        <div key={product.id} className="Cart-Card">
                            
                            <button type='button' onClick={() => {removeDataFromCartHandler(product.id)}}>Delete from cart</button>
                            <img src={product.image} width ='120' height= '100' alt="" />
                            <p>{product.category.toUpperCase()}</p>
                            <div className="card-info">
                                <h2>{product.title}</h2>
                                <p>{product.description}</p>
                            </div>
                            <h3> USD {product.price}</h3>
                         </div>
                    );
                }) : <h2>Cart is Empty</h2>
            }
            
            { ifToDisplayPageNumbers(openCart) &&
             (<div className='Page-Numbers'>
                <ul>
                   {dynamicLi(onPageNumberClickedHandler,openCart).map(li=>li)}
                </ul>
                </div>
             )
            }
           
        </div>
    )
};

const mapStateToProps =(state) => {
    return {
        loggedInID: state.logged.userLoggedInID,
        isloggedIn: state.logged.isLoggedIn,
        openCart: state.logged.openCart
    };
};

const mapDispatchToprops = dispatch => {
    return {
        onUpdateCart: (selectedData) => { dispatch(updateOpenCart(selectedData))  },
        onRemoveDataFromCart: (removeDataId) => { dispatch ( removeDataFromCart(removeDataId))}
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(withCookies(withRouter((Cart))));