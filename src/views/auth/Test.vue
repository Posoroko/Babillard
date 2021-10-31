<template>
<div class=" full" @mouseover="handleMouseOver">
    <span name="hovered1" >
      tool no. 1
    </span>
    <span class="eric" v-if="showingToolTip == 'hovered1' ">
      {{ toolTips.tip1 }}
    </span>
</div>

</template>

<script setup>
   import { ref } from 'vue'

  const text = ref('and my friends')
  const color = ref('blue')
  const colour = ref('red')
  const toolTips = ref({
    tip1: 'hello friend!'
  })
    
  const allowed = [ "hovered1",  "hovered2", "hovered3" ]
  const showingToolTip = ref(null)
  const handleMouseOver = (e) => {
    if(allowed.includes(e.target.getAttribute('name'))) {
      showingToolTip.value = e.target.getAttribute('name')
    } else {
      showingToolTip.value = null
    }
  }
            

</script>

<style scoped>

span{
  font-size: 30px;
}
span:after {
  content: v-bind(text);
}
</style>