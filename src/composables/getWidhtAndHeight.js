import { ref } from 'vue'

/*
le plus grand côté de l'image source sera réduit à 200px
*/

    
const getWidthandHeight = (inputFile) => {

    return new Promise((resolve, reject) => {

    let targetSize = 200
    let ratio
      //import the original image
      let img = document.createElement("img")
      img.file = inputFile
      let reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target.result
        img.onload = () => {
            
            if(img.naturalWidth < img.naturalHeight) {
              ratio = img.naturalWidth / targetSize
            } else {
              ratio = img.naturalHeight / targetSize
            }

          let  w = img.naturalWidth / ratio
          let  h = img.naturalHeight / ratio
            if( w && h ){
              resolve({ 'width': w, 
                    'height': h }) 
            } else {
              reject('il y a eu un problème')
            }
            
        
        }
      }
      reader.readAsDataURL(inputFile)

    })
    }

  
    

    

export default getWidthandHeight