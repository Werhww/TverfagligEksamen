<script setup lang="ts">
import type { Role } from '@prisma/client';

const props = defineProps<{
    to: string
    showFor: Role[]
    icon: string
    text: string
	userRole: Role | undefined
}>()

const shown = computed(() => {
	if(props.userRole === undefined) return false
	return props.showFor.includes(props.userRole)
})
</script>

<template>
	<QItem v-if="shown" clickable v-ripple :to="to" active-class="text-grey">
		<QItemSection side>
			<QIcon :name="icon" />
		</QItemSection>
		<QItemSection class="text-h6"> {{ text }} </QItemSection>
	</QItem>
</template>

<style scoped lang="scss"></style>
