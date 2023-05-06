


<template>
    <div class="row">
        <div class="column-left">
            <ProjectForm v-if="isLoaded" v-bind:project="populated_project" v-bind:available_users="available_users" />
        </div>

        <div class="column-right">
            <div>
                <button class="btn" @click="openTaskModal()">+ Add Task</button>
            </div>
           
            <div v-for="project in populated_project.tasks">
            <TaskForm v-if="isLoaded" v-bind:task="project" v-bind:available_users="available_users"
                v-bind:priorities="priorities" v-bind:statuses="statuses"
                v-bind:project_name="populated_project.name" />

            <Modal v-if="showModal" v-bind:task="add_task" v-bind:available_users="available_users"
                v-bind:priorities="priorities" v-bind:statuses="statuses" v-bind:project_name="populated_project.name"
                @closeModal="closeModal" />
            </div>
        </div>
    </div>
</template>

<script>
import ProjectForm from './ProjectForm.vue'
import TaskForm from './TaskForm.vue'

import Modal from './Modal.vue'

export default {
    name: 'Project',
    components: {
        ProjectForm,
        TaskForm,
        Modal
    },
    data() {
        return {
            populated_project: {},
            available_users: [],
            priorities: [],
            statuses: [],
            isLoaded: false,

            add_task: {},
            showModal: false
        }
    },
    methods: {
        openTaskModal() {
            // create an empty task object with the associated project id and empty timeline object
            this.add_task = { project: this.populated_project._id, timeline: {} }
            this.showModal = true
        },
        setData(project, users, priorities, statuses) {
            this.populated_project = { ...project }

            this.available_users = users.map(user => {
                return { _id: user._id, name: `${user.first} ${user.last}` }
            })

            this.priorities = priorities
            this.statuses = statuses

            this.isLoaded = true
        },
        closeModal() {
            this.showModal = false
        }
    },
    async beforeRouteEnter(to, from, next) {
        const identifier = to.params.identifier

        const projectRes = await fetch(`http://localhost:8888/projects/${identifier}`)
        const project = await projectRes.json()

        // get all users who are available to be associated to the project
        const usersRes = await fetch(`http://localhost:8888/users/?project=${identifier}`)
        const users = await usersRes.json()

        // get all priorities associated with the project
        const priorityRes = await fetch(`http://localhost:8888/tasks/priorities`)
        const priorities = await priorityRes.json()

        // get all statuses associated with the project
        const statusRes = await fetch(`http://localhost:8888/tasks/statuses`)
        const statuses = await statusRes.json()

        next(function (vm) {
            return vm.setData(project, users, priorities, statuses)
        })
      //console.log(identifier)
      //console.log(project)
      //console.log(priorities)
    }
}

</script>

<style>
.column-left {
    float: left;
    width: 49%;
    margin-right: 1%;
}

.column-right {
    float: right;
    width: 50%;
}
</style>