<template>
  <v-app>
    <v-app-bar color="white" class="px-4 text-center">
      <v-app-bar-title class="mx-0">
        <div class="d-flex flex column justify-center">
          <NuxtLink :to="'/'" class="d-flex align-center text-black text-decoration-none">
            <span>TMP&nbsp;</span>
            <span>
              <img
                src="/assets/img/logo.png"
                height="30px"
                width="30px"
                alt="app-icon"
                class="mr-2"
              />
            </span>
            <span>LINE</span>
          </NuxtLink>
        </div>
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4" style="min-height: 93vh;">
      <div>
        <NuxtPage />
      </div>
    </v-main>

    <!-- <ConfirmDialog />
    <VToast /> -->
    
    <v-footer color="grey-lighten-4">
      <div class="px-4 py-2 text-center w-100">
        {{ new Date().getFullYear() }} — <strong>TMP Clothings</strong>
      </div>
    </v-footer>
  </v-app>
</template>


<style lang="scss" scoped>
.content {
  height: 85vh;
}

.v-footer {
  flex-shrink: 0;
}
</style>
