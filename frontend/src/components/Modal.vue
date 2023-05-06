<template>
    <div class="modal-container">
        <div class="modal">
            <ProjectForm v-if="project" v-bind:project="project" v-bind:available_users="available_users" />

            <TaskForm v-if="task" v-bind:task="task" v-bind:available_users="available_users"
                v-bind:priorities="priorities" v-bind:statuses="statuses" v-bind:project_name="project_name" />

            <button class="close-modal" @click="closeModal">Close</button>
        </div>
    </div>
</template>

<script>
import ProjectForm from './ProjectForm.vue'
import TaskForm from './TaskForm.vue'
export default {
    name: 'Modal',
    components: {
        ProjectForm,
        TaskForm
    },
    props: {
        project: Object,
        task: Object,
        available_users: Array,
        priorities: Array,
        statuses: Array,
        project_name: String
    },
    methods: {
        closeModal() {
            this.$emit('closeModal')
        }
    }
}
</script>

<style>
.modal-container {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(1px);
}

.modal {
    background-color: #FFF;
    border: 1px solid #000;
    width: 700px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.close-modal {
    background: #AAA;
    border: 1px solid #999;
    color: #FFF;
    border-radius: 50px;
    cursor: pointer;
    font-size: 12px;
    display: block;
    width: 50px;
    padding: 2px;
    margin: 20px auto;
}

.close-modal:hover {
    background: #555;
}
</style>