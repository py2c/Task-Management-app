<template>
    <form>
        <div class="form-container">
            <div>
                <label>Project Name</label>
                <input v-model="project.name" type="text" name="name" />
            </div>
            <div>
                <label>Description</label>
                <textarea v-model="project.description" name="description"></textarea>
            </div>
            <div>
                <label>Repo</label>
                <input v-model="project.repository" type="text" name="repo" />
            </div>
            <div>
                <label>Manager</label>
                <select v-model="selected_manager">
                    <option v-for="manager in available_users" :value="manager._id"
                        :selected="(selected_manager === manager._id)">{{ manager.name }}</option>
                </select>
            </div>
            <div v-if="(project._id && available_users)">
                <label>Users</label>
                <select multiple v-model="selected_users">
                    <option v-for="user in available_users" :value="user._id">{{ user.name }}</option>
                </select>
            </div>
            <div>
                <input v-if="project._id" type="button" @click="updateProject" value="Edit Project">
                <input v-else type="button" @click="addProject" value="Add">
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'ProjectForm',
    props: {
        project: Object,
        available_users: Array
    },
    data() {
        return {
            selected_manager: '',
            selected_users: []
        }
    },
    methods: {

        async updateProject() {
            // our GET by :id uses populate to populate all the tasks
            // remove tasks before crafting data object
            delete this.project.tasks

            // create a data object just like in addProject
            const data = {
                ...this.project,
                manager: this.selected_manager,
                users: this.selected_users
            }

            // view this console.log in your browser
            console.log(JSON.stringify(data))
        }
    },
    async created() {
        if (this.project._id) {
            this.selected_manager = this.project.manager._id
        }
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
    margin: 10px 0;
    padding: 10px 10px;
    width: 95%;
    border: 1px solid #333;
    border-radius: 5px;
    display: block;
}

input[type="checkbox"] {
    height: 25px;
    width: 25px;
    accent-color: #000;
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