<template>
	<div class="wrapper__search">
		<div class="search">
			<div class="search-icon" @click="clearFilter">
				<span class="material-symbols-outlined">search</span>
			</div>
		</div>
		<input type="search" :placeholder="props.placeholder" v-model="_search" />
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{
	value: string,
	placeholder: string
}>()

let _search = ref(props.value)
const clearFilter = () => {
	_search.value = ""
}
const emit = defineEmits<{
	(e: 'search', v: string): void;
}>()
watch(_search, (value: string) => {
	emit("search", value)
})
</script>

<style lang="scss" scope>
.wrapper__search {
	position: relative;

	.search {
		z-index: 1;
		top: 0;
		bottom: 0;
		left: 0;
		position: absolute;
	}

	.search-icon {
		position: relative;
		height: 100%;
		padding-left: 1rem;
		padding-right: 1rem;
		align-items: center;
		display: flex;
	}

	input {
		position: relative;
		padding: 0.8rem 0.8rem 0.8rem 3rem;
		margin-bottom: 0;
		border-radius: 2rem;
		color: #909399;
		font-size: 16px;
		height: auto;
	}
}
</style>