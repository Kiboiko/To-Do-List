document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Загрузка задач при старте
    loadTasks();

    // Обработчик добавления задачи
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    // Функция добавления задачи (только создает элемент, не сохраняет)
    function createTaskElement(taskText, isCompleted = false) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = isCompleted;
        if (isCompleted) {
            taskItem.classList.add('completed');
        }
        
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = taskText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(textSpan);
        taskItem.appendChild(deleteBtn);
        
        checkbox.addEventListener('change', toggleTask);
        deleteBtn.addEventListener('click', deleteTask);
        
        return taskItem;
    }

    // Добавление новой задачи (с сохранением)
    function addTask(taskText) {
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        saveTasks();
    }

    // Переключение состояния задачи
    function toggleTask(e) {
        const taskItem = e.target.parentElement;
        taskItem.classList.toggle('completed');
        saveTasks();
    }
    
    // Удаление задачи
    function deleteTask(e) {
        const taskItem = e.target.parentElement;
        taskItem.remove();
        saveTasks();
    }

    // Сохранение задач
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('.task-text').textContent,
                completed: taskItem.querySelector('.task-checkbox').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Загрузка задач
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            try {
                const tasks = JSON.parse(savedTasks);
                tasks.forEach(task => {
                    const taskItem = createTaskElement(task.text, task.completed);
                    taskList.appendChild(taskItem);
                });
            } catch (e) {
                console.error('Ошибка загрузки задач:', e);
            }
        }
    }
});