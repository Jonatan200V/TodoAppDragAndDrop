import { useRef, useState } from 'react';
import './css/main.css';
import { iconDelete } from './icons';
const tasksTodo = [
  { id: 1, task: 'Finish watching test' },
  { id: 2, task: 'See Cypress' },
  { id: 3, task: 'Combine everything learned' },
  { id: 4, task: 'See again some concepts' },
];
const App = () => {
  const [tasks, setTasks] = useState(tasksTodo);
  const [taskPending, setTaskPending] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState([]);
  const [newNotes, setNewNotes] = useState('');
  const dragItem = useRef();
  const dragItemOver = useRef();
  const handleTaskMoveStart = (evt, index) => {
    dragItem.current = index;
    evt.dataTransfer.setData('Task', evt.target.id);
  };
  const handleOver = (evt) => evt.preventDefault();
  const handleTaskDrop = (evt) => {
    const taskIterator = [...tasks];

    const draggedItemContent = taskIterator.splice(dragItem.current, 1);

    taskIterator.splice(dragItemOver.current, 0, ...draggedItemContent);

    setTasks(taskIterator);
  };
  const handleTaskEnter = (evt, index) => {
    dragItemOver.current = index;
  };
  const handleDropTask = (evt) => {
    const taskID = evt.dataTransfer.getData('Task');
    const tasksDelete = tasks.filter((task) => task.id !== parseInt(taskID));
    console.log(taskID);
    const taskDeletePending = taskPending.filter(
      (task) => task.id !== parseInt(taskID)
    );
    console.log(taskDeletePending);
    setTaskPending(taskDeletePending);
    setTasks(tasksDelete);
  };
  const handleDropPending = (evt) => {
    const taskID = evt.dataTransfer.getData('Task');
    const tasksAdd = tasks.filter((task) => task.id === parseInt(taskID));
    const tasksDelete = tasks.filter((task) => task.id !== parseInt(taskID));
    setTasks(tasksDelete);
    setTaskPending([...taskPending, ...tasksAdd]);
  };
  const handleDropCompleted = (evt) => {
    const taskID = evt.dataTransfer.getData('Task');
    const tasksAdd = taskPending.filter((task) => task.id === parseInt(taskID));
    const tasksDelete = taskPending.filter(
      (task) => task.id !== parseInt(taskID)
    );
    setTaskCompleted([...taskCompleted, ...tasksAdd]);
    setTaskPending(tasksDelete);
  };
  const handleNewNote = (evt) => {
    const { value } = evt.target;
    setNewNotes(value);
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newId = Math.max(...tasks.map((task) => task.id)) + 1;
    const newIdPending = Math.max(...taskPending.map((task) => task.id)) + 1;
    const newNote = {
      id: newId === -Infinity ? newIdPending : newId,
      task: newNotes,
    };
    setTasks([...tasks, newNote]);
    setNewNotes('');
  };
  return (
    <div className='app'>
      <form className='app__form' onSubmit={handleSubmit}>
        <input
          className='app__input'
          placeholder='Add new note'
          type='text'
          value={newNotes}
          onChange={handleNewNote}
        />
        <button className='app__button'>Add Note</button>
      </form>
      <div className='app__container'>
        <div className='app__div'>
          <h1 className='app__h1'>Task</h1>
          <div className='app__tasklist'>
            {tasks?.map((task, index) => (
              <div
                key={task.id}
                id={task.id}
                className='app__task'
                draggable
                onDragStart={(evt) => handleTaskMoveStart(evt, index)}
                onDragOver={handleOver}
                onDragEnd={handleTaskDrop}
                onDragEnter={(evt) => handleTaskEnter(evt, index)}
              >
                {task.task}
              </div>
            ))}
          </div>
        </div>
        <div className='app__div'>
          <h1 className='app__h1'>Pending</h1>
          <div
            className='app__tasklist'
            onDragOver={handleOver}
            onDrop={handleDropPending}
          >
            {taskPending?.map((task, index) => (
              <div
                draggable
                onDragOver={handleOver}
                onDragStart={(evt) => handleTaskMoveStart(evt, index)}
                key={task.id}
                id={task.id}
                className='app__task'
              >
                {task.task}
              </div>
            ))}
          </div>
        </div>
        <div className='app__div'>
          <h1 className='app__h1'>Completed</h1>

          <div
            className='app__tasklist'
            onDragOver={handleOver}
            onDrop={(evt) => {
              handleDropCompleted(evt);
              console.log(evt.dataTransfer.getData('Task'));
            }}
          >
            {taskCompleted?.map((task) => (
              <div className='app__task'>{task.task}</div>
            ))}
          </div>
        </div>
      </div>
      <div onDragOver={handleOver} onDrop={handleDropTask}>
        <i className='app__icon'>{iconDelete}</i>
      </div>
    </div>
  );
};

export default App;
