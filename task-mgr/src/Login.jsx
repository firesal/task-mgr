import { useState, useEffect } from "react";



function openForm(setOpen) {

  setOpen(true)
}

function closeForm(setOpen) {

  setOpen(false)
}

async function addUserDb(data, setOpen){
    fetch('http://localhost:5000/api/user/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json', // Send data as JSON
      },
      body: JSON.stringify(data) // Convert data to JSON string
  
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
  })
  .then(data => {
    if (data.status == true){
        setOpen(false)
    }
     alert(data.message)
     location.reload()
    
  })
  .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
  });
}
let setFormDefault
setFormDefault = ()=>null
export function LForm({formOpen, setOpen}) {

  
    useEffect(() => {
      function setFormDefault(){
    const form = document.getElementById('login_form')
    if (form != null) {
        const button = document.getElementById('actualSubmit');
        button.replaceWith(button.cloneNode(true));
        form.addEventListener('submit', function(event) {
          event.preventDefault(); // Prevent the default form submission

          const form = event.target;
          const formData = new FormData(form); // Create a FormData object from the form

          // Convert FormData to a plain object
          // const email = document.querySelector('#email"]').value
          // const password = document.querySelector('input[name="password"]').value
          const data = Object.fromEntries(formData.entries());
          // const data = {
            // "email": email,
            // "password": password
          // }
          console.log(data)
          // Make a fetch request to submit the form data
          addUserDb(data, setOpen)
          });

        }

      }

      setFormDefault()
      }
    , [])
     return (
<div className= "w-full mx-auto ">
    <div id="login-modal" tabindex="-1" aria-hidden="false" className="flex items-center overflow-y-auto overflow-x-hidden absolute inset-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="absolute p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Login
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="login-modal" onClick={()=>closeForm(setOpen)}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  

                    <form class="max-w-sm mx-auto" id="login_form">
                      <div class="mb-5">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" id="email" name="email"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
                      </div>
                      <div class="mb-5">
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" id="password" name="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                      </div>
                      <div class="flex items-start mb-5">
                        <div class="flex items-center h-5">
                          <input id="remember" name="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                        </div>
                        <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                      </div>
                    <button id="actualSubmit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>setFormDefault()}>Login</button>
                    <button type="submit" className="hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>

                </div>

            </div>
        </div>
    </div>
  </div>
)
}

export default function Registration({formOpen, setOpen}) {

  
    useEffect(() => {

      }
    , []);
if(!formOpen) {
      return(



  
    <div className= "w-full mx-auto my-3">
      <button className="mx-auto block text-black bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 hover:bg-gradient-to-br border border-gray-300 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5" type="button" onClick={()=>openForm(setOpen)}>
        Login
      </button>
    </div>
    )}
else { 
    return( <LForm formOpen={formOpen} setOpen={setOpen} />)
 }}
