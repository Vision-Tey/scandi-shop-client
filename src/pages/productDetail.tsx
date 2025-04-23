import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../context/StateProvider';
import { ADD_TO_CART, UPDATE_CART_ITEM } from '../constants/constants';
import { toKebabCase } from '../utils/utils';

interface ProductAttribute {
  id: string;
  name: string;
  items: { id: string; value: string; displayValue: string }[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  prices: { amount: number }[];
  gallery: string[];
  category: string;
  attributes: ProductAttribute[];
  inStock: boolean;
}


const ProductDetails: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);
  const [selectedPorts, setSelectedPorts] = useState<string | null>(null);
  const [selectedTouchIDInKeyboard, setSelectedTouchIDInKeyboard] = useState<string | null>(null);
  
  const [attributes, setAttributes] = useState<ProductAttribute[] | null>(null);
  const [productData, setProductData] = useState<Product | null>(null);

  console.log(attributes);
  
  const { id } = useParams();
  const { state, dispatch } = useStateValue();
    const { products, cart } = state;

  useEffect(() => {
    const product = products.find(p => p.id === id);
    if (product) {
      setProductData(product);
      setAttributes(product.attributes);
    }
  }, [id, products]);

  const handleSizeClick = (attribute: string, selectedValue: string) => {
    let stateUpdate: any = {};

    switch (attribute) {
      case 'Size':
        stateUpdate = { selectedSize: selectedValue };
        break;
      case 'Color':
        stateUpdate = { selectedColor: selectedValue };
        break;
      case 'Capacity':
        stateUpdate = { selectedCapacity: selectedValue };
        break;
      case 'With USB 3 ports':
        stateUpdate = { selectedPorts: selectedValue };
        break;
      case 'Touch ID in keyboard':
        stateUpdate = { selectedTouchIDInKeyboard: selectedValue };
        break;
      default:
        console.log('No attribute identified');
    }

    // Update the state with the new selected value
    setSelectedSize(stateUpdate.selectedSize || selectedSize);
    setSelectedColor(stateUpdate.selectedColor || selectedColor);
    setSelectedCapacity(stateUpdate.selectedCapacity || selectedCapacity);
    setSelectedPorts(stateUpdate.selectedPorts || selectedPorts);
    setSelectedTouchIDInKeyboard(stateUpdate.selectedTouchIDInKeyboard || selectedTouchIDInKeyboard);
  };

  const handleSelected = (selectedValue: string) => {
    if (selectedValue !== null) {
      if (
        selectedSize === selectedValue ||
        selectedColor === selectedValue ||
        selectedCapacity === selectedValue ||
        selectedPorts === selectedValue ||
        selectedTouchIDInKeyboard === selectedValue
      ) {
        return true;
      }
    }
    console.log('No matching value found');
    return false;
  };

  const getDefaultAttributes = (attributes: ProductAttribute[]) => {
    let defaultAttributes: {
      size: string | '';
      color: string | '';
      capacity: string | '';
      ports: string | '';
      touchIDInKeyboard: string | 'null';
    } = {
      size: '',
      color: '',
      capacity: '',
      ports: '',
      touchIDInKeyboard: '',
    };

    attributes?.forEach(attribute => {
      const { name, items } = attribute;
      const defaultValue = items.length > 0 ? items[0].value : '';

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

  const addToCart = () => {
    if (!productData) return;

    const { id } = productData;
    const item = cart.find(item => {
      const attributeNames = ['size', 'color', 'capacity', 'ports', 'touchIdKeyboard'];

      if (item.id === id) {
        const isMatching = attributeNames.every(attrName => {
          const standardizedAttrName = attrName.toLowerCase().replace(/\s+/g, '');
          return item[standardizedAttrName] === getDefaultAttributes(productData.attributes)[standardizedAttrName as keyof ReturnType<typeof getDefaultAttributes>];
        });

        return isMatching;
      }

      return false;
    });

    // Check if the product is already in the cart
    // If it is, update the quantity
    if (item) {
      dispatch({
        type: UPDATE_CART_ITEM,
        id: item.id,
        color: selectedColor || getDefaultAttributes(productData.attributes).color,
        size: selectedSize || getDefaultAttributes(productData.attributes).size,
        capacity: selectedCapacity || getDefaultAttributes(productData.attributes).capacity,
        ports: selectedPorts || getDefaultAttributes(productData.attributes).ports,
        touchIdKeyboard: selectedTouchIDInKeyboard || getDefaultAttributes(productData.attributes).touchIDInKeyboard,
        attributes: item.attributes,
        quantity: item.quantity + 1,
      });
    } else {
      // If it is not, add it to the cart
      dispatch({
        type: ADD_TO_CART,
        id: productData.id,
        item: {
          id: id,
          name: productData.name,
          image: productData.gallery[0],
          description: productData.description,
          price: productData.prices[0].amount,
          color: selectedColor || getDefaultAttributes(productData.attributes).color,
          size: selectedSize || getDefaultAttributes(productData.attributes).size,
          capacity: selectedCapacity || getDefaultAttributes(productData.attributes).capacity,
          ports: selectedPorts || getDefaultAttributes(productData.attributes).ports,
          touchIdKeyboard: selectedTouchIDInKeyboard || getDefaultAttributes(productData.attributes).touchIDInKeyboard,
          category: productData.category,
          attributes: productData.attributes,
          quantity: 1,
        },
      });
    }
  };

  if (!productData) return <div>Loading...</div>;

  return (
    <div className="py-12">
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-[60%]">
            <div className="flex flex-wrap pl-20">
              <div className="flex flex-col space-y-2 w-28" data-testid="product-gallery">
                {productData?.gallery?.map((imgSrc, index) => (
                  <img key={index} src={imgSrc} className="w-20 h-20 object-cover" alt={productData.name} />
                ))}
              </div>
              <div className="w-[70%] h-3/4">
                <img src={productData?.gallery[0]} id="current" alt={productData.name} className="w-full" />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[30%]">
            <div className="product-card">
              <h2 className="text-2xl font-normal">{productData.name}</h2>
              <div className="mt-4">
                <div className="attributes-wrapper">
                  {productData?.attributes?.map(attribute => (
                    <div
                      key={attribute.id}
                      data-testid={`product-attribute-${toKebabCase(attribute.name)}`}
                    >
                      <h3>{attribute.name}</h3>
                      <div className="attribute-items">
                        {attribute?.items?.map(item => (
                          <button
                            key={item.id}
                            data-testid={`product-attribute-${toKebabCase(attribute.name)}-${item.value}${handleSelected(item.value) ? "-selected" : ""}`}
                            onClick={() => handleSizeClick(attribute.name, item.value)}
                            className={`mr-2 p-2 border-2 ${handleSelected(item.value) ? 'bg-black text-white h-8 w-10' : 'bg-white text-black h-10 w-16'} cursor-pointer`}
                            style={attribute.name === 'Color' ? { backgroundColor: item.value } : {}}
                          >
                            {attribute.name !== 'Color' && item.value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <span className="text-base">PRICE:</span>
                  <div className="text-lg font-semibold">${productData.prices[0].amount}</div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={addToCart}
                  className={`w-full py-2 rounded ${productData.inStock ? 'bg-green-400 text-white' : 'disabled'} cursor-pointer`}
                  disabled={!productData.inStock}
                  data-testid="add-to-cart"
                >
                  Add to Cart
                </button>
              </div>
              <div className="mt-4" data-testid="product-description" dangerouslySetInnerHTML={{ __html: productData.description }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
