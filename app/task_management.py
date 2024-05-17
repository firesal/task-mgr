from mongo_utils import add_task, find_task_by_user_id

def add_first_task_for_user(user_id):
    '''
    Add sample task for a new user
    '''
    result = add_task({
        "title":"Your First Task",
        "description":"Your task description",
        "user_id":user_id,
        "status":"To Do"
        })
    tasks = find_task_by_user_id(user_id)
    return {"status": result.acknowledged, "message": "task added", "tasks": tasks}

def fetch_user_tasks(user_id):
    return find_task_by_user_id(user_id)