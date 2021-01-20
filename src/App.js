import './App.css';
import { Route} from 'react-router-dom';
import React from 'react';
import Nav from './Components/UI/Nav/Nav';
import ListProducts from './Components/ListProducts/ListProducts';
import LoginForm from './Components/LoginForm/LoginForm';
import SignupForm from './Components/SignupForm/SignupForm';
import Cart from './Components/Cart/Cart';



const App = () => {
  return (
    <div className='App'>
      <section className='glass'>
        <Route path ='/' exact >
          <Nav />
          <ListProducts />
        </Route>

        <Route path ='/products' exact >
          <Nav />
          <ListProducts />
        </Route>
        
        <Route path='/login' exact> 
          <Nav />
          <LoginForm />
        </Route> 

        <Route path= '/signup' exact>
          <Nav />
          <SignupForm />
        </Route>

        {/* <Route path= '/signout' exact>
          <Nav />
          <SignOut />
        </Route> */}

        <Route path ='/cart' exact >
          <Nav />
          <Cart />
        </Route>

      </section>
    <div className="circle1"></div>
    <div className="circle2"></div>
    </div>
  )
};

export default App;