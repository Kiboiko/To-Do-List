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

    function createTaskElement(taskText, isCompleted = false) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const progr = document.createElement('div');
        progr.className = 'task-content';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = isCompleted;
        if (isCompleted) {
            taskItem.classList.add('completed');
        }

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'task-dateBox';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = taskText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(textSpan);
        taskItem.appendChild(deleteBtn);
        taskItem.appendChild(dateInput);
        taskItem.appendChild(progr);
        
        checkbox.addEventListener('change', toggleTask);
        deleteBtn.addEventListener('click', deleteTask);
        
        return taskItem;
    }

    function addTask(taskText) {
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        saveTasks();
    }

    function toggleTask(e) {
        const taskItem = e.target.closest('.task-item');
        taskItem.classList.toggle('completed');
        saveTasks();
    }
    
    function deleteTask(e) {
        const taskItem = e.target.closest('.task-item');
        taskItem.remove();
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('.task-text').textContent,
                completed: taskItem.querySelector('.task-checkbox').checked,
                deadline: taskItem.querySelector('.task-dateBox').value
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

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

    function updateTaskProgress() {
        const now = new Date();
        
        document.querySelectorAll('.task-item').forEach(taskItem => {
            const dateInput = taskItem.querySelector('.task-dateBox');
            const taskContent = taskItem.querySelector('.task-content');
            
            if (!dateInput.value) {
            taskContent.style.width = '100%';
            return;
            }
            
            const deadline = new Date(dateInput.value);
            const timeDiff = deadline - now;
            
            if (timeDiff <= 0) {
            // Дедлайн прошел
            taskContent.style.width = '0%';
            return;
            }
            
            // Максимальный период для прогресса (например, 30 дней)
            const maxPeriod = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах
            const initialWidth = 100; // Начальная ширина 100%
            
            // Вычисляем прогресс (но не больше максимального периода)
            const progress = Math.min(timeDiff, maxPeriod) / maxPeriod;
            const width = Math.max(0, Math.min(100, progress * 100));
            
            taskContent.style.width = `${width}%`;
            
            // Обновляем цвет в зависимости от прогресса
            updateTaskColor({target: dateInput});
        });
    }

    updateTaskProgress();

    setInterval(updateTaskProgress, 1000);

    function updateTaskColor(e) {
        const taskItem = e.target.closest('.task-item');
        const taskContent = taskItem.querySelector('.task-content');
        const deadline = e.target.value;
        
        if (!deadline) {
            taskContent.style.backgroundColor = '#45a049';
            return;
        }
        
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const timeDiff = deadlineDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 7) {
            taskContent.style.backgroundColor = '#4CAF50';
        } else if (daysDiff > 3) {
            taskContent.style.backgroundColor = '#FFC107';
        } else if (daysDiff >= 0) {
            taskContent.style.backgroundColor = '#F44336'; 
        } else {
            taskContent.style.backgroundColor = '#9E9E9E';
        }
    }




});