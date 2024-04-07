// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = parseInt(localStorage.getItem("nextId")) || null;
let taskForm = $("#taskForm");
let taskTitle = $("#taskTitle");
let taskDescription = $("#taskDescription");
let dueDate = $("#dueDate");

// Todo: create a function to generate a unique task id 
function generateTaskId() {
   if (nextId === null) {
    nextId = 1
   } else {
     nextId++
   }
   localStorage.setItem("nextId", nextId);
   return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    console.log(task);
    const taskCard = $('<div>')
    .addClass('card project-card draggable my-3')
    .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text ('Delete')
    .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);
    
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = readTasksFromStorage();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const todoList = $('#todo-cards');
    todoList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        if (task.status === 'to-do') {
          todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
          inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
          doneList.append(createTaskCard(task));
        }
      }
      $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable')
        return original.clone().css({
            maxWidth: original.outerWidth(),
          });
        },
      });
}
function readTasksFromStorage () {
    return taskList;
}
function saveTasksToStorage (tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
//     const taskTitle = taskTitleInputEl.val().trim();
//   const taskDescription = taskDescriptionInputEl.val();
//   const taskDate = taskDateInputEl.val();

  const newTask = {
    title: taskTitle.val(),
    description: taskDescription.val(),
    dueDate: dueDate.val(),
    status: 'to-do',
    id: generateTaskId()
};
const tasks = readTasksFromStorage();
tasks.push(newTask);

saveTasksToStorage(tasks);

renderTaskList();

taskTitle.val('');
taskDescription.val('');
dueDate.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    const thisTaskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();

    for (let i=0; i < tasks.length; i++) {
        if (tasks[i].id === thisTaskId) {
            tasks.splice(tasks.indexOf(tasks[i]),1);
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;
    console.log(taskcard);

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    for (let task of taskList) {
        console.log(task.id,taskId);
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(taskList));
    printProjectData();
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
taskForm.on('submit', handleAddTask);

// nextId.on('click', '.btn-delete-task', handleDeleteTask)

$(document).ready(function () {
    // datepicker
    renderTaskList();
$('#duedate').datepicker({
    changeMonth: true,
    changeYear: true,
});
// make lanes droppable
$('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
});
});

