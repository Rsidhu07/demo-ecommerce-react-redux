import React, { useEffect, useState, useRef} from 'react';
import './ListProducts.css';
import {connect} from 'react-redux';
import { gettingProducts } from '../../store/Actions/actions';

const dynamicLi = (onPageNumberClickedHandler, prods,scrollToTopRef) => {
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

    const {onGetProducts, prods} = props; 

    useEffect(()=>{
        onGetProducts();
    },[]);

    useEffect(()=>{
        const paginatedProductData = prods.slice(0,5);
        setPaginatedData(paginatedProductData);
    }, [prods]);

    const [paginatedData, setPaginatedData] = useState([]);

    const scrollToTopRef = useRef(null);

    const onPageNumberClickedHandler = (datatToBePaginated,pageNum) => {

        const updatedData = [...datatToBePaginated];
        const paginatedProductData = updatedData.slice((pageNum*5)-5,(pageNum*5));

        setPaginatedData(paginatedProductData);
        
        console.log('event is===>>', pageNum, paginatedData);
    };

   

    return (
        <div className='ListProducts' ref={scrollToTopRef} >
            
            {
                paginatedData.map( product => {
                    return (
                        <div key={product.id} className="card">
                            <button type='button'>Add To Cart</button>
                            <button type='button'>Buy Now</button>
                            <img src={product.image} width ='120' height= '100' alt="" />
                            <p>{product.category}</p>
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
                   {dynamicLi(onPageNumberClickedHandler,prods,scrollToTopRef).map(li=>li)}
                </ul>
            </div>
            
        </div>
    )
};

const mapStateToProps =(state) => {
    return {
        prods: state.prods.products,
        loading: state.prods.loading,
        loggedIn: state.logged.userLoggedIn,
        isloggedIn: state.logged.isloggedIn,
    };
};

const mapDispatchToprops = dispatch => {
    return {
        onGetProducts: () => { dispatch(gettingProducts()) }
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(ListProducts);
