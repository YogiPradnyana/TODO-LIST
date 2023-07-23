const todoInput = document.querySelector('.todo-input input');
const todoBox = document.querySelector('.todo-box');
const filters = document.querySelectorAll('.filters span');
const clearAll = document.querySelector('.btn-clear');

let todos = JSON.parse(localStorage.getItem('todo-list'));

let editId;
let isEditTodo = false;

function showTodo(filter) {
  let li = '';
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == 'completed' ? 'checked' : '';
      if (filter == todo.status || filter == 'all') {
        li += ` <li class="todo">
                <label for="${id}">
                  <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}/>
                  <p class="${isCompleted}">${todo.name}</p>
                </label>
                <div class="settings">
                  <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                  <ul class="todo-menu">
                    <li onclick="editTodo(${id}, '${todo.name}')"><i class="icon fa-regular fa-pen-to-square"></i>Edit</li>
                    <li onclick="deleteTodo(${id})"><i class="icon fa-regular fa-trash-can"></i>Delete</li>
                  </ul>
                </div>
              </li>`;
      }
    });
  }
  todoBox.innerHTML = li || `<span>Kamu tidak punya tugas sekarang</span>`;
}

showTodo('all');

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector('span.active').classList.remove('active');
    btn.classList.add('active');
    showTodo(btn.id);
  });
});

function editTodo(todoId, todoName) {
  editId = todoId;
  isEditTodo = true;
  todoInput.value = todoName;
}

clearAll.addEventListener('click', () => {
  todos.splice(0, todos.length);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo('all');
});

function deleteTodo(deletedId) {
  todos.splice(deletedId, 1);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo('all');
}

function showMenu(SelectedTask) {
  let taskName = SelectedTask.parentElement.lastElementChild;
  taskName.classList.add('show');
  document.addEventListener('click', (e) => {
    if (e.target.tagName != 'I' || e.target != SelectedTask) {
      taskName.classList.remove('show');
    }
  });
}

// Update SelectedTask
function updateStatus(SelectedTask) {
  let taskName = SelectedTask.parentElement.lastElementChild;
  if (SelectedTask.checked) {
    taskName.classList.add('checked');
    todos[SelectedTask.id].status = 'completed';
  } else {
    taskName.classList.remove('checked');
    todos[SelectedTask.id].status = 'pending';
  }
  localStorage.setItem('todo-list', JSON.stringify(todos));
}

todoInput.addEventListener('keyup', (e) => {
  let userTodo = todoInput.value.trim();
  if (e.key == 'Enter' && userTodo) {
    if (!isEditTodo) {
      if (!todos) {
        todos = [];
      }
      let todoInfo = { name: userTodo, status: 'pending' };
      todos.push(todoInfo);
    } else {
      isEditTodo = false;
      todos[editId].name = userTodo;
    }

    todoInput.value = '';
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo('all');
  }
});
