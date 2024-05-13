import { useState } from 'react';
{

async function fetchDataFromEndpoint() {
  try {
    const response = await fetch('/api/todo/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle errors
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}
}
export default function ToDoHome() {
  [products, setProducts] = useState([])
  // const products = [
  //   { title: 'Cabbage', id: 1 },
  //   { title: 'Garlic', id: 2 },
  //   { title: 'Apple', id: 3 },
  // ];

    fetchDataFromEndpoint()
      .then(data => {
        setProducts(data)
      })
      .catch(error => {
        // Handle errors
        console.error('Error fetching data:', error);
    });
  const listItems = products.map(product =>
  <li key={product.id} class="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
    {product.title}
  </li>
);
  return (
    <div class="w-full mx-auto">
  <ul class="w-48 mx-auto text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">{listItems}</ul>
  </div>
  )
}