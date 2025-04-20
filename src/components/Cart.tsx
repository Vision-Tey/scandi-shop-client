import React, { useState } from 'react';
import { useStateValue } from '../context/StateProvider';
import { EMPTY_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM } from '../constants/constants';
import { useMutation } from '@apollo/client';
import { createOrderMutation } from '../api/graphqlQueries';
import { toKebabCase } from '../utils/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string | null;
  color?: string | null;
  capacity?: string | null;
  ports?: string | null;
  touchIdKeyboard?: string | null;
  attributes?: Attribute[];
}

interface Attribute {
  id: string;
  name: string;
  items: AttributeItem[];
}

interface AttributeItem {
  id: string;
  value: string;
  displayValue?: string;
}

const Cart: React.FC = () => {
const { state: { cart }, dispatch } = useStateValue();

  const [createOrder] = useMutation(createOrderMutation);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);

  const incrementQuantity = (id: string, size?: string | null, color?: string | null) => {
    const item = cart.find(i => i.id === id && i.size === size && i.color === color);
    if (item) {
      console.log(item);
      
      dispatch({
        type: UPDATE_CART_ITEM,
        id: item?.id,
        size: item?.size ?? '',
        color: item?.color ?? '',
        capacity: item?.capacity ?? '',
        ports: item?.ports ?? '',
        touchIdKeyboard: item?.touchIdKeyboard ?? '',
        attributes: item?.attributes ?? [],
        quantity: item?.quantity + 1,
      });
    }
  };
    const decrementQuantity = (id: string, size?: string | null, color?: string | null) => {
        const item = cart.find(i => i.id === id && i.size === size && i.color === color);
        if (item && item.quantity > 1) {
        dispatch({
            type: UPDATE_CART_ITEM,
            id: item?.id,
            size: item?.size ?? '',
            color: item?.color ?? '',
            capacity: item?.capacity ?? '',
            ports: item?.ports ?? '',
            touchIdKeyboard: item?.touchIdKeyboard ?? '',
            attributes: item?.attributes ?? [],
            quantity: item?.quantity - 1,
        });
        } else {
        dispatch({ type: REMOVE_FROM_CART, id: item?.id });
        }
    };


  const handleSelected = (itemValue: string, product: Product) => {
    return [product.size, product.color, product.capacity, product.ports, product.touchIdKeyboard].includes(itemValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const products = cart.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      total_price: product.price * product.quantity,
      attributes: JSON.stringify({
        size: product.size,
        color: product.color,
        capacity: product.capacity,
        ports: product.ports,
        touch_id_Keyboard: product.touchIdKeyboard,
      }),
    }));

    const total_price = products.reduce((sum, p) => sum + p.total_price, 0);

    try {
      await createOrder({
        variables: {
          customer_name: customerName,
          customer_email: customerEmail,
          customer_address: customerAddress,
          status: 'pending',
          total_price,
          products,
        },
      });

      setCustomerName('');
      setCustomerEmail('');
      setCustomerAddress('');
      setShowOrderForm(false);
      dispatch({ type: EMPTY_CART });
      alert('Order created successfully!');
    } catch {
      alert('Failed to create order.');
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white shadow-lg p-4 fixed top-20 w-80 right-0 max-h-[85vh] z-50 flex flex-col" data-testid="cart-overlay">
      <h2 className="mb-4">
        <span className='text-xl font-bold'>My Bag:</span> {cart.length} {cart.length === 1 ? 'item' : 'items'}
      </h2>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="flex-grow overflow-y-auto">
          {cart.map((product, index) => (
            <div key={index} className="mb-6 grid grid-cols-3 gap-2 items-center">
              <div className="w-full">
                <p data-testid={`product-${toKebabCase(product.name)}`}>{product.name}</p>
                <span data-testid="cart-item-amount">${product.price}</span>
                {(product.attributes as Attribute[]) ?.map(attr => (
                  <div key={attr.id}>
                    <h3>{attr.name}:</h3>
                    <div className="flex attribute-items">
                      {attr.items.map(item =>
                        attr.name === 'Color' ? (
                          <button
                            key={item.id}
                            className={`mr-1 p-2 h-4 w-10 ${handleSelected(item.value, product) ? 'border-3 border-green-500' : ''}`}
                            style={{ backgroundColor: item.value }}
                            data-testid={`cart-item-attribute-${toKebabCase(attr.name)}-${item.value}${handleSelected(item.value, product) ? '-selected' : ''}`}
                          />
                        ) : (
                          <button
                            key={item.id}
                            className={`h-5 w-7 mr-2 p-0 border-2 text-[10px] ${handleSelected(item.value, product) ? 'bg-black text-white' : 'bg-white text-black'}`}
                            data-testid={`product-attribute-${toKebabCase(attr.name)}-${item.value}${handleSelected(item.value, product) ? '-selected' : ''}`}
                          >
                            {item.value}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-between h-full items-center">
                <button onClick={() => incrementQuantity(product.id, product.size, product.color)} className="text-xl font-bold border-black border-2 h-8 px-2 cursor-pointer" data-testid="cart-item-amount-increase">+</button>
                <span className="my-auto" data-testid="cart-item-amount">{product.quantity}</span>
                <button onClick={() => decrementQuantity(product.id, product.size, product.color)} className="text-xl font-bold border-black border-2 h-8 px-2 cursor-pointer" data-testid="cart-item-amount-decrease">-</button>
              </div>

              <img src={product.image} alt={product.name} className="w-20 h-20 object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between" data-testid="cart-total">
        <span>Total</span>
        <span className="total-amount">${totalPrice.toFixed(2)}</span>
      </div>

      <button onClick={() => setShowOrderForm(!showOrderForm)} className={`w-full bg-green-400 text-white py-2 rounded ${cart.length < 1 ? 'disabled' : ''} cursor-pointer`}>Order</button>

      {showOrderForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <input type="text" name="customerName" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="mb-2 p-2 border" required />
          <input type="email" name="customerEmail" placeholder="Customer Email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="mb-2 p-2 border" required />
          <input type="text" name="customerAddress" placeholder="Customer Address" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="mb-2 p-2 border" required />
          <button type="submit" className="w-full bg-green-400 text-white py-2 rounded cursor-pointer">Submit Order</button>
        </form>
      )}
    </div>
  );
};

export default Cart;
