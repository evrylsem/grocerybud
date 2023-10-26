import React, { useState, useEffect } from 'react';
import './App.css'

interface GroceryItem {
  id: number;
  text: string;
  checked: boolean;
}



function App() {
  const [inputItem, setInputItem] = useState<string>('');
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [alert, setAlert] = useState(null);

  const Alert = ({ message, type, onClose }) => (
    <div className={`alert alert-${type}`}>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );

  const showAlert = (message, type) => {
    setAlert({message, type});
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    const savedItems = localStorage.getItem('groceryItems');
    if (savedItems) {
      setGroceryItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
  }, [groceryItems]);

  const handleChange = (e) => {
    setInputItem(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputItem.trim() === '') {
      showAlert('Please enter a valid item.', 'error');
      return;
    }

    const newItem: GroceryItem = {
      id: Date.now(),
      text: inputItem,
      checked: false,
    };

    setGroceryItems([...groceryItems, newItem]);
    setInputItem('');

    showAlert(`Item "${inputItem}" added to the basket.`, 'success');
  };

  const handleToggleCheck = (id: number) => {
    const updatedItems = groceryItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setGroceryItems(updatedItems);
  };

  const handleDeleteItem = (id: number) => {
    const itemToDelete = groceryItems.find((item) => item.id === id);
    if (itemToDelete) {
      setGroceryItems(groceryItems.filter((item) => item.id !== id));
      showAlert(`Item "${itemToDelete.text}" removed from the basket.`, 'success');
    }
  };

  return (
    <div>
      <div>
        {alert && (
          <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
        )}
      </div>
      <div id='container'>
        <form onSubmit={handleSubmit}>
          <h1>Grocery Bud</h1>
          <input
            type="text"
            placeholder="Add an item"
            value={inputItem}
            onChange={handleChange}
            id='user-input'
          />
          <button type="submit" id='add-btn'>Add Item</button>
        </form>
        
        <div id='todos-section'>
          <ul>
            {groceryItems.map((item) => (
              <li key={item.id} className={item.checked ? 'checked' : ''}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleCheck(item.id)}
                  className='item'
                />
                {item.text}
                <button onClick={() => handleDeleteItem(item.id)} id='del-btn'>delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App
