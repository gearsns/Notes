<template>
	<transition name="fade">
		<div v-if="props.open" class="modal-layout">
			<div class="modal">
				<slot></slot>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
const props = defineProps<{
	open: boolean
}>()
</script>

<style lang="scss" scope>
.fade-enter-active,
.fade-leave-active {
	will-change: opacity;
	transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0
}

.modal {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: calc(100% - 4rem);
	height: calc(100% - 4rem);
	background-color: gainsboro;
	z-index: 10;
}

.modal-layout {
	z-index: 20;
	left: 0;
	top: 0;
	position: absolute;
	background-color: #ffffffba;
	width: 100%;
	height: 100%;
}</style>