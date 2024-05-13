import unittest
import requests

class Testing(unittest.TestCase):
    def test_new_user_endpoint(self):

        # Define the URL of the API endpoint
        url = 'http://127.0.0.1:5000/api/user/add_user'

        # Define the form data
        data = {
                "username": "test_unittest2",
                "password": "xyz",
                "secret_question": "whats your petsname?",
                "answer": "Mars",
                "email": "xyzunittest2@domain.com",
            }
        # Send a POST request with form data
        response = requests.post(url, data=data)
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
