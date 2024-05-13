import { useState } from 'react';
import UserForm from './UserForm.jsx'
import ToDoHome from './ToDoHome.jsx'


export default function App() {
  const [isLoggedIn, setLogIn] = useState(true);
  let content;
  if (isLoggedIn) {
    content = <ToDoHome />;
  } else {
    content = <UserForm />;
  }
  return (
    <div>
      {content}
    </div>
  );
}