document.addEventListener('DOMContentLoaded', () => {
    // DOM Element 
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskCategoryInput = document.getElementById('task-category');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskDisplayArea = document.getElementById('task-display-area');
    const filterStatus = document.getElementById('filter-status');
    const themeToggle = document.getElementById('theme-toggle');

    // function myFunction() {
    //             document.getElementById("btn1").style.color = "red";
    //             }
    // Modal elements
    const editModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    const editForm = document.getElementById('edit-task-form');
    const editTaskId = document.getElementById('edit-task-id');
    const editTaskTitle = document.getElementById('edit-task-title');
    const editTaskCategory = document.getElementById('edit-task-category');
    const editTaskDueDate = document.getElementById('edit-task-due-date');
    const saveEditBtn = document.getElementById('save-edit-btn');

    // Load tasks from LOCAL STORAGE or initialize as an EMPTY ARRAY
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

                                                    // THEME TOGGLE 
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.checked = theme === 'dark';
    };

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
    });

                                                    // --- TASK MANAGEMENT ---
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
                                                    // FILTER
    const renderTasks = () => {
        taskDisplayArea.innerHTML = ''; 
        const filterValue = filterStatus.value;
        const filteredTasks = tasks.filter(task => {
            if (filterValue === 'completed') return task.completed;
            if (filterValue === 'pending') return !task.completed;
            return true; // 'all'
        });


        if (filteredTasks.length === 0) {
            taskDisplayArea.innerHTML = `<p class="text-center text-muted">No tasks to display. Add one above!</p>`;
            return;
        }
                                                    // FILTER FOR STATUS
        filteredTasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-6 col-lg-4';
            taskCard.dataset.id = task.id;

            const isCompleted = task.completed;
            const cardBorder = isCompleted ? 'border-success' : 'border-secondary';
            const completedBadge = isCompleted ? '<span class="badge bg-success">Completed</span>' : '';
            const completeButtonText = isCompleted ? 'Mark as Pending' : 'Mark as Complete';
            const completeButtonClass = isCompleted ? 'btn-outline-warning' : 'btn-outline-success';

            taskCard.innerHTML = `
                <div class="card task-card ${isCompleted ? 'completed' : ''} ${cardBorder} h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${task.title} ${completedBadge}</h5>
                        <p class="card-text">
                            <strong>Category:</strong> <span class="badge bg-primary">${task.category}</span><br>
                            <strong>Due:</strong> ${task.dueDate}
                        </p>
                        <div class="mt-auto d-flex gap-2">
                            <button class="btn ${completeButtonClass} btn-sm flex-grow-1" data-action="complete">${completeButtonText}</button>
                            <button class="btn btn-outline-info btn-sm" data-action="edit">Edit</button>
                            <button class="btn btn-outline-danger btn-sm" data-action="delete">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            taskDisplayArea.appendChild(taskCard);
        });
    };

    const addTask = (e) => {
        e.preventDefault();

        const newTask = {
            id: Date.now(), 
            title: taskTitleInput.value.trim(),
            category: taskCategoryInput.value.trim(),
            dueDate: taskDueDateInput.value,
            completed: false,
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
    };
    
    const handleTaskActions = (e) => {
        const cardElement = e.target.closest('.col-md-6');
        if (!cardElement) return;

        const taskId = Number(cardElement.dataset.id);
        const action = e.target.dataset.action;
        
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
                                    // CARD FUNCTIONS
        switch (action) {
            case 'delete':
                cardElement.querySelector('.task-card').classList.add('deleting');
                
                setTimeout(() => {
                    tasks = tasks.filter(t => t.id !== taskId);
                    saveTasks();
                    renderTasks();
                }, 500);
                break;
            
            case 'complete':
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
                break;
            
            case 'edit':
                // current task data in modal
                editTaskId.value = task.id;
                editTaskTitle.value = task.title;
                editTaskCategory.value = task.category;
                editTaskDueDate.value = task.dueDate;
                editModal.show();
                break;
        }
    };
    
    const updateTask = () => {
        const taskId = Number(editTaskId.value);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            task.title = editTaskTitle.value.trim();
            task.category = editTaskCategory.value.trim();
            task.dueDate = editTaskDueDate.value;
            saveTasks();
            renderTasks();
            editModal.hide();
        }
    };
    

                                         //  EVENT LISTENERS 
    taskForm.addEventListener('submit', addTask);
    taskDisplayArea.addEventListener('click', handleTaskActions);
    filterStatus.addEventListener('change', renderTasks);
    saveEditBtn.addEventListener('click', updateTask);


    // --- INITIALIZATION ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    renderTasks(); 
});