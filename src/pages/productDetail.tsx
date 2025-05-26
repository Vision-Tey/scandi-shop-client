import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../context/StateProvider';
import { ADD_TO_CART, TOGGLE_CART, UPDATE_CART_ITEM } from '../constants/constants';
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
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [productData, setProductData] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { id } = useParams();
  const { state, dispatch } = useStateValue();
  const { products, cart } = state;


  useEffect(() => {
    if (productData?.gallery?.length) {
      setSelectedImage(productData.gallery[0]);
    }
  }, [productData]);


  useEffect(() => {
    const product = products?.find(p => p.id === id);
    if (product) {
      setProductData(product);
    }
  }, [id, products]);

  const handleAttributeSelect = (attributeName: string, value: string) => {
    console.log(productData?.attributes);

    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const getDefaultAttributes = (attributes: ProductAttribute[]) => {
    const defaults: { [key: string]: string } = {};
    attributes?.forEach(attr => {
      if (attr.items.length > 0) {
        defaults[attr.name] = attr.items[0].value;
      }
    });
    return defaults;
  };

  const getFinalAttributes = () => {
    if (!productData) return {};
    const defaults = getDefaultAttributes(productData.attributes);
    return {
      ...defaults,
      ...selectedAttributes,
    };
  };

  const areAllAttributesSelected = () => {
    if (!productData) return false;
    // Products without attributes
    if (!productData.attributes) return true;

    return productData?.attributes?.every(attr => selectedAttributes[attr.name]);
  };

  const addToCart = () => {
    if (!productData) return;

    const finalAttributes = getFinalAttributes();

    // Map verbose attribute names to short, consistent keys
    const attributeKeyMap: { [key: string]: string } = {
      "color": "color",
      "size": "size",
      "capacity": "capacity",
      "with usb 3 ports": "ports",
      "touch id in keyboard": "touchIDInKeyboard"
    };

    const normalizedFinalAttributes: { [key: string]: string } = {};
    productData?.attributes?.forEach(attr => {
      const originalName = attr.name.toLowerCase();
      const mappedKey = attributeKeyMap[originalName];

      if (mappedKey) {
        normalizedFinalAttributes[mappedKey] = finalAttributes[attr.name] || "";
      }
    });

    const knownAttributes = ["color", "size", "capacity", "ports", "touchIDInKeyboard"];

    const newItem: any = {
      id: productData.id,
      name: productData.name,
      image: productData.gallery[0],
      description: productData.description,
      price: productData.prices[0].amount,
      category: productData.category,
      quantity: 1,
      attributes: productData.attributes,
      ...Object.fromEntries(
        knownAttributes.map(attr => [attr, normalizedFinalAttributes[attr] || ""])
      ),
    };

    const existingCartItem = cart.find(item => {
      if (item.id !== productData.id) return false;
      // Check if all current attributes value match the cart item attributes values
      if (item.attributes && item.attributes.length > 0) {
        return Object.keys(normalizedFinalAttributes).every(attr =>
          item[attr] === normalizedFinalAttributes[attr]
        );
      }
      // If no attributes, just match by ID
      return true;
    });

    if (existingCartItem) {
      dispatch({
        type: UPDATE_CART_ITEM,
        id: existingCartItem.id,
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        id: productData.id,
        item: newItem,
      });
    }

    dispatch({ type: TOGGLE_CART });
  };

  interface HandleSelectedFn {
    (attributeName: string, itemValue: string): boolean;
  }

  const handleSelected: HandleSelectedFn = (attributeName, itemValue) => {
    switch (attributeName.toLowerCase()) {
      case 'size':
        return selectedAttributes['Size'] === itemValue;
      case 'color':
        return selectedAttributes['Color'] === itemValue;
      case 'capacity':
        return selectedAttributes['Capacity'] === itemValue;
      case 'ports':
        return selectedAttributes['With USB 3 ports'] === itemValue;
      case 'touch id in keyboard':
        return selectedAttributes['Touch ID in keyboard'] === itemValue;
      default:
        return false;
    }
  };

  const renderDescription = (html: string) => {
    const paragraphRegex = /<p>(.*?)<\/p>/g;
    const parts = [];
    let match;
    let index = 0;

    while ((match = paragraphRegex.exec(html)) !== null) {
      parts.push(<p key={index++} className="my-2">{match[1]}</p>);
    }

    return parts;
  };

  const handlePrev = () => {
    if (!productData) return;
    const currentIndex = productData.gallery.indexOf(selectedImage);
    if (currentIndex > 0) {
      setSelectedImage(productData.gallery[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!productData) return;
    const currentIndex = productData.gallery.indexOf(selectedImage);
    if (currentIndex < productData.gallery.length - 1) {
      setSelectedImage(productData.gallery[currentIndex + 1]);
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
                  <img
                    key={index}
                    src={imgSrc}
                    onClick={() => setSelectedImage(imgSrc)}
                    className={`w-20 h-20 object-cover cursor-pointer border-2 ${selectedImage === imgSrc ? "border-black" : "border-transparent"
                      }`}
                    alt={`Thumbnail ${index}`}
                  />
                ))}
              </div>
              <div className="relative w-[400px] h-[400px]">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
                {/* Left Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-500 px-2 py-1 text-white hover:bg-gray-700"
                >
                  &#8249;
                </button>
                {/* Right Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white hover:bg-gray-700 px-2 py-1"
                >
                  &#8250;
                </button>
              </div>
            </div>

          </div>

          <div className="w-full lg:w-[30%]">
            <div className="product-card">
              <h2 className="text-2xl font-normal">{productData.name}</h2>
              <div className="mt-4">
                {productData?.attributes?.map(attribute => (
                  <div
                    data-testid={`product-attribute-${toKebabCase(attribute.name)}`}
                    key={attribute.id}
                    className="mb-4">
                    <h3>{attribute.name}</h3>
                    <div className="flex flex-wrap mt-1">
                      {attribute?.items?.map(item => {
                        const selected = selectedAttributes[attribute.name] === item.value;
                        return (
                          <button
                            key={item.id}
                            data-testid={`product-attribute-${toKebabCase(attribute.name)}-${item.value}${handleSelected(attribute.name, item.value) ? "-selected" : ""}`}
                            onClick={() => handleAttributeSelect(attribute.name, item.value)}
                            className={`mr-2 mb-2 p-2 border-gray-300 border-2 ${attribute.name === 'Color' ? '' : 'border-b-black'} h-10 w-16 ${selected ? 'bg-black text-white' : 'bg-white text-black'
                              } cursor-pointer`}
                            style={
                              attribute.name === 'Color'
                                ? {
                                  backgroundColor: item.value,
                                  borderColor: selected ? 'green' : undefined,
                                  borderWidth: selected ? '3px' : undefined,
                                }
                                : {}
                            }
                          >
                            {attribute.name !== 'Color' && item.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <span className="text-base">PRICE:</span>
                  <div className="text-lg font-semibold">${productData.prices[0].amount}</div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={addToCart}
                    className={`w-full py-2 rounded ${productData.inStock && areAllAttributesSelected()
                      ? 'bg-green-400 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-600'
                      }`}
                    disabled={!productData.inStock || !areAllAttributesSelected()}
                    data-testid="add-to-cart"
                  >
                    Add to Cart
                  </button>
                </div>

                <div className="mt-4" data-testid="product-description">
                  {renderDescription(productData.description)}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
