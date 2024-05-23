import re
import hashlib
from bson.objectid import ObjectId
from mongo_utils import (
    find_user_by_username,
    find_user_by_email,
    add_user,
    update_secret_question,
    update_password,
    insert_test_user,
    update_user,
    find_user_by_userid,
    find_user,
)


EMAIL_VALIDATION_REGEX = r"""(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])"""  # noqa


class User:
    def __init__(
        self,
        username,
        password,
        repeat_password,
        secret_question,
        answer,
        email,
        _id=None,
    ):
        self._id = str(_id)
        self.username = username
        self.password = password
        self.repeat_password = repeat_password
        self.secret_question = secret_question
        self.answer = answer
        self.email = email
        self.validation_msg = ""

    def to_json(self):
        return {
            "_id": self._id,
            "username": self.username,
            "password": self.password,
            "secret_question": self.secret_question,
            "answer": self.answer,
            "email": self.email,
        }

    @staticmethod
    def from_json(json_values):
        return User(**json_values)

    @staticmethod
    def validate_username(username):
        if len(username) < 4:
            return False, "username too short"
        elif not any(letter.isalnum() for letter in username):
            return False, "username does not contain alphabets or digits"
        elif find_user_by_username(username):
            return False, "username is already taken"

        return True, "username is valid and available"

    @staticmethod
    def validate_email(email):
        if not re.fullmatch(EMAIL_VALIDATION_REGEX, email):
            return False, "username too short"
        elif find_user_by_email(email):
            return False, "email already associated with a username"

        return True, "username is valid and available"

    @staticmethod
    def validate_answer(answer):
        if len(answer) < 3:
            return False, "answer too short"
        return True, "answer acceptable"

    @staticmethod
    def validate_password(password, repeat_password):
        if password != repeat_password:
            return False, "password not same"
        return True, "Password is the same"

    @staticmethod
    def add_user(user_details):
        current_user = User.from_json(user_details)
        if current_user.validate_new_user():
            result = add_user(user_details)
            return {"status": result.acknowledged, "message": "user added"}
        return {"status": False, "message": "User validation failed"}

    def validate_new_user(self):
        self.validation_msg = ""
        validations = [
            User.validate_username(self.username),
            User.validate_password(self.password, self.repeat_password),
            User.validate_email(self.email),
            User.validate_answer(self.answer),
        ]
        self.validation_msg = "\n".join(
            [result[1] for result in filter(lambda x: not x[0], validations)]
        )
        print(self.validation_msg)
        if all([result[0] for result in validations]):
            return True

        return False

    @staticmethod
    def check_if_username_exists(username):
        if find_user_by_username(username):
            return {"status": True, "message": "username exists"}
        return {"status": False, "message": "username does not exist"}

    @staticmethod
    def check_if_email_exists(email):
        if find_user_by_email(email):
            return {"status": True, "message": "user with this email exists"}
        return {"status": False, "message": "user with this email does not exist"}

    @staticmethod
    def update_secret_question(updated_question, updated_answer, username):
        if User.check_if_username_exists(username)["status"] is True:
            result = update_secret_question(updated_question, updated_answer, username)
            return {
                "status": result.acknowledged,
                "message": "Secret question sucessfully updated",
            }
        return {"status": False, "message": "User with given username does not exist"}

    @staticmethod
    def update_password(new_password, username):
        if User.check_if_username_exists(username)["status"] is True:
            result = update_password(new_password, username)
            return {
                "status": result.acknowledged,
                "message": "Password sucessfully updated",
            }
        return {"status": False, "message": "User with given username does not exist"}

    @staticmethod
    def add_demo_user():
        added_user_id = insert_test_user().inserted_id
        return added_user_id

    @staticmethod
    def rename_and_update_user(user_id, values):
        query = {"_id": ObjectId(str(user_id))}
        values.pop("repeat_password")
        values["password"] = hashlib.md5(values["password"].encode("utf-8")).hexdigest()
        # user = User(_id=user_id, **values)
        result = update_user(query, {"$set": values})
        return {
            "status": result.acknowledged,
            "message": "User Details sucessfully updated.",
        }

    @staticmethod
    def find_user_by_id(user_id):
        return find_user_by_userid(user_id)

    @staticmethod
    def login_user(email, password):
        password = hashlib.md5(password.encode("utf-8")).hexdigest()
        query = {"email": email, "password": password}
        result = find_user(query)
        if result:
            return {
                "status": True,
                "message": "Login Success",
                "user_id": str(result[0]["_id"]),
            }
        return {"status": False, "message": "Login Failed"}
