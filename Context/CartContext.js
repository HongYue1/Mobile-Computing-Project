import React, { createContext, useState, useEffect, useContext } from "react";
import { authentication, database } from "../Firebase_config";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [currentUser, setCurrentUser] = useState(authentication.currentUser);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(authentication, (user) => {
      setCurrentUser(user);
      if (!user) {
        setCartItems([]);
        setLoadingCart(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeFirestore = () => {};
    if (currentUser) {
      setLoadingCart(true);
      const cartDocRef = doc(
        database,
        "users",
        currentUser.uid,
        "cart",
        "currentCart"
      );

      unsubscribeFirestore = onSnapshot(
        cartDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setCartItems(docSnap.data().items || []);
          } else {
            // If cart doesn't exist, create an empty one for new users or if deleted
            setDoc(cartDocRef, { items: [] })
              .then(() => setCartItems([]))
              .catch((err) => console.error("Error creating empty cart:", err));
          }
          setLoadingCart(false);
        },
        (error) => {
          console.error("Error fetching cart from Firestore:", error);
          setCartItems([]); // Fallback to empty cart on error
          setLoadingCart(false);
        }
      );
    } else {
      // For anonymous users, cart is only local and clears on logout/app close
      setCartItems([]);
      setLoadingCart(false);
    }
    return () => unsubscribeFirestore();
  }, [currentUser]);

  const updateFirestoreCart = async (newCartItems) => {
    if (currentUser) {
      try {
        const cartDocRef = doc(
          database,
          "users",
          currentUser.uid,
          "cart",
          "currentCart"
        );
        await setDoc(cartDocRef, { items: newCartItems });
      } catch (error) {
        console.error("Error updating Firestore cart:", error);
      }
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );
      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        newItems = [...prevItems, { ...product, quantity }];
      }
      updateFirestoreCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId);
      updateFirestoreCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      updateFirestoreCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (currentUser) {
      updateFirestoreCart([]);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        loadingCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
