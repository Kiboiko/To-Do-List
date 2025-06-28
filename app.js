document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    loadTasks();

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    function createTaskElement(taskText, isCompleted = false,deadline = null) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const progr = document.createElement('div');
        progr.className = 'task-content';
        progr.style.opacity = '0';

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

        if (deadline) {
            dateInput.value = deadline;
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
        taskItem.appendChild(dateInput);
        taskItem.appendChild(progr);
        
        checkbox.addEventListener('change', toggleTask);
        deleteBtn.addEventListener('click', deleteTask);
        dateInput.addEventListener('change', function() {
            updateTaskProgress();
            saveTasks();
        });
        
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
        taskItem.classList.add('removing');
        setTimeout(() => {
            taskItem.remove();
            saveTasks();
        }, 400);
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
                    const taskItem = createTaskElement(task.text, task.completed,task.deadline);
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
                taskContent.style.width = '0%';
                taskContent.style.backgroundPosition = 'left';
                return;
            } 
            taskContent.style.opacity = '1';
            const deadline = new Date(dateInput.value);
            const timeDiff = deadline - now;
            
            if (timeDiff <= 0) {
                taskContent.style.width = '0%';
                return;
            }
            
            const maxPeriod = 30 * 24 * 60 * 60 * 1000; // 30 дней
            const progress = Math.min(timeDiff, maxPeriod) / maxPeriod;
            const widthPercentage = Math.max(1, Math.min(100, progress * 100));
            
            const gradientPosition = 100 - widthPercentage;
            
            taskContent.style.width = `${widthPercentage}%`;
            taskContent.style.backgroundPosition = `${gradientPosition}% 0`;
        });
        }

        updateTaskProgress();

        setInterval(updateTaskProgress, 1000);

    
});