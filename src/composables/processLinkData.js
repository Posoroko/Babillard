const processLinkData = (data) => {
    let result = new Object();
    result.contentType = data.contentType
    result.mediaType = data.mediaType
    result.url = data.url
    result.siteName = data.siteName
    //grab biggest icon available
    if(data.favicons) {
        result.favicon = data.favicons[data.favicons.length -1]
    }
    //grab first image available
    if(data.images) {
        result.image = data.images[0]
    }
    // set url of media
    if(data.contentType.toLowerCase().includes('html')) {
        result.title = data.title
        result.description = data.description
    } else if (data.contentType.toLowerCase().includes('image')) {
        result.image = data.url
    } else if(data.contentType.toLowerCase().includes('video')) {
        result.video = data.url
    } else if(data.contentType.toLowerCase().includes('pdf')) {
        result.pdf = data.url
    } else if (data.contentType.toLowerCase().includes('audio')) {
        result.audio = data.url
    }
    return result

}

export default processLinkData

