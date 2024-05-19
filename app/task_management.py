from mongo_utils import add_task, find_task_by_user_id, update_task_by_id, delete_task

def add_first_task_for_user(user_id):
    '''
    Add sample task for a new user
    '''
    result = add_task({
        "title":"Your First Task",
        "description":"Your task description",
        "user_id":str(user_id),
        "status":"To Do"
        })
    tasks = find_task_by_user_id(user_id)
    return {"status": result.acknowledged, "message": "task added", "tasks": tasks}

def fetch_user_tasks(user_id):
    return find_task_by_user_id(user_id)

def update_task_mongo(task_id, task_values):
    new_values = {}
    for key, value in task_values.items():
        if key in ['title', 'description', 'status']:
            new_values[key] = value
    result = update_task_by_id(task_id, new_values)
    return {"status": result.acknowledged, "message": "task sucessfully updated"}



def add_task_for_user(user_id, task_details):
    '''
    Add task for a existing user
    '''

    result = add_task({
        "title":task_details['title'],
        "description":task_details['description'],
        "user_id":str(user_id),
        "status":task_details['status']
        })
    tasks = find_task_by_user_id(user_id)
    return {"status": result.acknowledged, "message": "task added", "tasks": tasks, "task_id": str(result.inserted_id)}

def delete_task_by_task_id(task_id):
    result = delete_task(str(task_id))
    '''
    Delete task corresponding to the given task_id
    '''
    return {"status": result.acknowledged, "message": "task delete"}