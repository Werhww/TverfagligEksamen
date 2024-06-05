<script setup lang="ts">
import { Notify } from 'quasar';
import { useStorage } from '@vueuse/core';
const router = useRouter()

const email = ref()
const password = ref()
const loading = ref(false)
const userRole = useStorage("Role", undefined)


async function login() {
    loading.value = true

    const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })

    if (res.status != 200) {
        Notify.create({
            message: 'Feil email eller passord. Error fra server: ' + res.msg,
            color: 'negative',
            position: 'top'
        })
        loading.value = false
        return
    }

    loading.value = false
    userRole.value = res.role as any
    router.push('/')
}

onMounted(() => {
    if (userRole.value) {
        router.push('/')
    }
})
</script>

<template>
<div class="flex items-center justify-center full-height">
    <div class="bg-grey-10 q-mt-lg q-pa-md q-gutter-y-md" style="min-width: 500px; max-width: 500px;">
        <div class="text-h5">Logg inn</div>
        <QInput v-model="email" dense placeholder="email" />
        <QInput v-model="password" dense placeholder="passord" type="password" />
        <QBtn label="login" flat class="full-width" :loading="loading" @click="login"/>
    </div>
</div>
</template>

<style scoped lang="scss">

</style>