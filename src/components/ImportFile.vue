<template>
  <!-- <section class="form"> -->
    <h3>Importer une image</h3>
    <input class="input-file" type="file" @change="handleChange" ref="inputFile_input">
    <div class="select-box lift pointer"   @click="selectFile">
        <div class="flex flex-hor width JC-space-between">
          <span class="custom-input-title"> sélectionner un fichier</span>
            <div class="width nav-btn nav-btn_box">
                
                <span class="nav-btn nav-btn-on pointer">perm_media navigate_next</span>
            </div>
            
        </div>
        <span class="width selected-file-name" v-if="selectedFileName"> {{ selectedFileName }}</span>
        <span class="width error" v-if="fileError">{{fileError}}</span>

    </div>
    <input type="text" v-model="imageTitle" placeholder="titre">
    
   <div class="preview-box flex-row-centered pointer "  @click="selectFile">
      <div class="preview lift" ref="previewBox">
      
    </div>
   </div>
   <textarea v-model="imageDescription" placeholder="description" rows="3"></textarea>
    <div class="flex width">
        <div class="nav-btn nav-btn_box auto-left">
            <span class="nav-btn nav-btn-on pointer"  @click="handleClick">save navigate_next</span>
        </div>
    </div>
    <div class="test"></div>

  <!-- </section> -->
</template>

<script>

import getWidthandHeight from'@/composables/getWidhtAndHeight'

import { ref } from 'vue'
export default {
  setup(props, { emit }) {
    
    

    const selectedFile = ref(null)
    const selectedFileName = ref('')
    const miniature = ref(null)
    const imageTitle = ref('')
    const imageDescription = ref('')

    const fileError = ref('')
    const previewBox = ref(null)
    const width = ref(null)
    const height = ref(null)
    const inputFile_input = ref(null)
    

    
//allowed file types

  const allowedTypes = [ 'image/png', 'image/jpeg']

    const handleChange = (e) => {
      if(e.target.files[0] && allowedTypes.includes(e.target.files[0].type)){
        selectedFile.value = e.target.files[0]        
        getWidthandHeight(selectedFile.value).then(doc => {
          width.value = doc.width
          height.value = doc.height
          createMiniature()
        }).catch(err => {
          console.log(err)
        }) 
      }
    }

    const createMiniature = () => {
      let img = document.createElement('img')
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext("2d")
      previewBox.value.appendChild(canvas)
      img.onload= () => {
        canvas.width = Math.floor(width.value)
        canvas.height = Math.floor(height.value)
        ctx.drawImage(img, 0, 0, width.value, height.value)
        canvas.toBlob((blob) => {
          miniature.value = blob
          miniature.value.name = 'mini' + selectedFile.value.name
        }, "image/jpeg")
      }
      img.src = URL.createObjectURL(selectedFile.value)
    }

    const selectFile = () => {
      inputFile_input.value.click()
    }
    const handleClick = () => {
      if(miniature.value && selectedFile.value) {
        emit('createImageCard', {
          title: imageTitle.value,
          content: imageDescription.value,
          image: selectedFile.value,
          miniature: miniature.value,
          imageName: selectedFile.value.name,
          miniName: miniature.value.name
        })
      }



    }




    return {  selectedFile, handleChange, fileError, previewBox, selectedFileName, 
              selectFile, inputFile_input, handleClick, imageTitle, imageDescription, 
             }
  }

}
</script>

<style scoped>
.form{
    width: 400px;
    /* display: flex;
    flex-direction: column; */
}
.preview-box{
  margin: 30px 0;
}
.preview{
  min-width: 150px;
  min-height: 150px;
  outline: 5px dashed var(--funky);
  display: inline-block;
}
.input-file{
  display: none;
}
.custom-input-title{
  font-size: 16px;
}
.select-box, .tile{
  padding: 15px;
  margin: 15px 0;
  border-radius: 5px;
  background-color: white;
}

</style>