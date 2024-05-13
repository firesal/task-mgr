import { useState, useEffect } from "react";

async function fetchDataFromEndpoint() {
  try {
    const response = await fetch('http://localhost:5000/api/taskmgr/lists', {
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
async function updateDataFromEndpoint(tasks) {
  try {
    const response = await fetch('http://localhost:5000/api/taskmgr/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks)
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

function updateDescription(task_id, tasks, setTasks) {
  let current_task_index, value
  current_task_index = tasks.findIndex((item)=>{return item.id==task_id})
  value = document.querySelector(`li[data-taskid="${task_id}"] p`).innerText
  tasks[current_task_index].description = value
  setTasks(tasks)
  const task_updation = updateDataFromEndpoint(tasks)
}

function updateTitle(task_id, tasks, setTasks) {
  let current_task_index, value
  current_task_index = tasks.findIndex((item)=>{return item.id==task_id})
  value = document.querySelector(`li[data-taskid="${task_id}"] h5`).innerText
  tasks[current_task_index].title = value
  setTasks(tasks)
  const task_updation = updateDataFromEndpoint(tasks)
}
let filteredTasks, setFilteredTasks
function updateSearch(setSearch) {
  let value, new_tasks
  value = document.querySelector(`#default-search`).value
  setSearch(value)
  new_tasks = tasks.filter((task)=>true)
  console.log(new_tasks)
  setFilteredTasks(new_tasks)
}

async function updateStatus(task_id, tasks, setTasks) {
  let current_task_index, value
  tasks = tasks.slice()
  current_task_index = tasks.findIndex((item)=>{return item.id==task_id})
  value = document.querySelector(`li[data-taskid="${task_id}"] select`).value
  tasks[current_task_index].status = value
  const task_updation = await updateDataFromEndpoint(tasks)
  setTasks(tasks)
}
let tasks, setTasks
let filterSearch, setSearch
export function SearchFilter() {
  [filterSearch, setSearch] = useState('')

  return (
<form class="max-w-md mx-auto">   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Filter tasks..." required  value={filterSearch} onChange={()=>updateSearch(setSearch)}/>
        <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>
</form>
)
}


export default function TaskMgr() {

  [tasks, setTasks] = useState([])
  [filteredTasks, setFilteredTasks] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the endpoint
        const newData = await fetchDataFromEndpoint();

        setTasks(newData);
        if (document.getElementById('default-search') != null){
          filterValue = document.getElementById('default-search').value
          if (value != ''){
            tasks = tasks.filter((task)=>task.title.includes(value))
            setTasks(tasks)
            setFilteredTasks(tasks)
            console.log(filteredTasks)
          }
        }
      } catch (error) {
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const listItems = tasks.map(task =>

<li class="w-full mx-auto" data-taskid={task.id}>
<a href="#" class="w-full block max-w-screen p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white" key={task.id} contentEditable={true} onInput={()=>updateTitle(task.id, tasks, setTasks)}>{task.title}</h5>
<div class="flex flex-row justify-between p-4 leading-normal">
  <p class="font-normal text-gray-700 dark:text-gray-400" key={'p-'+task.id} contentEditable={true} onInput={()=>updateDescription(task.id, tasks, setTasks)}>{task.description}</p>
  <select key={'select-'+task.id} id={"taskstatus"+task.id} class="w-min bg-transparent text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  onChange={()=>updateStatus(task.id, tasks, setTasks)} value={task.status}>

    <option>To Do</option>
    <option>Doing</option>
    <option>Done</option>
  </select>
</div>
</a>
</li>

  );
  return (
    <>
    <SearchFilter />
    <div class="w-full mx-auto">
  <ul class="w-full mx-auto text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">{listItems}</ul>
  </div>
  </>
  )}
