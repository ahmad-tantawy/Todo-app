import {
  appThemetoggleElement, bodyElement, appThemetoggleElementImage, addTaskButton,
} from './scripts/elements';

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

// SaveToDB
const saveToDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// fetchData
// const fetchData = (key) => {
//   const data = localStorage.getItem(key);
//   return data ? JSON.parse(data) : false;
// };

// AddTask Function
const addTask = (event) => {
  event.preventDefault();
  const inputElement = document.querySelector('.app__search-bar__input');
  const taskValue = inputElement.value;

  if (!taskValue) return;

  saveToDB('tasks', taskValue);
  const taskListElement = document.querySelector('.app__task-list__list');
  taskListElement.innerHTML += `<li>
      <label class="list-item">
         <input class="checkbox" type="checkbox" />
         <span class="todo-text">${taskValue}</span>
      </label>
      <span class="remove"></span>
  </li>`;
  inputElement.value = '';
};

addTaskButton.addEventListener('click', addTask);

/**
 * DarkTheme
 * Tasks
    _saveToDB
    _initDataonStartup
    _renderTaskList
    _addTask
    _deleteTask
    _toggleTask
    _toggleCompletedTask
 */
