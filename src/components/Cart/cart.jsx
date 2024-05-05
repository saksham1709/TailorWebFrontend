import React, { useState, useEffect } from 'react';
import "./cart.css";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Fetch cart items from the API
    useEffect(() => {
        // Make API call to fetch cart items
        const fetchCart = async () => {
            try {
                const cartResponse = await fetch('/cart');
                const cartData = await cartResponse.json();
                console.log(cartData[0])
                const productResponse = await fetch(`/products/${cartData[0].productId}`);
                const productData = await productResponse.json();
                setCartItems(productData);
                // setTotal()
            } catch (err) {
                console.log(err)
            }
        }
        fetchCart();
        // fetch('/cart')
        //     .then(response => response.json())
        //     .then(data => {
        //         setCartItems(data.cartItems);
        //         setTotal(data.total);
        //     })
        //     .catch(error => console.error('Error fetching cart items:', error));
    }, []);

    // Handle quantity change
    const handleQuantityChange = (index, newQuantity) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity = newQuantity;
        setCartItems(updatedCartItems);

        // Make API call to update cart item quantity
        fetch(`/cart/${updatedCartItems[index].id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: newQuantity }),
        })
            .then(response => response.json())
            .then(data => {
                // Update total price if needed
                setTotal(data.total);
            })
            .catch(error => console.error('Error updating cart item:', error));
    };

    // Handle remove item
    const handleRemoveItem = (index) => {
        const updatedCartItems = [...cartItems];
        const removedItemId = updatedCartItems[index].id;
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);

        // Make API call to remove cart item
        fetch(`/cart/${removedItemId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                // Update total price if needed
                setTotal(data.total);
            })
            .catch(error => console.error('Error removing cart item:', error));
    };

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {/* {cartItems.map((item, index) => ( */}
            <div className="cart-item">
                <img src={cartItems.images} alt={cartItems.name} />
                <div className="cart-item-info">
                    <h3>{cartItems.name}</h3>
                    <h2>Color: {cartItems.customStyle.color}</h2>
                    <h2>Collar: {cartItems.customStyle.collar}</h2>
                    <h2>Cuff: {cartItems.customStyle.cuff}</h2>
                    <h2>Pocket: {cartItems.customStyle.pocket}</h2>
                    {/* <div className="quantity-buttons">
                        <button onClick={() => handleQuantityChange(index, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</button>
                    </div> */}
                    {/* <button onClick={() => handleRemoveItem(index)}>Remove</button> */}
                </div>
                <div className="cart-item-price">${cartItems.price}</div>
                {/* <div className="cart-item-price">${item.price * item.quantity}</div> */}
            </div>
            {/* ))} */}
            {/* <div className="cart-total">
                Price: ${cartItems.price}
            </div> */}
            <button className="place-order-button">Place Order</button>
        </div>
    );
};

export default Cart;
