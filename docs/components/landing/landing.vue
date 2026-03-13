<template>
    <div id="hedystia-landing" class="relative min-h-screen bg-[#050505] text-gray-100 overflow-hidden font-sans transition-colors duration-300">
        <div class="relative z-10 max-w-7xl mx-auto px-6">
            <!-- Hero Section -->
            <section class="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-12 lg:gap-20 pt-24 pb-24">
                
                <!-- Hero Text Info -->
                <div class="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left z-20">
                    <!-- Pill Badge -->
                    <a :href="latestBlog.href" class="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-white/10 bg-white/5 text-gray-300 backdrop-blur-md hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                        <MegaphoneIcon class="w-3.5 h-3.5 text-purple-400" />
                        {{ latestBlog.title }}
                    </a>

                    <h1 class="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-2 text-white" style="font-family: 'Days One', sans-serif;">
                        Hedystia
                    </h1>
                    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight mb-6" style="font-family: 'Days One', sans-serif;">
                        <span class="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">Build APIs with </span>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-sm filter blur-[0.3px]">Confidence</span>
                    </h2>

                    <p class="text-lg md:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed font-medium">
                        A fast, end-to-end type-safe backend framework for TypeScript. Build APIs with built-in validation, real-time subscriptions, and automatic client generation without the overhead.
                    </p>

                    <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <a href="/framework/getting-started" class="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-[#050505] bg-white rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] w-full sm:w-auto focus:outline-none">
                            <span class="relative flex items-center gap-2">
                                Start Building
                                <ChevronRightIcon class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </a>

                        <div class="flex items-center gap-3 px-5 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-sm hover:border-white/20 transition-all cursor-pointer group" @click="copyInstall">
                            <span class="text-gray-500 select-none">$</span>
                            <code class="text-gray-200 font-mono text-sm tracking-wide">bun add hedystia</code>
                            <div class="ml-2 w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                <CopyIcon v-if="!copied" class="w-4 h-4" />
                                <CheckIcon v-else class="w-4 h-4 text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hero Code Showcase (Mac OS Window Style from Bot Dashboard) -->
                <div class="flex-none w-full xl:w-[600px] relative z-20 perspective-1000 mt-12 xl:mt-0">
                    <div class="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-b from-purple-500/20 to-transparent blur-xl opacity-50 z-0"></div>
                    <div class="relative rounded-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-2xl shadow-2xl overflow-hidden transform-gpu transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0 xl:rotate-y-[-4deg] xl:rotate-x-[2deg]">
                        
                        <!-- Mac OS Window Chrome -->
                        <div class="flex items-center px-4 py-3 border-b border-white/5 bg-[#111]/50">
                            <div class="flex gap-2">
                                <div class="w-3 h-3 rounded-full bg-[#FF5F56] border border-white/10"></div>
                                <div class="w-3 h-3 rounded-full bg-[#FFBD2E] border border-white/10"></div>
                                <div class="w-3 h-3 rounded-full bg-[#27C93F] border border-white/10"></div>
                            </div>
                            <div class="absolute left-1/2 transform -translate-x-1/2 text-[11px] font-mono text-gray-500 tracking-wider">
                                server.ts
                            </div>
                        </div>

                        <!-- Code Content Slot -->
                        <div class="p-4 sm:p-6 text-[13px] sm:text-[14px] leading-relaxed font-mono code-showcase-container flex-1">
                            <ClientOnly>
                                <slot name="hero-code"></slot>
                            </ClientOnly>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Type Safety E2E Focus Area -->
            <section class="mt-32 mb-20 relative z-20">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white" style="font-family: 'Days One'">
                        One unified inference.
                    </h2>
                    <p class="text-lg text-gray-400 max-w-2xl mx-auto">
                        Your server schemas are perfectly mirrored to the client. Real-time updates with zero code generation delays.
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                    <!-- Column 1 -->
                    <div class="flex flex-col group h-full">
                        <div class="flex items-center justify-between mb-4 px-2">
                            <div class="flex items-center gap-2">
                                <ServerIcon class="w-5 h-5 text-purple-400" />
                                <h3 class="font-semibold text-sm tracking-wide text-gray-300">SERVER CONFIGURATION</h3>
                            </div>
                        </div>
                        <div class="relative flex-1 flex flex-col rounded-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl transition-colors duration-300 hover:border-purple-500/30 overflow-hidden">
                            <!-- Mac OS Window Chrome -->
                            <div class="flex items-center px-4 py-3 border-b border-white/5 bg-[#111]/50 flex-shrink-0">
                                <div class="flex gap-2">
                                    <div class="w-3 h-3 rounded-full bg-[#FF5F56] border border-white/10"></div>
                                    <div class="w-3 h-3 rounded-full bg-[#FFBD2E] border border-white/10"></div>
                                    <div class="w-3 h-3 rounded-full bg-[#27C93F] border border-white/10"></div>
                                </div>
                                <div class="absolute left-1/2 transform -translate-x-1/2 text-[11px] font-mono text-gray-500 tracking-wider">
                                    server.ts
                                </div>
                            </div>
                             <div class="p-4 sm:p-5 code-showcase-container flex-1">
                                 <ClientOnly>
                                     <slot name="server-code"></slot>
                                 </ClientOnly>
                             </div>
                        </div>
                    </div>

                    <!-- Column 2 -->
                    <div class="flex flex-col group h-full">
                        <div class="flex items-center justify-between mb-4 px-2">
                            <div class="flex items-center gap-2">
                                <MonitorIcon class="w-5 h-5 text-indigo-400" />
                                <h3 class="font-semibold text-sm tracking-wide text-gray-300">CLIENT INTEGRATION</h3>
                            </div>
                        </div>
                        <div class="relative flex-1 flex flex-col rounded-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl transition-colors duration-300 hover:border-indigo-500/30 overflow-hidden">
                            <!-- Mac OS Window Chrome -->
                            <div class="flex items-center px-4 py-3 border-b border-white/5 bg-[#111]/50 flex-shrink-0">
                                <div class="flex gap-2">
                                    <div class="w-3 h-3 rounded-full bg-[#FF5F56] border border-white/10"></div>
                                    <div class="w-3 h-3 rounded-full bg-[#FFBD2E] border border-white/10"></div>
                                    <div class="w-3 h-3 rounded-full bg-[#27C93F] border border-white/10"></div>
                                </div>
                                <div class="absolute left-1/2 transform -translate-x-1/2 text-[11px] font-mono text-gray-500 tracking-wider">
                                    client.ts
                                </div>
                            </div>
                             <div class="p-4 sm:p-5 code-showcase-container flex-1">
                                 <ClientOnly>
                                     <slot name="client-code"></slot>
                                 </ClientOnly>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Grid Feature Cards (Skyport / 21st.dev style) -->
            <section class="mt-24 z-20 relative">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-5xl font-bold text-white tracking-tight" style="font-family: 'Days One'">Core Capabilities</h2>
                </div>
                
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                    <div class="absolute inset-0 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
                    
                    <!-- Feature 1 -->
                    <div class="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/30 transition-all duration-500 z-10">
                        <div class="h-full px-6 py-8 rounded-[15px] bg-[#0A0A0A] overflow-hidden relative">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
                            <ShieldCheckIcon class="w-8 h-8 text-purple-400 mb-6" />
                            <h4 class="text-xl font-semibold text-white mb-3">End-to-End Safety</h4>
                            <p class="text-gray-400 text-sm leading-relaxed">No external parsers. Route schemas drive the TypeScript inference entirely, preserving safety across the network bridge.</p>
                        </div>
                    </div>

                    <!-- Feature 2 -->
                    <div class="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-amber-500/30 transition-all duration-500 z-10">
                        <div class="h-full px-6 py-8 rounded-[15px] bg-[#0A0A0A] overflow-hidden relative">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
                            <ZapIcon class="w-8 h-8 text-amber-400 mb-6" />
                            <h4 class="text-xl font-semibold text-white mb-3">Built on Bun</h4>
                            <p class="text-gray-400 text-sm leading-relaxed">Designed natively for Bun's extreme performance. Cold starts are lightning-fast with minimal overhead for every request.</p>
                        </div>
                    </div>

                    <!-- Feature 3 -->
                    <div class="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-emerald-500/30 transition-all duration-500 z-10">
                        <div class="h-full px-6 py-8 rounded-[15px] bg-[#0A0A0A] overflow-hidden relative">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                            <WifiIcon class="w-8 h-8 text-emerald-400 mb-6" />
                            <h4 class="text-xl font-semibold text-white mb-3">Real-Time First</h4>
                            <p class="text-gray-400 text-sm leading-relaxed">Subscriptions via WebSockets and SSE are treated like HTTP endpoints. Type-safe streams directly mapped to identical contexts.</p>
                        </div>
                    </div>

                    <!-- Feature 4 -->
                    <div class="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-pink-500/30 transition-all duration-500 z-10">
                        <div class="h-full px-6 py-8 rounded-[15px] bg-[#0A0A0A] overflow-hidden relative">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors"></div>
                            <BoxIcon class="w-8 h-8 text-pink-400 mb-6" />
                            <h4 class="text-xl font-semibold text-white mb-3">Built-in Builder</h4>
                            <p class="text-gray-400 text-sm leading-relaxed">Forget external dependencies. The native `h` schema builder seamlessly generates types and acts as a runtime validator automatically.</p>
                        </div>
                    </div>

                    <!-- Feature 5 -->
                    <div class="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-cyan-500/30 transition-all duration-500 z-10">
                        <div class="h-full px-6 py-8 rounded-[15px] bg-[#0A0A0A] overflow-hidden relative">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors"></div>
                            <LayersIcon class="w-8 h-8 text-cyan-400 mb-6" />
                            <h4 class="text-xl font-semibold text-white mb-3">Plugins Architecture</h4>
                            <p class="text-gray-400 text-sm leading-relaxed">Encapsulate logic beautifully. Any module export can be `.use()`d directly as a distinct application, enabling immense scale.</p>
                        </div>
                    </div>

                    <!-- Feature 6 -->
                    <div class="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-indigo-500/30 transition-all duration-500 z-10">
                        <div class="h-full px-6 py-8 rounded-[15px] bg-[#0A0A0A] overflow-hidden relative">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
                            <BookOpenIcon class="w-8 h-8 text-indigo-400 mb-6" />
                            <h4 class="text-xl font-semibold text-white mb-3">Auto-Swagger Docs</h4>
                            <p class="text-gray-400 text-sm leading-relaxed">Your typing directly reflects the OpenAPI specification. Install a plugin to autogenerate pristine interactive documentation instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Contributors Marquee -->
            <section class="mt-24 mb-10 overflow-hidden relative z-20 border-t border-white/5 pt-16">
                <p class="text-center text-sm font-semibold text-gray-500 tracking-widest uppercase mb-10">Trusted By & Contributors</p>
                <div class="relative w-full flex align-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                    <div class="flex animate-marquee min-w-max">
                        <!-- FIRST SET -->
                        <div class="flex gap-16 items-center flex-shrink-0 pr-16">
                            <a href="https://hedystia.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/logo.png" class="h-10 w-10 object-contain" alt="Hedystia Bot" />
                                <span class="font-bold text-xl tracking-tight text-white">Hedystia</span>
                            </a>
                            <a href="https://boxmineworld.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/boxmineworld.png" class="h-8 w-auto object-contain" alt="BoxMineWorld" />
                                <span class="font-bold text-xl tracking-tight text-white">BoxMineWorld</span>
                            </a>
                            <a href="https://hedystia.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/logo.png" class="h-10 w-10 object-contain" alt="Hedystia Bot" />
                                <span class="font-bold text-xl tracking-tight text-white">Hedystia</span>
                            </a>
                            <a href="https://boxmineworld.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/boxmineworld.png" class="h-8 w-auto object-contain" alt="BoxMineWorld" />
                                <span class="font-bold text-xl tracking-tight text-white">BoxMineWorld</span>
                            </a>
                            <a href="https://hedystia.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/logo.png" class="h-10 w-10 object-contain" alt="Hedystia Bot" />
                                <span class="font-bold text-xl tracking-tight text-white">Hedystia</span>
                            </a>
                            <a href="https://boxmineworld.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/boxmineworld.png" class="h-8 w-auto object-contain" alt="BoxMineWorld" />
                                <span class="font-bold text-xl tracking-tight text-white">BoxMineWorld</span>
                            </a>
                            <a href="https://hedystia.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/logo.png" class="h-10 w-10 object-contain" alt="Hedystia Bot" />
                                <span class="font-bold text-xl tracking-tight text-white">Hedystia</span>
                            </a>
                            <a href="https://boxmineworld.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/boxmineworld.png" class="h-8 w-auto object-contain" alt="BoxMineWorld" />
                                <span class="font-bold text-xl tracking-tight text-white">BoxMineWorld</span>
                            </a>
                        </div>
                        
                        <!-- SECOND SET (DUPLICATE) -->
                        <div class="flex gap-16 items-center flex-shrink-0 pr-16" aria-hidden="true">
                            <a href="https://hedystia.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/logo.png" class="h-10 w-10 object-contain" alt="Hedystia Bot" />
                                <span class="font-bold text-xl tracking-tight text-white">Hedystia</span>
                            </a>
                            <a href="https://boxmineworld.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/boxmineworld.png" class="h-8 w-auto object-contain" alt="BoxMineWorld" />
                                <span class="font-bold text-xl tracking-tight text-white">BoxMineWorld</span>
                            </a>
                            <a href="https://hedystia.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/logo.png" class="h-10 w-10 object-contain" alt="Hedystia Bot" />
                                <span class="font-bold text-xl tracking-tight text-white">Hedystia</span>
                            </a>
                            <a href="https://boxmineworld.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/boxmineworld.png" class="h-8 w-auto object-contain" alt="BoxMineWorld" />
                                <span class="font-bold text-xl tracking-tight text-white">BoxMineWorld</span>
                            </a>
                            <a href="https://hedystia.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/logo.png" class="h-10 w-10 object-contain" alt="Hedystia Bot" />
                                <span class="font-bold text-xl tracking-tight text-white">Hedystia</span>
                            </a>
                            <a href="https://boxmineworld.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/boxmineworld.png" class="h-8 w-auto object-contain" alt="BoxMineWorld" />
                                <span class="font-bold text-xl tracking-tight text-white">BoxMineWorld</span>
                            </a>
                            <a href="https://hedystia.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/logo.png" class="h-10 w-10 object-contain" alt="Hedystia Bot" />
                                <span class="font-bold text-xl tracking-tight text-white">Hedystia</span>
                            </a>
                            <a href="https://boxmineworld.com" target="_blank" class="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                <img src="/boxmineworld.png" class="h-8 w-auto object-contain" alt="BoxMineWorld" />
                                <span class="font-bold text-xl tracking-tight text-white">BoxMineWorld</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </div>
