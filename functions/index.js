const functions = require("firebase-functions");
const linkPreviewJs = require("link-preview-js");



exports.getMetadata = functions.https.onCall((data, context) => {
    const link = data.link

    const linkPreview =  linkPreviewJs.getLinkPreview(link)
        .then((res) => {
            return res;
        });
    return linkPreview;
});

exports.sayHello = functions.https.onCall((data, context) => {
    return 'hello ninjas';
});