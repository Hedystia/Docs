<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import {
  Box,
  CreditCard,
  Database,
  Zap,
  BarChart3,
  ChevronDown,
  ShieldCheck,
  Eye
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const packages = [
  { name: 'Framework', id: 'framework', icon: Box, path: '/framework/introduction' },
  { name: 'View', id: 'view', icon: Eye, path: '/view/start' },
  { name: 'DataBase', id: 'db', icon: Database, path: '/db/start' },
  { name: 'Validations', id: 'validations', icon: ShieldCheck, path: '/validations/start' },
  { name: 'Billing', id: 'billing', icon: CreditCard, path: '/billing/start' },
  { name: 'Cache', id: 'cache', icon: Zap, path: '/cache/start' },
  { name: 'Stats', id: 'stats', icon: BarChart3, path: '/stats/start' },
]

const currentPackage = computed(() => {
  if (route.path.includes('/view')) return packages[1]
  if (route.path.includes('/db')) return packages[2]
  if (route.path.includes('/validations')) return packages[3]
  if (route.path.includes('/billing')) return packages[4]
  if (route.path.includes('/cache')) return packages[5]
  if (route.path.includes('/stats')) return packages[6]
  return packages[0]
})

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const selectPackage = (pkg: typeof packages[0]) => {
  isOpen.value = false
  router.go(pkg.path)
}

const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="package-select" ref="selectRef">
    <button @click="toggleDropdown" class="package-trigger" :class="{ 'is-open': isOpen }">
      <div class="icon-container">
        <component :is="currentPackage.icon" class="w-4 h-4" />
      </div>
      <span class="package-label">{{ currentPackage.name }}</span>
      <ChevronDown class="w-3.5 h-3.5 ml-auto transition-transform duration-300" :class="{ 'rotate-180': isOpen }" />
    </button>
    
    <div v-if="isOpen" class="package-dropdown">
        <div class="dropdown-content">
            <button 
                v-for="pkg in packages" 
                :key="pkg.id"
                class="dropdown-item"
                :class="{ 'is-active': currentPackage.id === pkg.id }"
                @click="selectPackage(pkg)"
            >
                <div class="item-icon">
                    <component :is="pkg.icon" class="w-4 h-4" />
                </div>
                <span class="item-text">{{ pkg.name }}</span>
                <div v-if="currentPackage.id === pkg.id" class="active-dot"></div>
            </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.package-select {
  position: relative;
  margin-bottom: 1rem;
  padding: 0 12px;
}

.package-trigger {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.package-trigger:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-mute);
}

.package-trigger.is-open {
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-right: 10px;
}

.package-label {
  flex: 1;
  text-align: left;
}

.package-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 12px;
  right: 12px;
  z-index: 100;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  overflow: hidden;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
}

.dropdown-content {
    padding: 6px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.dropdown-item.is-active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.item-icon {
    margin-right: 10px;
    opacity: 0.7;
}

.dropdown-item:hover .item-icon,
.dropdown-item.is-active .item-icon {
    opacity: 1;
}

.active-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    margin-left: auto;
}
</style>
