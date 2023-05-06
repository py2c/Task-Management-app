<template>
    <form>
        <div class="form-container">
            <div>
                <label>Task Name</label>
                <input type="text" v-model="task.name" name="name" />
            </div>
            <div>
                <label>Details</label>
                <textarea v-model="task.details" name="description"></textarea>
            </div>
            <div>
                <div class="left">
                    <label>Assigned</label>
                    <input type="text" v-model="task.timeline.assigned" name="assigned" />

                    <label>Due</label>
                    <input type="text" v-model="task.timeline.due" name="due" />
                </div>
            </div>
            <div>
                <label>Status</label>
                <select v-model="selected_status">
                    <option v-for="status in statuses" :value="status">
                        {{ status }}
                    </option>
                </select>
            </div>
            <div>
                <label>Priority</label>
                <select v-model="selected_priority">
                    <option v-for="priority in priorities" :value="priority">
                        {{ priority }}
                    </option>
                </select>
            </div>
            <div>
                <label>User</label>
                <select v-model="selected_user">
                    <option v-for="user in available_users" :value="user._id">
                        {{ user.name }}
                    </option>
                </select>
            </div>
            <div>
                <label>Project</label>
                <input type="text" :value="project_name" readonly />
            </div>
            <div>
                <input type="button" v-if="task._id" @click="updateTask" value="Update Task" />
                <input type="button" v-else @click="addTask" value="Add Task" />
                <input type="button" @click="deleteTask(task._id)" value= "Delete"/>
                
            </div>
        </div>
    </form>
</template>

<script>


export default {
    name: 'TaskForm',
    props: {
        task: Object,
        available_users: Array,
        priorities: Array,
        statuses: Array,
        project_name: String
    },
    data() {
        return {
            selected_priority: '',
            selected_status: '',
            selected_user: '',
            tasks:[]
        }
    },
    methods: {
        addTask() {
            // create an object called data
            // spread the task data
            // the priority is stored in selected_priority and needs to be added
            // the status is stored in selected_status and needs to be added
            // the user are stored in selected_user and needs to be added
            const data = {
                ...this.task,
                priority: this.selected_priority,
                status: this.selected_status,
                user: this.selected_user
            }

            // view this console.log in your browser
            console.log(JSON.stringify(data))
        },
        updateTask() {
            // create a data object just like in addProject
            const data = {
                ...this.task,
                priority: this.selected_priority,
                status: this.selected_status,
                user: this.selected_user
            }

            // view this console.log in your browser
            console.log(JSON.stringify(data))
        },
        async deleteTask(_id) {
            await fetch(`http://localhost:8888/tasks/${_id}`, {
                method: 'DELETE',
                mode: 'cors'
            })
            

        },
        async refresh() {
            const res = await fetch(`http://localhost:8888/tasks/${_id}`)

            const body = await res.json()
            this.tasks = body
        },

    },
    
    async created() {
        this.selected_priority = this.task.priority
        this.selected_status = this.task.status
        this.selected_user = this.task.user
        this.refresh()
    }
}

</script>

<style>
.form-container {
    padding: 25px;
}

form {
    margin: 0px auto;
    width: 100%;
    height: auto;
    background: #FFF;
}

form label {
    font-size: 14px;
    color: #888;
    cursor: pointer;
}

form input,
form textarea,
form select {
    margin: 5px 0;
    padding: 8px;
    width: 95%;
    border: 1px solid #333;
    border-radius: 5px;
    display: block;
}

input[type="button"] {
    background: #2b2d42;
    border: 1px solid #000;
    color: #FFF;
    border-radius: 50px;
    cursor: pointer;
    font-size: 14px;
    display: inline;
    width: 33%;
    margin-right: 10px;
}

input[type="button"]:hover {
    background: #8d99ae;
    color: #111;
}
</style>