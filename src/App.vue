<template>
  <Navbar />  
  <div id="content" class="">
    <router-view/>
  </div>
  
</template>
<script>
import Navbar from '@/components/Navbar'

export default{
  components: { Navbar },
  setup() {
    
  }
}
</script>


<style scoped>
#content{
  /* min-height: 100vh; */
  height: 100%;
}

</style>
