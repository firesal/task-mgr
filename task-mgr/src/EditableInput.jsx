import React, { useState } from 'react';

function EditableInput({ task, updateDescription, tasks, setTasks }) {
  const [inputValue, setInputValue] = useState(task.description);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    updateDescription(inputValue, task.id, tasks, setTasks);
  };

  return (
    <div className="p-2">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="border p-2 w-full"
        autoFocus
      />
    </div>
  );
}

export default EditableInput;
