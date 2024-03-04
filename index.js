import {
  appThemetoggleElement,
  bodyElement,
  appThemetoggleElementImage,
  addTaskButton,
  inputElement,
  taskListElement,
  getDeleteElements,
  getListItemElements,
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
  initTaskList(tasks);
};

// RenderTaskList
const renderTaskList = (tasks) => {
  let taskList = '';
  tasks.forEach((item) => {
    taskList += `
    <li class="${item.isCompleted ? "List__isCompleted" : "List__isActive"}">
          <label class="list-item">
            <input class="checkbox" type="checkbox"/>
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
  const listElements = getListItemElements();

  deleteElements.forEach((element, index) => {
    element.addEventListener('click', () => deleteTask(index));
  });

  listElements.forEach((element, index) => {
    element.addEventListener('click', (event) => toggleCompletdTask(event, index));
  });
};
/* eslint-enable */

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
  /* eslint-disable */
  initTaskList(tasks);
};

// DarkTheme
const toggleDarkMode = () => {
  // Store the old and new image sources
  const oldSrc = 'images/icon-moon.svg';
  const newSrc = 'images/icon-sun.svg';
  let isDarkMode = false;

  // Check if dark mode flag exists in local storage
  if (fetchData('darkModeFlag')) {
    isDarkMode = true;
    // Toggle the 'App--isDark' class
    bodyElement.classList.add('App--isDark');
  }

  appThemetoggleElement.addEventListener('click', () => {
    isDarkMode = !isDarkMode;

    // Toggle the 'App--isDark' class
    bodyElement.classList.toggle('App--isDark');
    saveToDB('darkModeFlag', bodyElement?.classList.contains('App--isDark'));
    // Update the image source based on the isDarkMode flag
    if (isDarkMode) {
      appThemetoggleElementImage.setAttribute('src', newSrc);
    } else {
      appThemetoggleElementImage.setAttribute('src', oldSrc);
    }
  });
};

// ToggleCompletedTask
const toggleCompletdTask = (event, index) => {
  const tasks = fetchData('tasks');

  event.currentTarget.parentElement.classList.toggle('List__isCompleted');
  tasks[index].isCompleted = !tasks[index].isCompleted;
  saveToDB('tasks', tasks);
}

// RenderEmptyState Function
const renderEmptyState = () => {
  taskListElement.innerHTML = `
  <p class="emptyState">
  List is currently empty.</p>
  `;
};

addTaskButton.addEventListener('click', addTask);
/* eslint-disable */
const initDataOnStartup = () => {
  fetchData('darkModeFlag') ? toggleDarkMode() : toggleDarkMode(); 
  initTaskList(fetchData('tasks'));
};

const initTaskList = (tasks) => {
  if (tasks?.length) {  
    renderTaskList(fetchData('tasks'))
    initTaskListeners();
  } else {
    renderEmptyState();
  }
};

initDataOnStartup();
