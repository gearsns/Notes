<template>
	<div class="new-note-creator">
		<span title="Return" class="icon back material-symbols-outlined" @click="closeNote">arrow_back_ios</span>
		<span title="Save" class="save icon material-symbols-outlined" @click="modifyNote">done</span>
		<span title="Delete" v-if="note.id >= 0" class="icon delete material-symbols-outlined"
			@click="removeNote">delete</span>
		<input v-model="note.title" placeholder="Please enter a title" type="text">
		<textarea v-model="note.description"></textarea>
		<span>{{ note.date }}</span>
	</div>
</template>

<script setup lang="ts">
import { Note } from '@/App.vue'

const props = defineProps<{
	notes: Array<Note>,
	id: number
}>()

let note: Note = {
	id: -1,
	title: '',
	description: '',
	date: '',
}
let allNotes = props.notes
for (let index = 0; index < allNotes.length; index++) {
	if (allNotes[index].id === props.id) {
		note = { ...allNotes[index] }
	}
}

const emit = defineEmits<{
	(e: 'remove', v: number): void;
	(e: 'save', v: Note): void;
	(e: 'close'): void;
}>()

const removeNote = () => {
	if (confirm("Delete Note?")) {
		emit('remove', note.id)
	}
}
const modifyNote = () => {
	if (note.title === '') {
		return false
	}
	emit('save', note)
}
const closeNote = () => {
	emit('close')
}
</script>

<style lang="scss" scope>
.new-note-creator {
	text-align: center;
	margin: 0;
	padding: 1rem;
	position: relative;

	span.icon {
		cursor: pointer;
	}

	span.back {
		position: absolute;
		top: 1rem;
		left: 1rem;
	}

	span.save {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	span.delete {
		position: absolute;
		top: 1rem;
		right: 3rem;
	}

	input {
		width: calc(100% - 8rem);
		display: inline;
	}

	input::placeholder {
		color: red;
	}

	textarea {
		font-family: $mainFont;
		width: calc(100% - 2rem);
		height: calc(100vh - 11rem);
	}

	@media screen and (max-width: 500px) {
		input {
			position: absolute;
			top: 4rem;
			left: 1rem;
			width: calc(100% - 2rem);
		}

		textarea {
			position: absolute;
			top: 9rem;
			left: 1rem;
			width: calc(100% - 2rem);
			height: calc(100vh - 14rem);
		}
	}
}
</style>