import React, { useState} from 'react';

const ProductForm = ({ onSubmit }) => {
  const [products, setProducts] = useState([{ name: '', price: '', code: '', brand: '' }]);
 
  // const [error, setError] = useState('');

  // useEffect(() => {
  //   fetchAllItems();
  // }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;
    setProducts(updatedProducts);
    console.log('Updated Products:', updatedProducts); // Log state to inspect values
};


  const handleAddProduct = () => {
    setProducts([...products, { name: '', price: '', code: '', brand: '' }]);
    const isDuplicateCode = products.some((product, index, arr) =>
    arr.findIndex((p) => p.code === product.code) !== index
  );
  if (isDuplicateCode) {
    alert('Duplicate product code found. Ensure each product has a unique code.');
    return;
  }
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    // setProducts([...products, { name: '', price: '', code: '', brand: '' }]);
    e.preventDefault();
   

    try {
      
        // Instead of accessing form fields directly, use the state
        const payload = { products: products };

        const response = await fetch('http://localhost:3000/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert('Product submitted successfully');
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error submitting product:', error.message);
        alert('Failed to submit product');
    }
};

  
  return (
    <div>
      <h1>Product Details</h1>
      {products.map((product, index) => (
        <div key={index} style={productContainerStyle}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => handleChange(index, e)}
            style={inputStyle}
          />
          <input
            type="text"
            name="price"
            placeholder="Product Price"
            value={product.price}
            onChange={(e) => handleChange(index, e)}
            style={inputStyle}
          />
          <input
            type="text"
            name="code"
            placeholder="Product Code"
            value={product.code}
            onChange={(e) => handleChange(index, e)}
            style={inputStyle}
          />
          <input
            type="text"
            name="brand"
            placeholder="Product Brand"
            value={product.brand}
            onChange={(e) => handleChange(index, e)}
            style={inputStyle}
          />
          {products.length > 1 && (
            <button onClick={() => handleRemoveProduct(index)} style={minusButtonStyle}>-</button>
          )}
          <button onClick={handleAddProduct} style={buttonStyle}> Add</button>
        </div>
      ))}
      <button onClick={handleSubmit} style={submitButtonStyle}>Submit</button>
      
      {/* <h2>All Items</h2>
      <ul>
        {allItems.map((item, index) => (
          <li key={index}>{}</li>
        ))}
      </ul> */}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  border: 'none',
  color: 'white',
  padding: '1px 12px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '10px',
  cursor: 'pointer',
};

const inputStyle = {
  width: '100px',
  margin: '5px',
};

const productContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const minusButtonStyle = {
  backgroundColor: '#f44336',
  border: 'none',
  color: 'white',
  padding: '1px 10px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
};

const submitButtonStyle = {
  backgroundColor: '#008CBA',
  border: 'none',
  color: 'white',
  padding: '15px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 452px',
  cursor: 'pointer',
};

export default ProductForm;