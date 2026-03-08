---
title: Hedystia Blog
layout: page
sidebar: false
editLink: false
search: false
comments: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Blog - Hedystia

    - - meta
      - name: 'description'
        content: Updates and announcements from the Hedystia team

    - - meta
      - property: 'og:description'
        content: Updates and announcements from the Hedystia team
---

<script setup>
    import Blogs from './components/blog/Landing.vue'
    import { blogs } from './data/blogs'
</script>

<Blogs :blogs="blogs" />
