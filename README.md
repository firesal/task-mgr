# task-mgr
A minimal taskm manager application using Flask, React, Javascript and mongodb.



## Introduction

This project is a simple task management application that allows users to create, update, and delete tasks. Tasks have a title, description, and a status (e.g., "To Do," "In Progress," "Done"). Users can view a list of tasks and filter them by status. This application includes both front-end and back-end components, ensuring a complete and functional task management system.

## Features

- Users can add tasks and filter them based on status
- User can register using their email id and save tasks. Login from any of your device to retrieve task.
- Auto save. There is no save button, every edit gets updated in the db.
- Simple intuitive User interface.
- Built using tailwind , so you can fork and customize the project according to your needs easily using tailwind, to go it colors and themes of your choice.

## Getting Started

### Prerequisites



- [Node.js](https://nodejs.org/en/download/package-manager/current) and npm 
- [MongoDB server](https://hub.docker.com/_/mongo)
- [Flask](https://flask.palletsprojects.com/en/3.0.x/installation/)
- [React + Vite + Tailwind](https://tailwindcss.com/docs/guides/vite)

Click on any of the prerequisite to know how to install an use them.

### Installation and Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/firesal/task-mgr.git
   ```

2. Navigate to the project directory:
   ```bash
   cd task-mgr/task-mgr
   ```

   Then start the react white project from this directory. [Click here](https://tailwindcss.com/docs/guides/vite) to learn how.	
   
3. Then open a new terminal, create a python [virtual environment](https://docs.python.org/3/library/venv.html) and activate it
   
4. Navigate to the Flask API directory.

   ```bash
   cd app
   ```

5. Run the flask project using the following command

   ```bash
   flask run
   ```

   

## Contributing

Contributions are welcome! Please follow the guidelines in `CONTRIBUTING.md` for submitting changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

