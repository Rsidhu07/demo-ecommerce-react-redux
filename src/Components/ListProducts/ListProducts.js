import React, { useEffect, useState} from 'react';
import './ListProducts.css';
import {connect} from 'react-redux';
import { gettingProducts, updateLoggedInUserID } from '../../store/Actions/actions';
import Spinner from '../UI/Spinner/Spinner';
import {useCookies} from 'react-cookie';
import { auth } from '../../firebase';

const dynamicLi = (onPageNumberClickedHandler, prods,) => {

    const li = [];

    for(let i=0; i<4;i++){

        li.push((<li href='#top' key={Math.random()*2} value={i+1}

    onClick={ () => { onPageNumberClickedHandler(prods, i+1) }}>{i+1}</li>));
   }

   scrollToTop();

    return li;
};

const scrollToTop =() => window.scrollTo({top: 0, behavior: 'smooth'});


const ListProducts = (props) => {

    const {onGetProducts, prods, onUpdateLoggedInUserID} = props; 

    const [cookies, setCookie] = useCookies([]);

    useEffect(()=>{
        onGetProducts();
    },[onGetProducts]);

    useEffect(()=>{
        const paginatedProductData = prods.slice(0,5);
        setPaginatedData(paginatedProductData);
    }, [prods]);

    useEffect(() => {
        
        auth.onIdTokenChanged(user => {
            if(user){
                onUpdateLoggedInUserID(user.uid);
                setCookie('UserId', user.uid, {path:'/'});
                setCookie('userIsLoggedIn',true, {path:'/'});

                
            } else {
                onUpdateLoggedInUserID(null);
                setCookie('UserId', null, {path:'/'});
                setCookie('userIsLoggedIn',false, {path:'/'});
            }
        });
        
    }, [onUpdateLoggedInUserID,setCookie]);

    const [paginatedData, setPaginatedData] = useState([]);

    const onPageNumberClickedHandler = (datatToBePaginated,pageNum) => {

        const updatedData = [...datatToBePaginated];
        const paginatedProductData = updatedData.slice((pageNum*5)-5,(pageNum*5));

        setPaginatedData(paginatedProductData);
        
        console.log('event is===>>', pageNum, paginatedData);
    };


   

    return (
        <div className='ListProducts' >

            {props.loading ? <Spinner/> : 
                paginatedData.map( product => {
                    return (
                        <div key={product.id} className="card">
                            <button type='button'>Add To Cart</button>
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
    };
};

const mapDispatchToprops = dispatch => {
    return {
        onGetProducts: () => { dispatch(gettingProducts()) },
        onUpdateLoggedInUserID:(userId) => { dispatch(updateLoggedInUserID(userId))}
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(ListProducts);