</template>

<script setup lang="ts">
import {
  BookOpenIcon,
  BoxIcon,
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  LayersIcon,
  MegaphoneIcon,
  MonitorIcon,
  ServerIcon,
  ShieldCheckIcon,
  WifiIcon,
  ZapIcon,
} from "lucide-vue-next";
import { ref } from "vue";

const props = defineProps({
  latestBlog: {
    type: Object,
    default: () => ({
      title: "Introducing V1.0 Engine",
      href: "/framework/introduction",
    }),
  },
});

const copied = ref(false);

const copyInstall = () => {
  if (window.isSecureContext) {
    navigator.clipboard.writeText("bun add hedystia");
  }
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<style>
@reference "../../tailwind.css";

:root {
  --vp-nav-bg-color: #050505 !important;
  --vp-nav-bg-color-solid: #050505 !important;
  --vp-c-bg: #050505 !important;
  --vp-c-bg-alt: #050505 !important;
}

/* Code Showcase Overrides */
.code-showcase-container {
    mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
}
.code-showcase-container .vp-code-group {
    @apply m-0 rounded-none bg-transparent;
}
.code-showcase-container .vp-code-group-header {
    display: none !important;
}
.code-showcase-container div[class*="language-"] {
    @apply m-0 p-0 rounded-none bg-transparent;
}
.code-showcase-container div[class*="language-"] > span.lang {
    display: none !important;
}
.code-showcase-container pre {
    @apply m-0 p-0 bg-transparent outline-[0px];
}

/* Custom minimal scrollbar for code blocks */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-white/10 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-white/20;
}

/* Infinite Marquee Animation */
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.animate-marquee {
    animation: marquee 40s linear infinite;
    will-change: transform;
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
}

.animate-marquee:hover {
    animation-play-state: paused;
}
</style>
