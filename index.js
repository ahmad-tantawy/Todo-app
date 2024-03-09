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
  clearButtonElement,
  filterButtonElements,
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
const deleteTask = (index, element) => {
  element.parentElement.classList.add('deleted')
  setTimeout(() => {
    const tasks = fetchData('tasks');
    tasks.splice(index, 1);
    saveToDB('tasks', tasks);
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

// FilterListElement
const filterTasks = (button) => {
  const tasks = fetchData('tasks') || [];
  if (tasks.length === 0) return;
  
  let newTasks = [];
  if (button == 'Completed') {
    newTasks = tasks.filter((task) => task.isCompleted);
  } else if (button == 'Active') {
    newTasks = tasks.filter((task) => !task.isCompleted);
  } else if (button == 'Clear Completed') {
    deleteCompletedTasks();
    return;
  } else {
    newTasks = tasks;
  }
  initTaskList(newTasks);
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

// InitTaskListeners Function
const initTaskListeners = () => {
  const deleteElements = getDeleteElements();
  const listElements = getListItemElements();

  deleteElements.forEach((element, index) => {
    element.addEventListener('click', () => deleteTask(index, element));
  });

  listElements.forEach((element, index) => {
    element.addEventListener('click', (event) => toggleCompletdTask(event, index));
  });

  clearButtonElement.addEventListener('click', deleteCompletedTasks);
  
  filterButtonElements.forEach((button) => {
    button.addEventListener('click', () => filterTasks(button.innerHTML));
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
/* eslint-disable */
const initDataOnStartup = () => {
  fetchData('darkModeFlag') ? toggleDarkMode() : toggleDarkMode();
  initTaskList(fetchData('tasks'));
};
// /* eslint-enable */

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

initDragAndDrop();

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
