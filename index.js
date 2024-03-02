import {
  appThemetoggleElement,
  bodyElement,
  appThemetoggleElementImage,
  addTaskButton,
  inputElement,
  taskListElement,
  getDeleteElements,
} from './scripts/elements';

// fetchData
const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
};

// SaveToDB
const saveToDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/* eslint-disable */
// DeleteTask
const deleteTask = (index) => {
  const answer = confirm('Are you sure you want to delete?');
  if (answer === false) return;

  const tasks = fetchData('tasks');
  tasks.splice(index, 1);

  saveToDB('tasks', tasks);
  renderTaskList(tasks);
  initTaskListeners();
};
/* eslint-enable */

// RenderTaskList
const renderTaskList = (tasks) => {
  let taskList = '';
  tasks.forEach((item) => {
    const checkedAttribute = item.isCompleted ? 'checked' : '';

    taskList += `
    <li>
        <label class="list-item">
          <input class="checkbox" type="checkbox" ${checkedAttribute}/>
          <span class="todo-text">${item.value}</span>
          </label>
          <span class="remove"></span>
    </li>`;
  });
  taskListElement.innerHTML = taskList;
  inputElement.value = '';
};

// InitTaskListeners Function
const initTaskListeners = () => {
  const deleteElements = getDeleteElements();

  deleteElements.forEach((element, index) => {
    element.addEventListener('click', () => deleteTask(index));
  });
};

// AddTask Function
const addTask = (event) => {
  event.preventDefault();
  const taskValue = inputElement.value;

  if (!taskValue) return;

  const task = {
    value: taskValue,
    isCompleted: false,
  };

  const tasks = fetchData('tasks') || [];
  tasks.push(task);
  saveToDB('tasks', tasks);

  renderTaskList(tasks);
  initTaskListeners();
};

// DarkTheme
// Store the old and new image sources
const oldSrc = 'images/icon-moon.svg';
const newSrc = 'images/icon-sun.svg';
let isDarkMode = false;

appThemetoggleElement.addEventListener('click', () => {
  isDarkMode = !isDarkMode;

  // Toggle the 'App--isDark' class
  bodyElement.classList.toggle('App--isDark');
  // Update the image source based on the isDarkMode flag
  if (isDarkMode) {
    appThemetoggleElementImage.setAttribute('src', newSrc);
  } else {
    appThemetoggleElementImage.setAttribute('src', oldSrc);
  }
});

addTaskButton.addEventListener('click', addTask);
