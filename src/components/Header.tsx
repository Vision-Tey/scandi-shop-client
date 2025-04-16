import React from 'react';
import navImage from '../data/refresh.png';
import { BsCart2 } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import Cart from './Cart';
import { TOGGLE_CART } from '../constants/constants';
import { useStateValue } from '../context/StateProvider';

type Category = {
  name: string;
};

const Header: React.FC = () => {
  const navigate = useNavigate();
//   const [{ cart, showCart, categories, active }, dispatch] = useStateValue();
  const { state, dispatch } = useStateValue();
const { cart, showCart, categories, active } = state;


  const toggleCart = () => {
    dispatch({ type: TOGGLE_CART });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, categoryName: string) => {
    e.preventDefault();
    dispatch({ type: 'SET_ACTIVE_CATEGORY', active: categoryName });
    navigate(`/${categoryName}`);
  };

  return (
    <>
      <header className="py-4 px-32 flex justify-between items-center relative z-30 bg-white">
        <nav className="flex space-x-4">
          <ul className="flex space-x-4">
            {categories && categories.map((category: Category) => (
              <li
                key={category.name}
                className="px-3 py-2 flex flex-col rounded-md cursor-pointer"
              >
                <a
                  className='uppercase'
                  data-testid={active === category.name ? 'active-category-link' : 'category-link'}
                  href={`/${category.name}`}
                  onClick={(e) => handleLinkClick(e, category.name)}
                >
                  {category.name}
                </a>
                {active === category.name && <div className='h-0.5 bg-green-500' />}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <button>
            <img className='w-10 h-10' src={navImage} alt='refresh' />
          </button>
        </div>

        <div>
          <button onClick={toggleCart} data-testid='cart-btn' className="relative flex items-center">
            <BsCart2 className='w-6 h-6' />
            {cart?.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-black rounded-full transform translate-x-1/2 -translate-y-1/2">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {showCart && (
          <>
            <div className="fixed inset-0 top-[4rem] bg-gray-800 opacity-50 z-10" ></div>
            <div className="fixed inset-y-0 right-0 z-20">
              <Cart />
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Header;
