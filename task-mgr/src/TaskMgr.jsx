import { useState, useEffect } from "react";
import Registration from './Registration';

async function fetchDataFromEndpoint() {
  try {
    const response = await fetch('http://localhost:5000/api/taskmgr/lists', {
      method: 'POST',
      credentials: 'include',
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
async function updateDataFromEndpoint(tasks, task_id) {
  try {
    const response = await fetch('http://localhost:5000/api/taskmgr/update', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'tasks': tasks, 'task_id': task_id})
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


async function insertDataFromEndpoint(tasks, task_id) {
  try {
    const response = await fetch('http://localhost:5000/api/taskmgr/add', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'tasks': tasks, 'task_id': task_id})
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


async function deleteDataFromEndpoint(task_id) {
  try {
    const response = await fetch('http://localhost:5000/api/taskmgr/delete', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'task_id': task_id})
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
let filterSearch, setSearch
let formOpen, setOpen
let tasks, setTasks
async function addTask(){
  let all_tasks
  all_tasks = await fetchDataFromEndpoint();
  if (all_tasks.filter((task)=>task.id =='new_id').length < 1 ){
    let new_task = {'id':'new_id', 'title':'Add Title..', 'description': 'Add description..', 'status':'To Do'}
    
    all_tasks.push(new_task)
    insertDataFromEndpoint(all_tasks, 'new_id').then((data)=>setTasks(data))
  }
}
// function loadRegistrationFormJson(){
//   let form_data
//   formdata = [...document.querySelectorAll('#registration_form input')].map((ele)=>())
// }

function deleteTask(task_id){
  console.log('task '+task_id+' is to be deleted')
  deleteDataFromEndpoint(task_id).then(
    (data)=>setTasks(data))
}


function updateDescription(task_id, tasks, setTasks) {
  let current_task_index, value
  current_task_index = tasks.findIndex((item)=>{return item.id==task_id})
  value = document.querySelector(`li[data-taskid="${task_id}"] p`).innerText
  tasks[current_task_index].description = value
  setTasks(tasks)
  const task_updation = updateDataFromEndpoint(tasks, task_id)
}

function updateTitle(task_id, tasks, setTasks) {
  let current_task_index, value
  current_task_index = tasks.findIndex((item)=>{return item.id==task_id})
  value = document.querySelector(`li[data-taskid="${task_id}"] h5`).innerText
  tasks[current_task_index].title = value
  setTasks(tasks)
  const task_updation = updateDataFromEndpoint(tasks, task_id)
}
function updateSearch(setSearch) {
  let value, new_tasks, tasks_status
  value = document.querySelector(`#default-search`).value
  setSearch(value)
  tasks_status = document.querySelector('#task-status-filter').value
  if (value != null && value != undefined && value != ''){  
    
    new_tasks = original_tasks.filter((task)=>(task.title.toLowerCase().includes(value.toLowerCase() || task.description.toLowerCase().includes(value.toLowerCase()))))
    }
  else{
    new_tasks = original_tasks
  }
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
  const task_updation = await updateDataFromEndpoint(tasks, task_id)
  setTasks(tasks)
}


export function SearchFilter() {
  [filterSearch, setSearch] = useState('')
  
  return (
<form className="max-w-md mx-auto">   
    <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Filter tasks..." required  value={filterSearch} onChange={()=>updateSearch(setSearch)}/>
        <select id="task-status-filter" className="w-min absolute end-2.5 bottom-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={()=>updateSearch(setSearch)}>
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

<div className="relative bg-white rounded-lg shadow dark:bg-gray-900 m-4">
    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
              <button type="button" className="fixed bottom-0 left-3 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={addTask}>
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Add Task</span>
            </button>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        
    </div>
</div>
)

}

export default function TaskMgr() {
  [tasks, setTasks] = useState([]);
  [formOpen, setOpen] = useState(false);
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

<li className="w-full mx-auto"  key={'li-'+task.id}data-taskid={task.id}>
<div href="#" className="w-full block max-w-screen p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

<h5 className="min-w-72 p-2 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:border hover:border-blue-300" key={task.id} contentEditable={true} suppressContentEditableWarning={true} onInput={()=>updateTitle(task.id, tasks, setTasks)}>{task.title}</h5>
<div className="flex flex-row justify-between p-4 leading-normal">
  <p className="cursor-text min-w-72 p-2 font-normal hover:border hover:border-blue-300 text-gray-700 dark:text-gray-400" key={'p-'+task.id} contentEditable={true} suppressContentEditableWarning={true} onInput={(event)=>updateDescription(task.id, tasks, setTasks)}>{task.description}</p>
  <div class="flex flex-row p-2">
  <select key={'select-'+task.id} id={"taskstatus"+task.id} className="w-min bg-transparent text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  onChange={()=>updateStatus(task.id, tasks, setTasks)} value={task.status}>

    <option>To Do</option>
    <option>In Progress</option>
    <option>Done</option>
  </select>
  <button  key={'del-'+task.id} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onMouseDown={()=>deleteTask(task.id)}>Delete</button>
  </div>
</div>
</div>
</li>

  );
  return (
    <>
    <Registration formOpen={formOpen} setOpen={setOpen}/>
    <div id="task-body" className={"w-full mx-auto " + (formOpen ? 'opacity-25': '')}>
      <SearchFilter />
      <div className="w-full mx-auto">
        <ul className="w-full mx-auto text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">{listItems}</ul>
      </div>
      <MgrFooter />
    </div>
  </>
  )}
