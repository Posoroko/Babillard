<template>
  <Navbar />  
  <div id="content">
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
  border: 1px solid green;
  height: 100%;
}

</style>
