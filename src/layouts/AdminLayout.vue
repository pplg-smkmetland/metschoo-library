<script setup>
import TheNavbar from "@/components/TheNavbar.vue"
import AdminSidebar from "@/components/admin/AdminSidebar.vue"
</script>

<template>
  <div class="wrapper">
    <TheNavbar />
    <AdminSidebar />
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-areas:
    "navbar navbar"
    "sidebar content";
  grid-template-columns: 25ch 1fr;
}

main {
  grid-area: content;
}
</style>
