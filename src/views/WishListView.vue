<script setup>
import { onMounted, ref } from "vue"
import { useAuthStore } from "@/stores/auth.js"
import { supabase } from "@/lib/supabase"

import BaseLayout from "@/layouts/BaseLayout.vue"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import WishlistBook from "@/components/wishlist/WishlistBook.vue"
import TheDialog from "@/components/TheDialog.vue"

const authStore = useAuthStore()

const wishlist = ref([])

const isLoading = ref(false)
async function ambilWishlist() {
  try {
    isLoading.value = true
    const { data, error } = await supabase
      .from("wishlist")
      .select("*, buku(*)")
      .eq("user_id", authStore.session.user.id)
    if (error) throw error
    return data
  } catch (err) {
    console.error(err.message)
  } finally {
    isLoading.value = false
  }
}

function hapusItem(item) {
  const found = wishlist.value.indexOf(item)
  wishlist.value.splice(found, 1)
  openDialog(`menghapus buku ${item.judul} dari wishlist...`)
}

onMounted(async () => {
  wishlist.value = await ambilWishlist()
})

const dialog = ref(null)
const dialogIsOpen = ref(false)
const dialogMessage = ref("")

function openDialog(message) {
  dialogIsOpen.value = true
  dialogMessage.value = message
}
</script>

<template>
  <BaseLayout>
    <h1>Wishlist</h1>
    <section v-if="!authStore.session">
      <p>Kamu harus login dlu ya untuk menambahkan buku ke wishlist</p>
      <p>
        <routerLink :to="{ name: 'home' }">Kembali ke beranda</routerLink>
      </p>
    </section>

    <section class="main-section" v-else>
      <LoadingSpinner v-if="isLoading" />
      <p v-if="!isLoading && !wishlist.length">Kamu belum punya apa-apa dalam wishlist kamu.</p>
      <ul v-if="wishlist.length" class="book-list">
        <WishlistBook
          v-for="wishlistItem in wishlist"
          :key="wishlistItem.no_isbn"
          :buku="wishlistItem.buku"
          @pinjam-buku="hapusItem(wishlistItem)"
          @hapus-buku="hapusItem"
        >
        </WishlistBook>
      </ul>
    </section>

    <TheDialog ref="dialog" :is-open="dialogIsOpen" @dialog-close="dialogIsOpen = false">
      <h2>Info!!!</h2>
      {{ dialogMessage }}
    </TheDialog>
  </BaseLayout>
</template>
