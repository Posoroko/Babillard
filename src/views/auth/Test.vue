<template>
    <div class=" grid-center">
        <!-- <iframe src="https://www.youtube.com/embed/Hv6EMd8dlQk" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe> -->
    </div>
    <div class="img full"></div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
    components: {  },
    setup() {
        let info= ref('')
        let link = 'https://www.youtube.com/watch?v=sGvEqHkDyFc&t=83s'
        const thumbnail = ref('')
        var myHeaders = new Headers();
        var header = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };
        
        fetch('https://www.youtube.com/oembed?url=' + link + '&format=json', header)
            .then((res) => { 
                res.json().then(e => { 
                    info.value = e
                    console.log(info.value.thumbnail_url)
                    thumbnail.value = info.value.thumbnail_url
                    
                })
            })

        

        return { info, thumbnail }
    }

}
</script>

<style scoped>
iframe{
    width: 560px;
    height: 315px; 
}
.img{
    background-image: url(https://i.ytimg.com/vi/sGvEqHkDyFc/hqdefault.jpg);
    /* background-color: blue; */
}

</style>