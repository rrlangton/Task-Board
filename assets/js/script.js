// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const newTask = {
    title: taskTitle,
    description: taskDescription,
    dueDate: taskDate,
    status: 'to-do'
    }
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card project-card draggable my-3')
    .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
    const cardBody = $('<div>').addClass('card-body');
    const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text ('Delete')
    .attr('data-project-id', project.id);
    cardDeleteBtn.on('click', handleDeleteProject);
    
    cardBody.append(cardDescription, cardDeleteBtn);
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
            width: original.outerWidth(),
          });
        },
      });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const taskTitle = taskTitleInputEl.val().trim();
  const taskDescription = taskDescriptionInputEl.val();
  const taskDate = taskDateInputEl.val();

  const newTask = {
    title: taskTitle,
    description: taskDescription,
    dueDate: taskDate,
    status: 'to-do'
};
const tasks = readTasksFromStorage();
tasks.push(newTask);

saveTasksToStorage(tasks);

printTaskData();

taskTitleInputEl.val('');
taskDescriptionInput.val('');
taskDateInput.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    const thisTaskId = $(this).attr('data-task-id');
    const tasks = readStoredTasks();

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
    const taskcard = readTaskcardFromStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;

    for (let task of taskcard) {
        if (taskcard.id === taskId) {
            taskcard.status = newStatus;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    printProjectData();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
taskListEl.on('addTask', handletaskListaddTask);

nextIdEl.on('click', '.btn-delete-task', handleDeleteTask)

$(document).ready(function () {
    // datepicker
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

