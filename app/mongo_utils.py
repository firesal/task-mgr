import pymongo
from os import environ


def get_client():
    """
    This function return pymongo client. If MONGO_HOST is not designed local host
    is tried for connection

    Returns:
    type: MongoClient Instance

    Raises:
    pymongo.errors.ServerSelectionTimeoutError: If server is not available.
    """
    host = environ.get("MONGO_HOST") or "localhost"
    return pymongo.MongoClient(host, 27017)


CLI = get_client()


# Functions for user class
def get_users_collection():
    """
    This function fetches users collection.
    if collection does not exist it will created,

    Returns:
    type: users collection instance.

    Raises:
    ConnectionError: if client is not connected
    """
    if CLI is not None:
        db = CLI.to_do_list
        users = db.users
        return users
    raise ConnectionError("Mongo Client Not connected")


def insert_test_user():
    """
    This function inserts a user named test for testing purposes

    Returns: InsertOneResult
    """
    users = get_users_collection()
    inserted = users.insert_one(
        {
            "username": "test",
            "password": "xyz",
            "secret_question": "whats your petsname?",
            "answer": "Mars",
            "email": "xyz@domain.com",
        }
    )
    return inserted


def delete_test_user():
    """
    This function deletes a user named test  created for testing purposes

    Returns: DeleteResult
    """
    users = get_users_collection()
    deleted = users.delete_one(
        {
            "username": "test",
            "password": "xyz",
            "secret_question": "whats your petsname?",
            "answer": "Mars",
            "email": "xyz@domain.com",
        }
    )
    return deleted


def add_user(user_details):
    """
    This function adds a new user to the db.

    Parameters:
    user_details (dict): a dict containing user details.
    Example: {
        "username":"test",
        "password":"xyz",
        "secret_question":"whats your petsname?",
        "answer":"Mars",
        "email":"xyz@domain.com"
        }

    Returns:
    type: InsertOneResult
    """
    users = get_users_collection()
    return users.insert_one(user_details)


def find_user(query):
    """
        This is general function to find users by query
        Parameters:
    query (dict): dict containing query to find matching documents

    Returns:
    type: List containing documents matched by query
    """
    users = get_users_collection()
    return list(users.find(query))


def update_user(query, updated_values):
    """
    This function updates users matching query with uodated values

    Parameters:
    query (dict): query dict to filter matching first document that needs the updation
    updated_values (dict): dict containing fields and values which needs updation

    Returns:
    UpdateResult
    """
    users = get_users_collection()
    return users.update_one(query, updated_values)


def find_user_by_email(email):
    """
    Finds user matching the email.

    Parameters:
    email (str): Email of tbe corresponding user

    Returns:
    List: List of values matching corresponding user
    """
    return find_user({"email": email})


def find_user_by_username(username):
    """
    Finds user matching the username.

    Parameters:
    username(str): username of tbe corresponding user

    Returns:
    List: List of values matching corresponding user
    """
    return find_user({"username": username})


def update_secret_question(updated_question, updated_answer, username):
    """
    This function is to update secret question of a user.

    Parameters:
    upadted_question (str): New secret question for the user.
    updated_answer (str): Answer to the secret question.
    username (str): Username of the corresponding user

    Returns:
    UpdatedResult
    """
    query = {"username": {"$eq": username}}
    updated_values = {
        "$set": {"secret_question": updated_question, "answer": updated_answer}
    }
    return update_user(query, updated_values)


def update_password(new_password, username):
    """
    This function updates password of the corresponding username

    Parameters:
    new_password (str): new_password for the user.
    username (str): username of the corresponding user.

    Returns:
    UpdatedResult
    """
    query = {"username": {"$eq": username}}
    if new_password:
        updated_values = {"$set": {"password": new_password}}
        return update_user(query, updated_values)
    return False
