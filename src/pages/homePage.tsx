import React, { useEffect } from 'react';
import { BsCart2 } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useStateValue } from '../context/StateProvider'; // Assuming you're using useContext for global state
import { ADD_TO_CART, SET_CATEGORIES, SET_PRODUCTS, UPDATE_CART_ITEM } from '../constants/constants';
import fetchProducts from '../api/index';
import { allProducts as AllProducts } from '../api/graphqlQueries';
import { toKebabCase } from '../utils/utils';
import Heading from '../components/Heading';

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    gallery: string[];
    prices: { amount: number; currency: string }[];
    inStock: boolean;
    attributes: {
      name: string;
      items: { value: string }[];
    }[];
  }
  
  interface Category {
    name: string;
  }
  
  interface AllProductsResponse {
    data: {
      products: Product[];
      categories: Category[];
    };
  }
  

const HomePage: React.FC = () => {
  const { state, dispatch } = useStateValue(); // Accessing global state and dispatch via context
  const navigate = useNavigate();


  // Fetch products data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts(AllProducts) as AllProductsResponse;
        // Dispatching the products to the global state
        dispatch({
          type: SET_PRODUCTS,
          products: response?.data?.products,
        });
        dispatch({
          type: SET_CATEGORIES,
          categories: response?.data?.categories,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [dispatch]);

  // Get the default attributes for a product
  const getDefaultAttributes = (attributes: any[]) => {
    let defaultAttributes = {
      size: null,
      color: null,
      capacity: null,
      ports: null,
      touchIDInKeyboard: null,
    };

    attributes?.forEach(attribute => {
      const { name, items } = attribute;

      // Determine the attribute's default value (first item in the list)
      const defaultValue = items.length > 0 ? items[0].value : null;

      switch (name) {
        case 'Size':
          defaultAttributes.size = defaultValue;
          break;
        case 'Color':
          defaultAttributes.color = defaultValue;
          break;
        case 'Capacity':
          defaultAttributes.capacity = defaultValue;
          break;
        case 'With USB 3 ports':
          defaultAttributes.ports = defaultValue;
          break;
        case 'Touch ID in keyboard':
          defaultAttributes.touchIDInKeyboard = defaultValue;
          break;
        default:
          break;
      }
    });
    return defaultAttributes;
  };

  // Handle adding items to the cart
  const addToCart = (id: string, name: string, image: string, description: string, price: number, category: string, defaultAttributes: any, attributes: any[]) => {
    const { cart } = state;

    // Find item in the cart matching product id and matching existing attributes
    const item = cart.find(item => {
      // Check if the product id matches
      if (item.id !== id) return false;

      // If the product has attributes, compare them
      if (attributes?.length > 0) {
        const isMatching = attributes.every(attribute => {
          const attrName = attribute.name.toLowerCase().replace(/\s+/g, ''); // Standardize attribute names
          return item[attrName] === defaultAttributes[attrName]; // Compare attribute values
        });
        return isMatching;
      }

      // If no attributes, just match by ID
      return true;
    });

    if (item) {
      // If the item exists in the cart, update its quantity
      dispatch({
        type: UPDATE_CART_ITEM,
        id,
        color: defaultAttributes.color,
        size: defaultAttributes.size,
        capacity: defaultAttributes.capacity,
        ports: defaultAttributes.ports,
        touchIdKeyboard: defaultAttributes.touchIDInKeyboard,
        attributes: item.attributes,
        quantity: item.quantity + 1,
      });
    } else {
      // Add the item as a new entry in the cart
      dispatch({
        type: ADD_TO_CART,
        id,
        item: {
          id: id ?? '',
          name: name ?? '',
          image: image ?? '',
          description: description ?? '',
          price,
          category,
          color: defaultAttributes.color ?? '',
          size: defaultAttributes.size ?? '',
          capacity: defaultAttributes.capacity ?? '',
          ports: defaultAttributes.ports ?? '',
          touchIdKeyboard: defaultAttributes.touchIDInKeyboard ?? '',
          attributes : attributes ?? [],
          quantity: 1,
        },
      });
    }
  };

  // Filter products based on the active category
  const filteredProducts = state.active === 'all'
    ? state.products
    : state.products?.filter(product => product.category === state.active);

  return (
    <div className={`relative ${state.showCart ? 'filter' : ''}`}>
      <Heading title={state.active} />
      <div className="mt-12 px-32 r-0 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 z-0">
        {filteredProducts?.map(product => (
          <div
            key={product.id}
            className="relative block w-72 rounded-lg overflow-hidden shadow-lg group"
            data-testid={`product-${toKebabCase(product.name)}`}
          >
            <img
              className={`rounded-t-lg w-full h-48 object-cover ${product.inStock === false ? 'out-of-stock' : ''}`}
              src={product.gallery[0]}
              alt={product.name}
            />
            {product.inStock === false ? (
              <div className="absolute top-20 left-16">
                <span className="text-2xl text-gray-500">OUT OF STOCK</span>
              </div>
            ) : (
              <div className="absolute top-44 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    addToCart(
                      product.id,
                      product.name,
                      product.gallery[0],
                      product.description,
                      product.prices[0].amount,
                      product.category,
                      getDefaultAttributes(product.attributes),
                      product.attributes
                    )
                  }
                  className="bg-green-600 rounded-full h-8 w-8"
                >
                  <BsCart2 className="text-white m-2" />
                </button>
              </div>
            )}
            <div className="p-2">
              <a onClick={() => navigate(`/product/${product.id}`)}>
                <h5 className="text-sm mb-2 cursor-pointer">{product.name}</h5>
              </a>
              <p className="text-l font-medium">${product.prices[0].amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
