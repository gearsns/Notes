<template>
	<div class="top-menu">
		<span title="Close" class="icon close material-symbols-outlined" @click="closeMenu">close</span>
		<br>
		<ul>
			<li :class="{ disabled: cloudStatus !== 'None', active: cloudStatus === 'Upload' }" @click="uploadNotes">
				<span title="Upload" class="icon material-symbols-outlined">backup</span>
				<span class="text">upload</span>
			</li>
			<li :class="{ disabled: cloudStatus !== 'None', active: cloudStatus === 'Download' }" @click="dowanloadNotes">
				<span title="Download" class="icon material-symbols-outlined">cloud_download</span>
				<span class="text">download</span>
			</li>
			<li :class="{ disabled: cloudStatus !== 'None', active: cloudStatus === 'Export' }" @click="fileSave">
				<span title="Export" class="icon material-symbols-outlined">file_save</span>
				<span class="text">save</span>
			</li>
			<li :class="{ disabled: cloudStatus !== 'None', active: cloudStatus === 'Import' }" @click="fileOpen">
				<span title="Import" class="icon material-symbols-outlined">file_open</span>
				<span class="text">load</span>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Note } from '@/App.vue'

type CloudStatusType = "None" | "Upload" | "Download" | "Export" | "Import"

const props = defineProps<{
	notes: Array<Note>
}>()


let cloudStatus = ref<CloudStatusType>("None")
const emit = defineEmits<{
	(e: 'close', v: null): void;
	(e: 'upload', v: null): void;
	(e: 'download', v: null): void;
	(e: 'save', v: null): void;
	(e: 'load', v: Array<Note>): void;
}>()
const closeMenu = () => {
	emit('close', null)
}
const uploadNotes = () => {
	if (!confirm("Upload Notes?")) {
		return
	}
	cloudStatus.value = "Upload"
	emit('upload', null)
	emit('close', null)
}
const dowanloadNotes = () => {
	if (!confirm("Download Notes?")) {
		return
	}
	cloudStatus.value = "Download"
	emit('download', null)
	emit('close', null)
}
const fileOpen = async () => {
	cloudStatus.value = "Import"
	try {
		let json: Array<Note> = []
		if ((window as any).showOpenFilePicker) {
			const [fileHandle] = await (window as any).showOpenFilePicker({
				types: [
					{
						description: "json file",
						accept: { "application/json": [".json"] }
					}
				],
			})
			const file = await fileHandle.getFile()
			const text = await file.text()
			json = JSON.parse(text)
		}
		let id = -1
		const notes_tmp: Array<Note> = []
		for (const item of json) {
			id += 1
			notes_tmp.push(
				{
					id: id,
					title: item.title,
					description: item.description,
					date: item.date
				}
			)
		}
		emit('load', notes_tmp)
		emit('close', null)
	} catch(e) {
		console.log(e)
		cloudStatus.value = "None"
	 }
}
const fileSave = async () => {
	cloudStatus.value = "Export"
	try {
		if ((window as any).showSaveFilePicker) {
			const fileHandle = await (window as any).showSaveFilePicker({
				types: [
					{
						description: "json file",
						accept: { "application/json": [".json"] }
					}
				]
			})
			const writer = await fileHandle.createWritable()
			await writer.truncate(0)
			await writer.write(JSON.stringify(props.notes))
			await writer.close()
			emit('close', null)
		}
	} catch(e) { 
		console.log(e)
		cloudStatus.value = "None"
	}
}
</script>

<style lang="scss" scope>
.top-menu {
	text-align: left;
	padding: 1rem;
	background-color: whitesmoke;
	width: 100%;
	height: 100%;

	li {
		cursor: pointer;
		border-bottom: 1px solid #ddd;
	}
	li:hover {
		color: #494ce8;
		border-bottom: 1px solid #494ce8;
	}

	span.text {
		vertical-align: bottom;
		font-size: 1.5rem;
		padding-left: 0.5rem;
	}

	span.close {
		top: 1rem;
		right: 1rem;
		position: absolute;
	}

	span.icon {
		cursor: pointer;
	}

	li.disabled {
		color: grey;
		cursor: auto;
	}

	li.grid {
		color: grey;
		cursor: pointer;
	}

	li.active {
		color: #494ce8;
	}
}
</style>
