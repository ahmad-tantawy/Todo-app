/* eslint-disable */
import {
  appThemetoggleElement,
  bodyElement,
  appThemetoggleElementImage,
  addTaskButton,
  inputElement,
  taskListElement,
  getDeleteElements,
  getListItemElements,
  itemsLeftElement,
  allButtonElement,
  activeButtonElement,
  completedButtonElement,
  clearButtonElement,
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

// DeleteTask
const deleteTask = (event) => {
  const tasks = fetchData('tasks');
  const taskValue = event.target.closest('li').querySelector('.todo-text').textContent;

  tasks.splice(tasks.findIndex((task) => task.value === taskValue), 1);
  saveToDB('tasks', tasks);

  event.target.closest('li').classList.add('deleted');
  setTimeout(() => {
    initTaskList(tasks);
  }, 400);
};

// DeleteCompletedTask
const deleteCompletedTasks = () => {
  const tasks = fetchData('tasks') || [];
  const newTasks = tasks.filter((task) => !task.isCompleted);
  saveToDB('tasks', newTasks);
  initTaskList(fetchData('tasks'));
};

// All list Element Filter function
const filterAllElements = () => {
  const tasks = fetchData('tasks') || [];
  initTaskList(tasks);
};

// Active button Filter function
const filterActiveElements = () => {
  const tasks = fetchData('tasks') || [];
  const newTasks = tasks.filter((task) => !task.isCompleted);
  initTaskList(newTasks);
  countItemLeft();
};

// Completed button Filter function
const filterCompletedElements = () => {
  const tasks = fetchData('tasks') || [];
  const newTasks = tasks.filter((task) => task.isCompleted);
  initTaskList(newTasks);
  countItemLeft();
};

// RenderTaskList
const renderTaskList = (tasks) => {
  let taskList = '';
  tasks.forEach((item) => {
    taskList += `
    <li class="draggable ${item.isCompleted ? 'List__isCompleted' : 'List__isActive'}" draggable="true">
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

// Button Listener
const initButtonsListeners = () => {
  clearButtonElement.addEventListener('click', deleteCompletedTasks);
  allButtonElement.addEventListener('click', filterAllElements);
  activeButtonElement.addEventListener('click', filterActiveElements);
  completedButtonElement.addEventListener('click', filterCompletedElements);
};

// InitTaskListeners Function
const initTaskListeners = () => {
  const deleteElements = getDeleteElements();
  const listElements = getListItemElements();

  deleteElements.forEach((element) => {
    element.addEventListener('click', (event) => deleteTask(event));
  });

  listElements.forEach((element) => {
    element.addEventListener('click', (event) => toggleCompletedTask(event));
  });

  initButtonsListeners();
};

// Order ids to match array order
function orderTaskIds() {
  const tasks = fetchData('tasks') || [];

  tasks.forEach((task, index) => {
    task.id = index;
  });
  saveToDB('tasks', tasks);
}

// AddTask Function
const addTask = (event) => {
  event.preventDefault();
  const taskValue = inputElement.value;

  if (!taskValue) return;

  const task = {
    id: 0,
    value: taskValue,
    isCompleted: false,
  };

  const tasks = fetchData('tasks') || [];
  tasks.push(task);
  saveToDB('tasks', tasks);
  orderTaskIds();
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

const toggleCompletedTask = (event) => {
  const tasks = fetchData('tasks');
  const taskValue = event.target.nextElementSibling.textContent;
  const taskIndex = tasks.findIndex((task) => task.value === taskValue);

  tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;
  event.currentTarget.parentElement.classList.toggle('List__isCompleted');
  saveToDB('tasks', tasks);
};

// RenderEmptyState Function
const renderEmptyState = () => {
  taskListElement.innerHTML = `
  <p class="emptyState">
  List is currently empty.</p>
  `;
  countItemLeft();
};

// CountItmesLeft
const countItemLeft = () => {
  itemsLeftElement.innerHTML = taskListElement.querySelectorAll('li').length;
};

addTaskButton.addEventListener('click', addTask);
const initDataOnStartup = () => {
  fetchData('darkModeFlag') ? toggleDarkMode() : toggleDarkMode();
  initTaskList(fetchData('tasks'));
};

// Function to initialize drag and drop functionality
const initDragAndDrop = () => {
  let draggingElement;

  taskListElement.addEventListener('dragstart', (event) => {
    draggingElement = event.target.closest('.draggable');
    if (draggingElement) {
      draggingElement.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggingElement.innerHTML);
    }
  });

  taskListElement.addEventListener('dragend', (event) => {
    if (draggingElement) {
      draggingElement.classList.remove('dragging');
      draggingElement = null;
    }
  });

  taskListElement.addEventListener('dragover', (event) => {
    event.preventDefault();
    const target = event.target.closest('.draggable');
    if (draggingElement && target && draggingElement !== target) {
      const bounding = target.getBoundingClientRect();
      const offset = bounding.y + bounding.height / 2;
      if (event.clientY < offset) {
        taskListElement.insertBefore(draggingElement, target);
      } else {
        taskListElement.insertBefore(draggingElement, target.nextSibling);
      }
    }
  });
};

// InitTaskList Function
const initTaskList = (tasks) => {
  const data = tasks || fetchData('tasks') || []; // Use provided tasks. Otherwise, try to fetch tasks from the database
  if (data.length) {
    renderTaskList(data);
    initTaskListeners();
    countItemLeft();
  } else {
    renderEmptyState();
  }
};

initDataOnStartup();
initDragAndDrop();
