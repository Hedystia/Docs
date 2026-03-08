<script setup lang="ts">
import {
    ref,
    nextTick,
    provide,
    onMounted,
    computed,
    defineAsyncComponent,
    Teleport
} from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import { File, Heart, Sparkles, Terminal } from 'lucide-vue-next'
import mediumZoom from 'medium-zoom'

import useDark from './use-dark'

import Ray from '../../components/fern/ray.vue'
import PackageSelect from './components/PackageSelect.vue'

const isDark = useDark()
const { isDark: darkTheme } = useData()

const enableTransitions = () =>
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    if (!enableTransitions()) {
        darkTheme.value = !darkTheme.value
        return
    }

    const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        )}px at ${x}px ${y}px)`
    ]

    await document.startViewTransition(async () => {
        darkTheme.value = !darkTheme.value
        await nextTick()
    }).ready

    document.documentElement.animate(
        { clipPath: darkTheme.value ? clipPath.reverse() : clipPath },
        {
            duration: 300,
            easing: 'ease-in',
            pseudoElement: `::view-transition-${darkTheme.value ? 'old' : 'new'}(root)`
        }
    )
})
const onNewPage = () => {
    mediumZoom('[data-zoomable]', {
        background: 'transparent'
    })

    if (document.querySelector('.vp-doc > div:has(.code-compare)')) {
        document.getElementById('VPContent')?.classList.add('-wide')
        document.querySelector('.VPDoc > .container')?.classList.add('-wide')
        document.querySelector('.vp-doc > div')?.classList.add('-wide')
    } else {
        document.getElementById('VPContent')?.classList.remove('-wide')
        document.querySelector('.VPDoc > .container')?.classList.remove('-wide')
        document.querySelector('.vp-doc > div')?.classList.remove('-wide')
    }
}

onMounted(onNewPage)

const router = useRouter()
router.onAfterRouteChange = () => {
    onNewPage()
}

const prompt = computed(() =>
    encodeURI(
        `I'm looking at https://docs.hedystia.com${router.route.path}.\n\nWould you kindly explain, summarize the concept, and answer any questions I have about it?`
    )
)

</script>

<template>
    <DefaultTheme.Layout>
        <template #sidebar-nav-before>
            <PackageSelect />
        </template>
        <template #doc-top>
            <Ray
                class="h-[220px] top-0 left-0 opacity-25 dark:opacity-[.55] pointer-events-none"
                static
            />
        </template>
    </DefaultTheme.Layout>
</template>

<style>
.medium-zoom-image {
    z-index: 999;
    -webkit-transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
}

html.dark .medium-zoom-overlay {
    backdrop-filter: blur(2.5rem) brightness(0.85);
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
    z-index: 999;
}

::view-transition-old(root),
::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
    z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
    z-index: 9999;
}
</style>
