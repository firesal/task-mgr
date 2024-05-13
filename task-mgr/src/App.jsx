import { useState } from 'react';
import UserForm from './UserForm.jsx'
import TaskMgr from './TaskMgr.jsx'


export default function App() {
  const [isLoggedIn, setLogIn] = useState(true);
  let content;
  if (isLoggedIn) {
    content = <TaskMgr />;
  } else {
    content = <UserForm />;
  }
  return (
    <div>
      {content}
    </div>
  );
}