import React, { useCallback, useEffect, useState } from 'react';
import './TodoApp.css';

const TodoApp = () => {
  const [taskInput, setTaskInput] = useState("");

  const [tasks, setTask] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [editedTaskId, setEditedId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleAddTask = useCallback(() => {
    const text = taskInput.trim();
    if (!text) return;

    if (editedTaskId) {
      setTask(prev =>
        prev.map(task =>
          task.id === editedTaskId ? { ...task, name: text } : task
        )
      );
      setEditedId(null);
    } else {
      const newTask = {
        id: Date.now(),
        name: text,
        done: false
      };
      setTask(prev => [...prev, newTask]);
    }
    setTaskInput("");
  }, [taskInput, editedTaskId]);


  const handleDelete = (id) => {
    setTask(prevTasks => prevTasks.filter(task => task.id !== id));
    setEditedId(null);
    setTaskInput("");
  };

  const handleEdit = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setTaskInput(taskToEdit.name);
      setEditedId(id);
    }
  };


  const toggleDone = (id) => {
    setTask(prev =>
      prev.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <div className='todo'>
      <h1>To DO App</h1>
      <div className='input-row'>
        <input
          type='text'
          placeholder='Enter Task..'
          value={taskInput}
          onKeyDown={(e) => { if (e.key === "Enter") handleAddTask() }}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button
          className={`btn ${editedTaskId ? "edit-btn" : "add-btn"}`}
          onClick={handleAddTask}
        >
          {editedTaskId ? "Edit Task" : "Add Task"}
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className='empty-task'>No Tasks To Show</p>
      ) : (
        <table className='task-table'>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Task</th>
              <th>Done?</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td className={task.done ? "done-task done-animate" : ""}>
                  {task.name}
                </td>
                <td>
                  <input
                    type='checkbox'
                    checked={task.done}
                    onChange={() => toggleDone(task.id)}
                  />
                </td>
                <td>
                  <button className="btn edit-btn" onClick={() => handleEdit(task.id)}>Edit</button>
                  <button className="btn delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TodoApp;
