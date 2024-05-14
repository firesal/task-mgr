import { useState, useEffect } from "react";
import EditableInput from './EditableInput'

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
let original_tasks
async function addTask(){
  let all_tasks
  all_tasks = await fetchDataFromEndpoint();
  if (all_tasks.filter((task)=>task.id =='new_id').length < 1 ){
    let new_task = {'id':'new_id', 'title':'Add Title..', 'description': 'Add description..', 'status':'To Do'}
    
    all_tasks.push(new_task)
    updateDataFromEndpoint(all_tasks)
    setTasks(all_tasks)
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
function updateSearch(setSearch) {
  let value, new_tasks, tasks_status
  value = document.querySelector(`#default-search`).value
  setSearch(value)
  tasks_status = document.querySelector('#task-status-filter').value
  new_tasks = original_tasks.filter((task)=>task.title.toLowerCase().includes(value))
  if (tasks_status != 'All'){
    new_tasks = new_tasks.filter((task)=>task.status == tasks_status)
  }
  setTasks(new_tasks)
  return new_tasks
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
        <select id="task-status-filter" class="w-min absolute end-2.5 bottom-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={()=>updateSearch(setSearch)}>
          <option selected>All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
    </div>
</form>
)
}

export function MgrFooter() {
return(

<div class="relative bg-white rounded-lg shadow dark:bg-gray-900 m-4">
    <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
              <button type="button" class="fixed bottom-0 left-3 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={addTask}>
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Add Task</span>
            </button>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        
    </div>
</div>
)

}

export default function TaskMgr() {

  [tasks, setTasks] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the endpoint
        const newData = await fetchDataFromEndpoint();

        setTasks(newData);
        original_tasks = newData
        if (document.getElementById('default-search') != null){
          filterValue = document.getElementById('default-search').value
          if (value != ''){
            tasks = tasks.filter((task)=>task.title.includes(value))
            setTasks(tasks)
          }
        }
      } catch (error) {
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const listItems = tasks.map(task =>

<li class="w-full mx-auto"  key={'li-'+task.id}data-taskid={task.id}>
<div href="#" class="w-full block max-w-screen p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

<h5 class="min-w-72 p-2 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:border hover:border-blue-300" key={task.id} contentEditable={true} suppressContentEditableWarning={true} onInput={()=>updateTitle(task.id, tasks, setTasks)}>{task.title}</h5>
<div class="flex flex-row justify-between p-4 leading-normal">
  <p class="cursor-text min-w-72 p-2 font-normal hover:border hover:border-blue-300 text-gray-700 dark:text-gray-400" key={'p-'+task.id} contentEditable={true} suppressContentEditableWarning={true} onInput={(event)=>updateDescription(task.id, tasks, setTasks)}>{task.description}</p>
  <select key={'select-'+task.id} id={"taskstatus"+task.id} class="w-min bg-transparent text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  onChange={()=>updateStatus(task.id, tasks, setTasks)} value={task.status}>

    <option>To Do</option>
    <option>In Progress</option>
    <option>Done</option>
  </select>
</div>
</div>
</li>

  );
  return (
    <>
    <SearchFilter />
    <div class="w-full mx-auto">
  <ul class="w-full mx-auto text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">{listItems}</ul>
  </div>
  <MgrFooter />
  </>
  )}
