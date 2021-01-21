import React, {Fragment} from 'react';
import Spinner from '../../UI/Spinner/Spinner';

const ListProduct = (props) => {

    const {
        paginatedData,
        onAddToCartHandler,
        checkIfDataExistsAlready,
        openCart,
        dynamicLi,
        onPageNumberClickedHandler,
        prods
    } = props;

    return (
        <Fragment>
            
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
            
        </Fragment>
    )
};

export default ListProduct
