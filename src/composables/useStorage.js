import { ref } from 'vue'
import { projectStorage, projectAuth } from '../firebase/config'





const useStorage = () =>      //folder = emplacement dans le storage
{
    const storageError = ref('')
    const imageUrl = ref('')
    const miniUrl = ref('')
    const filePath = ref('')


    const uploadImage = async (path, file, type) => 
    {
        filePath.value = path + file.name           //file doit se terminer par forward slash /
        const storageRef = projectStorage.ref(filePath.value)
        try
        {
            const res = await storageRef.put(file)
            if(type === 'image'){
                url.value = await res.ref.getDownloadURL() 
            } else {
                miniUrl.value = await res.ref.getDownloadURL() 
            }
            
            console.log('document added')  
        }
        catch(err)
        {
            storageError.value = err.message
        }
    }

    return { imageUrl, miniUrl , storageError, filePath, uploadImage }
}

export default useStorage
