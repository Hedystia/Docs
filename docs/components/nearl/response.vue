<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    json: any
    status?: number
}>()

const formattedJson = computed(() => {
    return JSON.stringify(props.json, null, 2)
})

const syntaxHighlightedJson = computed(() => {
    const json = formattedJson.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'text-mauve-600' // number
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'text-pink-600 dark:text-pink-400' // key
            } else {
                cls = 'text-green-600 dark:text-green-400' // string
            }
        } else if (/true|false/.test(match)) {
            cls = 'text-blue-600' // boolean
        } else if (/null/.test(match)) {
            cls = 'text-gray-500' // null
        }
        return '<span class="' + cls + '">' + match + '</span>'
    })
})
</script>

<template>
    <div class="response-container my-6 rounded-xl border border-mauve-200 dark:border-mauve-800 overflow-hidden bg-white/50 dark:bg-mauve-900/50 backdrop-blur-sm">
        <div class="response-header px-4 py-1.5 border-b border-mauve-200 dark:border-mauve-800 bg-mauve-50/50 dark:bg-mauve-800/50 flex items-center gap-2">
            <span class="text-[10px] uppercase tracking-widest font-bold text-mauve-400 dark:text-mauve-500">Response</span>
            <div v-if="status" class="ml-auto flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full" :class="status < 400 ? 'bg-green-500' : 'bg-red-500'"></div>
                <span class="text-xs font-medium text-mauve-600 dark:text-mauve-300">{{ status }}</span>
            </div>
        </div>
        <div class="p-4 overflow-x-auto">
            <pre class="text-sm font-mono leading-relaxed text-mauve-800 dark:text-mauve-200"><code v-html="syntaxHighlightedJson"></code></pre>
        </div>
    </div>
</template>

<style scoped>
.response-container {
    box-shadow: 0 4px 24px -4px rgba(0, 0, 0, 0.05);
}

:deep(.text-pink-600) { color: #d946ef; }
:deep(.dark .text-pink-400) { color: #f0abfc; }
:deep(.text-green-600) { color: #16a34a; }
:deep(.dark .text-green-400) { color: #4ade80; }
:deep(.text-mauve-600) { color: #7c3aed; }
:deep(.text-blue-600) { color: #2563eb; }
:deep(.text-gray-500) { color: #6b7280; }
</style>
