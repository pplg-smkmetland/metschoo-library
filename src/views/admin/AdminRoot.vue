<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "@/lib/supabase"

import LoadingSpinner from "@/components/LoadingSpinner.vue"
import DataRow from "@/components/admin/DataRow.vue"

const isLoading = ref(false)
const dataPeminjaman = ref([])

async function ambilDataPeminjaman() {
  try {
    isLoading.value = true
    const { data, error } = await supabase.from("peminjaman").select("*, pengguna(*), buku(*)")
    if (error) throw error
    return data
  } catch (err) {
    console.error(err.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  dataPeminjaman.value = await ambilDataPeminjaman()
})

async function konfirmasiPeminjaman(no_isbn) {
  try {
    if (!confirm("beneran nih mau konfirmasi peminjaman buku")) return
    const { data, error } = await supabase
      .from("peminjaman")
      .update({ sudah_dikonfirmasi: true })
      .eq("no_isbn", no_isbn)
      .select()
    if (error) throw error

    dataPeminjaman.value = data
  } catch (err) {
    console.error(err.message)
  }
}

function konfirmasiPengembalian(no_isbn) {
  alert(`kembalikan buku dengan no isbn ${no_isbn}`)
}
</script>

<template>
  <h1>Admin</h1>
  <p>Halo admin</p>

  <section class="main-section">
    <h2>Data peminjaman buku</h2>

    <ul class="data-list">
      <LoadingSpinner v-if="isLoading" />
      <li v-if="!isLoading && !dataPeminjaman.length">ga ada data peminjamannya</li>
      <DataRow
        v-for="data in dataPeminjaman"
        :key="data.user_id"
        :data="data"
        @konfirmasi-peminjaman="konfirmasiPeminjaman(data.no_isbn)"
        @konfirmasi-pengembalian="konfirmasiPengembalian(data.no_isbn)"
      />
    </ul>
  </section>
</template>

<style scoped>
.data-list {
  list-style: none;
  margin: 0;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50ch, 1fr));
  gap: 1rem;
}
</style>
