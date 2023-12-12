<template>
	<div class="notes">
		<div class="note" :class="{ full: !props.grid }" v-for="(note) in props.notes" :key="note.id"
			@click="showNote(note.id)">
			<div class="text-content">
				<div class="note-header">
					<p>{{ note.title }}</p>
				</div>
				<div class="note-body">
					<p class="note-description">{{ note.description }}</p>
					<span>{{ note.date }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Note } from '@/App.vue'

const props = defineProps<{
	notes: Array<Note>,
	grid: boolean
}>()

const emit = defineEmits<{
	(e: 'show-note', v: number): void;
}>()

const showNote = (id: number) => {
	emit('show-note', id)
}
</script>

<style lang="scss" scope>

.notes {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 40px 0;
	position: relative;
}

.note {
	position: relative;
	display: flex;
	align-items: start;
	justify-content: left;

	width: 48%;
	height: 20rem;
	padding: 18px 20px;
	margin-bottom: 20px;
	background-color: white;

	transition: all .25s cubic-bezier(.025, .01, .50, 1);
	box-shadow: 0 30px 30px rgba(0, 0, 0, .025);

	&:hover {
		border: gray 1px solid;
	}

	&.full {
		width: 100%;
	}
}

.text-content {
	width: 100%;
	height: 100%;
}

.note-header {
	display: flex;
	align-items: start;
	justify-content: space-between;

	p {
		font-weight: bold;
		color: #494ce8;
	}
}

.note-body {
	overflow: hidden;
	height: calc(100% - 3rem);

	p {
		margin: 20px 0;
		overflow: hidden;
		white-space: pre;
		text-align: left;
	}

	span {
		position: absolute;
		bottom: 1rem;
		font-size: 14px;
		color: grey;
	}
}

</style>