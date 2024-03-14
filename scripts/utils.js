/* eslint-disable */
import {
  inputElement,
  taskListElement,
  itemsLeftElement,
  allButtonElement,
  activeButtonElement,
  completedButtonElement,
  getCurrentListElements,
} from './elements';

// fetchData
export const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
};

// saveListElementsToLocalStorge
export const saveListElementsToLocalStorge = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// RenderTaskList
export const renderTaskList = (tasks) => {
  let taskList = '';
  tasks.forEach((item) => {
    taskList += `
      <li class="draggable ${item.isCompleted ? 'List__isCompleted' : 'List__isActive'}" draggable="true">
            <label class="list-item">
              <input class="checkbox" type="checkbox" name="todo-checkbox"/>
              <span class="todo-text">${item.value}</span>
            </label>
            <span class="remove"></span>
      </li>`;
  });
  taskListElement.innerHTML = taskList;
  inputElement.value = '';
};

// removeClassFromAllButtons Function
export const removeClassFromAllButtons = () => {
  allButtonElement.classList.remove('blue--button');
  activeButtonElement.classList.remove('blue--button');
  completedButtonElement.classList.remove('blue--button');
};

// convertNodeListToArrayOfObjects function
export const convertNodeListToArrayOfObjects = (nodeList) => Array.from(nodeList).map((node) => {
  const value = node.innerText;
  const isCompleted = node.classList.contains('List__isCompleted');
  return { value, isCompleted };
});

// IstaskValueValid Function
export const isTaskValueValid = (taskValue) => {
  const currentValue = getCurrentListElements();
  const currentValueArray = [...currentValue];

  if (currentValueArray.length === 0) return true;

  const isValueExists = currentValueArray.some((element) => {
    const value = element.textContent.trim();
    return value === taskValue;
  });

  if (isValueExists) {
    throw new Error(`'${taskValue}' is already in the list.`);
  }

  return true;
};

// ToggleCompletedTask Function
export const toggleCompletedTask = (element) => {
  const tasks = fetchData('tasks');
  const taskValue = element.querySelector('.todo-text').textContent;
  const taskIndex = tasks.findIndex((task) => task.value === taskValue);

  tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;
  element.parentElement.classList.toggle('List__isCompleted');
  saveListElementsToLocalStorge('tasks', tasks);
};

// RenderEmptyState Function
export const renderEmptyState = () => {
  taskListElement.innerHTML = `
    <p class="emptyState">
    List is currently empty.</p>
    `;
  countItemLeft();
};

// CountItmesLeft
export const countItemLeft = () => {
  itemsLeftElement.innerHTML = taskListElement.querySelectorAll('li').length;
};

// Initialization data for frontend mentor
export const initializeApp = () => {
  if (!localStorage.getItem('appInitialized')) {
    const data = [
      { value: 'Complete online JavaScript course', isCompleted: true },
      { value: 'Jog around the park 3x', isCompleted: false },
      { value: '10 minutes meditation', isCompleted: false },
      { value: 'Read for 1 hour', isCompleted: false },
      { value: 'Pick up groceries', isCompleted: false },
      { value: 'Complete Todo App on Frontend Mentor', isCompleted: false },
    ];
    localStorage.setItem('appInitialized', true);
    saveListElementsToLocalStorge('tasks', data);
  }
};
