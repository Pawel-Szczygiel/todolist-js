const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const groceryList = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

let editElement;
let editFlag = false;
let editId = '';

const createListItems = (id,value) => {
  const article = document.createElement('article');
    article.classList.add('grocery-item');
    article.setAttribute('data-id',id);
    article.innerHTML = `
      <p class="title">${value}</p>
      <div class="btn-container">
        <button type="button" class="edit-btn">
          <i class="fas fa-edit"></i>
        </button> 
        <button type="button" class="delete-btn">
          <i class="fas fa-trash"></i>
        </button> 
      </div>
      `;
    const deleteBtn = article.querySelector('.delete-btn');
    const editBtn = article.querySelector('.edit-btn');
    deleteBtn.addEventListener('click',deleteItem);
    editBtn.addEventListener('click',editItem);
    groceryList.appendChild(article);
    groceryList.classList.add('show-container');
    clearBtn.classList.add('show-container');
}

const setupItems = () => {
  let items = getLocalStorage();
  if(items.length > 0) items.forEach(item => createListItems(item.id,item.value));
}

const displayAlert = (text,action) => { 
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  
  setTimeout(() => {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 2000)
  
} 

const addToLocalStorage = (id,value) => {
  const grocery = {id,value};
  let items = getLocalStorage();
  items.push(grocery)
  localStorage.setItem('list',JSON.stringify(items));
}

const removeFromLocalStorage = id => {
  let items = getLocalStorage();
  items = items.filter(grocery => grocery.id !== id);
  localStorage.setItem('list',JSON.stringify(items));
}

const editLocalStorage = (id,value) => {
  let items = getLocalStorage();
  items = items.map(item => item.id === id ? {...item, value} : item);
  localStorage.setItem('list',JSON.stringify(items));
}

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem('list')) || [];
}

const setBackToDefault = () =>  {
  grocery.value = '';
  editFlag = false;
  editId = '';
  submitBtn.textContent = 'submit';
}

const clearItems = () => {
  groceryList.classList.remove('show-container');
  clearBtn.classList.remove('show-container');
  groceryList.innerHTML = '';
  displayAlert('empty list', 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
}

const deleteItem = e => {
  const element = e.currentTarget.closest('.grocery-item');
  groceryList.removeChild(element);
  
  if (groceryList.children.length === 0) {
      clearBtn.classList.remove('show-container');
      groceryList.classList.remove('show-container');
      localStorage.removeItem('list');
  }
  displayAlert('item removed', 'danger');
  setBackToDefault();
  const id = element.dataset.id;
  removeFromLocalStorage(id);
}

const editItem = e => {
  const element = e.currentTarget.closest('.grocery-item');
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.textContent;
  submitBtn.textContent = 'edit';
  editFlag = true;
  editId = element.dataset.id;
}

const addItem = e => { 
  e.preventDefault();
  const value = grocery.value; 
  let id = null;
  if (value && !editFlag) id = new Date().getTime().toString();

  if(value && !editFlag) {
    createListItems(id,value);
    displayAlert('item added to the list','success');
    addToLocalStorage(id,value);
    setBackToDefault();
  }

  if(value && editFlag) {
    editElement.textContent = value;
    displayAlert('editing item','success');
    editLocalStorage(editId,value);
    setBackToDefault();
  } 

  if(!value) displayAlert('please enter value','danger');
}



form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);