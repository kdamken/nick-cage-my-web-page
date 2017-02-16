$(document).ready(function(){

    /*
    Goals
        Change this to use node error handing or promises
            Check for site and see if it's working
            if it isn't, throw error
            if it is, run big function
        Give all functions names so that we just call them instead of one giant block
        Can we make it so the bg image code is more reusable as it's own function? like with the iswide and tall rectangle ones?
        Build if else block based on number of elements in array?

    I'm confused - how do I get this to work? I need to check if the image loads, then if it does, call a function

    How do you set up some fucking steps this async shit is fucking me up?

    */

    // Test if we're able to load an image from placecage.com to make sure it's up.

    var placeholderSite = '//www.placecage.com/';

    function testCage() {
        //Check for image working
        var testImage = new Image();

        // Only runs on load
        function onloadHandler(){
            console.log('loaded init');
            console.info("Nick Cage is good to go!");
            initNick();
        }

        // Only runs on error
        function onerrorHandler(){
            console.log('error init');
            console.error("Cannot connect to placecage.com - abandon ship!");
            alert("Nick Cage is unavailable at the moment - please try again later!");
        }

        testImage.onload = onloadHandler;
        testImage.onerror = onerrorHandler;

        testImage.src = "https://www.placecage.com/200/300";

        console.log('end of testCage');
    }

    // Initiate nick cage testing
    testCage();

    function imgCounter(counter) {
        var imgType;

        if (counter == 1) {
            imgType = "";
        } else if (counter == 2 ){
            imgType = "g/";
        } else if (counter == 3 ){
            imgType = "c/";
        } else if (counter == 4 ){
            imgType = "gif/";
            counter = 0;
        }

        return {
            imgType: imgType,
            counter: counter
        }
    }

    function videoCounter(counter, list) {
        var type;

        if (counter == 1) {
            type = list[0];
        } else if (counter == 2 ){
            type = list[1];
        } else if (counter == 3 ){
            type = list[2];
        } else if (counter == 4 ){
            type = list[3];
            counter = 0;
        }

        return {
            type: type,
            counter: counter
        }
    }

    function initNick() {

        // Add classes to remove pseudo elements if needed
        var head = $('head');
        var newStyle = document.createElement("style");
        newStyle.innerHTML = '.kill-pseudo:before, .kill-pseudo:before  { content: none !important;}';
        head.append(newStyle);

        //Functions for checking if something is a tall or wide rectangle, which will be used for replacing background images
        function isWideRectangle (width, height, el)  {
            if ( width > height ) {
                var calc = (height / width);
                if (calc < 0.55) {
                    el.addClass('is-wide-rectangle'); //for me to check this is working
                    w = height;
                    bSize = w + 'px ' + height + 'px';
                    // console.log('wide bSize', bSize);
                    return {
                        newWidth: w,
                        newbSize: bSize
                    }
                }
            }
        }

        function isTallRectangle (width, height, el)  {
            if ( height > width ) {
                var calc = (width / height);
                if (calc < 0.55) {
                    el.addClass('is-tall-rectangle'); //for me to check this is working
                    h = width;
                    bSize = width + 'px ' + h + 'px';
                    // console.log('tall bSize', bSize);
                    return {
                        newHeight: h,
                        newbSize: bSize
                    }
                }
            }
        }

        replaceImages(isWideRectangle, isTallRectangle, imgCounter);
        replaceBackgroundImages(isWideRectangle, isTallRectangle, imgCounter);
        replaceIframes(videoCounter);
    }

    // Replace all standard images with pictures of nick cage
    function replaceImages(isWide, isTall, imgCounter) {
        var w;
        var h;
        var newURL;
        var imgType;
        var counter = 0;

        $('img').each(function(){
            w = Math.floor($(this).outerWidth());
            h = Math.floor($(this).outerHeight());

            if ( (w >= 1) && (h >= 1) ) {

                // Cycle through the different placecage options
                counter++;
                result = imgCounter(counter);
                imgType = result.imgType;
                counter = result.counter

                //Get dimensions of current element so we can make sure those don't go away when removing its insides
                var elWidth = 'width: ' + w + 'px;';
                var elHeight = 'height: ' + h + 'px;';
                // console.log('elWidth', elWidth, 'elHeight', elHeight);

                var wide = isWide(w, h, $(this));
                var tall = isTall(w, h, $(this));
                if (wide) {
                    w = wide.newWidth;
                    var bSize = wide.newbSize;
                }
                if (tall) {
                    h = tall.newHeight;
                    var bSize = tall.newbSize;
                }

                // If a wide or tall rectangle was found, give the image a background image and take out the original image
                if (wide || tall) {

                    newUrl = 'background-image: url("' + placeholderSite + imgType + w + '/' + h + '");';
                    var cssTextVar = elWidth + elHeight + newUrl;
                    $(this).css({
                        'display' : 'block',
                        'cssText': cssTextVar,
                        'background-size' : bSize,
                        'background-repeat' : 'repeat',
                        'background-position' : 'center center'
                    });
                    $(this).attr({
                        src : '',
                        alt : '',
                        title : ''
                    })
                    $(this).addClass('cagified-bg');
                }
                // If the image wasn't a wide or tall rectangle, just replace the image source
                else {

                    newUrl = placeholderSite + imgType + w + "/" + h;
                    $(this).attr("src", newUrl);
                    $(this).attr("srcset", newUrl);
                }

            }

        });
    }

    // Replace background images with pictures of nick cage
    function replaceBackgroundImages(isWide, isTall) {
        var w;
        var h;
        var newURL;
        var imgType;
        var counter = 0;

        $('*').not('.cagified-bg').each(function(){
            var bSize = 'cover';

            // Check if the element has a background image
            if ($(this).css('background-image') != 'none') {

                //First, we need to get the width and height of the background image, depending on whether or not it's background-attachment fixed

                //If the element doesn't have a fixed background image, get the width/height of the element itself
                if ($(this).css('background-attachment') != 'fixed') {

                    $(this).addClass('not-fixed'); //for me to check this is working

                    // Get height of actual element
                    w = Math.floor($(this).outerWidth());
                    h = Math.floor($(this).outerHeight());

                }
                // If the background is fixed, get the width/height of the background image instead
                else {
                    $(this).addClass('is-fixed');

                    // Get image url from property value by removing the beginning url(" and ending ") part of it.
                    image_url = $(this).css('background-image');
                    var end = image_url.length - 2;
                    image_url = image_url.substring(5,end);

                    // Make new image object and set its source to the background image so we can get its dimensions
                    image = new Image();
                    image.src = image_url;

                    // Set width and height to the background image's
                    w = Math.floor(image.width);
                    h = Math.floor(image.height);

                }

                // Check and make sure the image is not 0 x 0 before applying Nick
                if ( (w >= 1) && (h >= 1) ) {

                    // Check to see if it's a wide/tall rectangle, if it is, tweak it so it will work as a tiled/repeating background image
                    var wide = isWide(w, h, $(this));
                    var tall = isTall(w, h, $(this));
                    if (wide) {
                        w = wide.newWidth;
                        bSize = wide.newbSize;
                    }
                    if (tall) {
                        h = tall.newHeight;
                        bSize = tall.newbSize;
                    }

                    // Cycle through the different placecage options
                    counter++;
                    result = imgCounter(counter);
                    imgType = result.imgType;
                    counter = result.counter

                    // Need to use cssText to use !important
                    newUrl = "background-image: url(" + placeholderSite + imgType + w + "/" + h + ") !important";
                    $(this).css({
                        'cssText' : newUrl,
                        'background-size' : bSize,
                        'background-repeat': 'repeat',
                        'background-position' : 'center center'
                    });
                    $(this).addClass('cagified-bg');
                }
            }
        });
    }

    // Replace iframes with youtube videos of nick cage

    function replaceIframes(){

        var w;
        var h;
        var newURL;
        var newIframe;
        var counter = 0;

        var iframe = document.getElementsByTagName("iframe");

        var youTubeVideos = ["https://www.youtube.com/embed/S73swRzxs8Y",
        "https://www.youtube.com/embed/e6i2WRreARo",
        "https://www.youtube.com/embed/k2OjJyR90DU"];

        for (var i = 0; i < iframe.length; i++) {

            //Cycle through different videos
            counter++;

            var counterResult = videoCounter(counter, youTubeVideos);
            newIframe = counterResult.type;
            counter = counterResult.counter;

            // if (counter == 1) {
            //     newIframe = youTubeVideos[0];
            // } else if (counter == 2 ){
            //     newIframe = youTubeVideos[1];
            // } else if (counter == 3 ){
            //     newIframe = youTubeVideos[2];
            //     counter = 0;
            // }

            iframe[i].setAttribute("src", newIframe);
        }
    }


    // Replace all 'video' elements with giphy videos of nick cage
    function replaceVideos() {

        var videos = document.getElementsByTagName("video");
        var newVideo;
        var counter = 0;

        var giphyVideos = ["https://media.giphy.com/media/LAhPbwzAsWzKw/giphy.mp4",
        "https://media.giphy.com/media/8JZkR2HiOCQbm/giphy.mp4",
        "https://media.giphy.com/media/PHHtPDk6peKyI/giphy.mp4",
        "https://media.giphy.com/media/Kbc2X7IHgyd7a/giphy.mp4",]

        for (var i = 0; i < videos.length; i++) {

            // Cycle through different videos
            counter++;
            if (counter == 1) {
                newVideo = giphyVideos[0];
            } else if (counter == 2 ){
                newVideo = giphyVideos[1];
            } else if (counter == 3 ){
                newVideo = giphyVideos[2];
            } else if (counter == 4 ){
                newVideo = giphyVideos[3];
                counter = 0;
            }

            // Clear any internal source elements, just in case
            videos[i].innerHTML = "";

            // Set video element src to giphy video
            videos[i].setAttribute('src', newVideo);
            videos[i].autoplay = true;
            videos[i].loop = true;

            // Reload and play new video, just in case
            videos[i].load();
            videos[i].play();
        }

    }

    // var testImage = new Image();
    // var hasNickCage;


    // testImage.onload = function () {
    //      console.info("Nick Cage is good to go!");
    //      hasNickCage = true;
    // }
    // testImage.onerror = function () {
    //      console.error("Cannot connect to placecage.com - abandon ship!");
    //      alert("Nick Cage is unavailable at the moment - please try again later!");
    //      hasNickCage = false;
    // }

    // testImage.src = "https://www.placecage.com/200/300";

    // If placecage is live, continue
    // setTimeout(function(){
    //     if (hasNickCage) {

    //         // Add classes to remove pseudo elements if needed
    //         var head = $('head');
    //         var newStyle = document.createElement("style");
    //         newStyle.innerHTML = '.kill-pseudo:before, .kill-pseudo:before  { content: none !important;}';
    //         head.append(newStyle);

    //         //Functions for checking if something is a tall or wide rectangle, which will be used for replacing background images
    //         function isWideRectangle (width, height, el)  {
    //             if ( width > height ) {
    //                 var calc = (height / width);
    //                 if (calc < 0.55) {
    //                     el.addClass('is-wide-rectangle'); //for me to check this is working
    //                     w = height;
    //                     bSize = w + 'px ' + height + 'px';
    //                     // console.log('wide bSize', bSize);
    //                     return {
    //                         newWidth: w,
    //                         newbSize: bSize
    //                     }
    //                 }
    //             }
    //         }

    //         function isTallRectangle (width, height, el)  {
    //             if ( height > width ) {
    //                 var calc = (width / height);
    //                 if (calc < 0.55) {
    //                     el.addClass('is-tall-rectangle'); //for me to check this is working
    //                     h = width;
    //                     bSize = width + 'px ' + h + 'px';
    //                     // console.log('tall bSize', bSize);
    //                     return {
    //                         newHeight: h,
    //                         newbSize: bSize
    //                     }
    //                 }
    //             }
    //         }

    //         /*********
    //         *****
    //         Replace all standard images with pictures of nick cage
    //         *****
    //         **********/

    //         //Add logic where if it's a rectangle to use a background image instead?

    //         (function(){
    //             var w;
    //             var h;
    //             var newURL;
    //             var imgType;
    //             var counter = 0;

    //             // var elements = document.getElementsByTagName("img");



    //             // for (var i = 0; i < elements.length; i++) {
    //             //   // Get width and height of the image, use floor to round down incase it's some weird decimal
    //             //   w = Math.floor(elements[i].clientWidth);
    //             //   h = Math.floor(elements[i].clientHeight);

    //             //   // If the image is 0 x 0 do nothing
    //             //   if ( (w >= 1) && (h >= 1) ) {
    //             //     counter++;

    //             //     // Cycle through the different placecage options
    //             //     if (counter == 1) {
    //             //       imgType = "";
    //             //     } else if (counter == 2 ){
    //             //       imgType = "g/";
    //             //     } else if (counter == 3 ){
    //             //       imgType = "c/";
    //             //     } else if (counter == 4 ){
    //             //       imgType = "gif/";
    //             //       counter = 0;
    //             //     }

    //             //     newUrl = placeholderSite + imgType + w + "/" + h;
    //             //     elements[i].setAttribute("src", newUrl);
    //             //     elements[i].setAttribute("srcset", newUrl);

    //             //   }

    //             //   // elements[i].className += " cagified";
    //             // }

    //             $('img').each(function(){
    //                 w = Math.floor($(this).outerWidth());
    //                 h = Math.floor($(this).outerHeight());

    //                 if ( (w >= 1) && (h >= 1) ) {
    //                     counter++;

    //                     // Cycle through the different placecage options
    //                     if (counter == 1) {
    //                         imgType = "";
    //                     } else if (counter == 2 ){
    //                         imgType = "g/";
    //                     } else if (counter == 3 ){
    //                         imgType = "c/";
    //                     } else if (counter == 4 ){
    //                         imgType = "gif/";
    //                         counter = 0;
    //                     }

    //                     //Get dimensions of current element so we can make sure those don't go away when removing its insides
    //                     var elWidth = 'width: ' + w + 'px;';
    //                     var elHeight = 'height: ' + h + 'px;';
    //                     // console.log('elWidth', elWidth, 'elHeight', elHeight);

    //                     var wide = isWideRectangle(w, h, $(this));
    //                     var tall = isTallRectangle(w, h, $(this));
    //                     if (wide) {
    //                         w = wide.newWidth;
    //                         var bSize = wide.newbSize;
    //                     }
    //                     if (tall) {
    //                         h = tall.newHeight;
    //                         var bSize = tall.newbSize;
    //                     }

    //                     // If a wide or tall rectangle was found, give the image a background image and take out the original image
    //                     if (wide || tall) {

    //                         newUrl = 'background-image: url("' + placeholderSite + imgType + w + '/' + h + '");';
    //                         var cssTextVar = elWidth + elHeight + newUrl;
    //                         $(this).css({
    //                             'display' : 'block',
    //                             'cssText': cssTextVar,
    //                             'background-size' : bSize,
    //                             'background-repeat' : 'repeat',
    //                             'background-position' : 'center center'
    //                         });
    //                         $(this).attr({
    //                             src : '',
    //                             alt : '',
    //                             title : ''
    //                         })
    //                         $(this).addClass('cagified-bg');
    //                     }
    //                     // If the image wasn't a wide or tall rectangle, just replace the image source
    //                     else {

    //                         newUrl = placeholderSite + imgType + w + "/" + h;
    //                         $(this).attr("src", newUrl);
    //                         $(this).attr("srcset", newUrl);
    //                     }

    //                 }

    //             });

    //         })();


    //         /*********
    //         *****
    //         Replace all background images with pictures of nick cage
    //         *****
    //         **********/

    //         (function(){

    //             var w;
    //             var h;
    //             var newURL;
    //             var imgType;
    //             var counter = 0;

    //             $('*').not('.cagified-bg').each(function(){
    //                 var bSize = 'cover';

    //                 // Check if the element has a background image
    //                 if ($(this).css('background-image') != 'none') {

    //                         //First, we need to get the width and height of the background image, depending on whether or not it's background-attachment fixed

    //                         //If the element doesn't have a fixed background image, get the width/height of the element itself
    //                         if ($(this).css('background-attachment') != 'fixed') {

    //                             $(this).addClass('not-fixed'); //for me to check this is working

    //                             // Get height of actual element
    //                             w = Math.floor($(this).outerWidth());
    //                             h = Math.floor($(this).outerHeight());

    //                         }
    //                         // If the background is fixed, get the width/height of the background image instead
    //                         else {
    //                             $(this).addClass('is-fixed');

    //                             // Get image url from property value by removing the beginning url(" and ending ") part of it.
    //                             image_url = $(this).css('background-image');
    //                             var end = image_url.length - 2;
    //                             image_url = image_url.substring(5,end);

    //                             // Make new image object and set its source to the background image so we can get its dimensions
    //                             image = new Image();
    //                             image.src = image_url;

    //                             // Set width and height to the background image's
    //                             w = Math.floor(image.width);
    //                             h = Math.floor(image.height);

    //                         }

    //                         // Check and make sure the image is not 0 x 0 before applying Nick
    //                         if ( (w >= 1) && (h >= 1) ) {

    //                             // Check to see if it's a wide/tall rectangle, if it is, tweak it so it will work as a tiled/repeating background image
    //                             var wide = isWideRectangle(w, h, $(this));
    //                             var tall = isTallRectangle(w, h, $(this));
    //                             if (wide) {
    //                                 w = wide.newWidth;
    //                                 bSize = wide.newbSize;
    //                             }
    //                             if (tall) {
    //                                 h = tall.newHeight;
    //                                 bSize = tall.newbSize;
    //                             }

    //                             counter++;

    //                             if (counter == 1) {
    //                                 imgType = "";
    //                             } else if (counter == 2 ){
    //                                 imgType = "g/";
    //                             } else if (counter == 3 ){
    //                                 imgType = "c/";
    //                             } else if (counter == 4 ){
    //                                 imgType = "gif/";
    //                                 counter = 0;
    //                             }

    //                             // Need to use cssText to use !important
    //                             newUrl = "background-image: url(" + placeholderSite + imgType + w + "/" + h + ") !important";
    //                             $(this).css({
    //                                 'cssText' : newUrl,
    //                                 'background-size' : bSize,
    //                                 'background-repeat': 'repeat',
    //                                 'background-position' : 'center center'
    //                             });
    //                             $(this).addClass('cagified-bg');
    //                         }
    //                 }
    //             });
    //         })();


    //         // /*********
    //         // *****
    //         // Replace all 'iframe' elements with youtube videos of nick cage
    //         // *****
    //         // **********/


    //         (function(){

    //             var w;
    //             var h;
    //             var newURL;
    //             var newIframe;
    //             var counter = 0;

    //             var iframe = document.getElementsByTagName("iframe");

    //             var youTubeVideos = ["https://www.youtube.com/embed/S73swRzxs8Y",
    //             "https://www.youtube.com/embed/e6i2WRreARo",
    //             "https://www.youtube.com/embed/k2OjJyR90DU"];

    //             for (var i = 0; i < iframe.length; i++) {

    //                 //Cycle through different videos
    //                 counter++;
    //                 if (counter == 1) {
    //                     newIframe = youTubeVideos[0];
    //                 } else if (counter == 2 ){
    //                     newIframe = youTubeVideos[1];
    //                 } else if (counter == 3 ){
    //                     newIframe = youTubeVideos[2];
    //                     counter = 0;
    //                 }

    //                 iframe[i].setAttribute("src", newIframe);
    //             }

    //         })();

    //         /*********
    //         *****
    //         Replace all 'video' elements with giphy videos of nick cage
    //         *****
    //         **********/

    //         (function(){

    //             var videos = document.getElementsByTagName("video");
    //             var newVideo;
    //             var counter = 0;

    //             var giphyVideos = ["https://media.giphy.com/media/LAhPbwzAsWzKw/giphy.mp4",
    //             "https://media.giphy.com/media/8JZkR2HiOCQbm/giphy.mp4",
    //             "https://media.giphy.com/media/PHHtPDk6peKyI/giphy.mp4",
    //             "https://media.giphy.com/media/Kbc2X7IHgyd7a/giphy.mp4",]

    //             for (var i = 0; i < videos.length; i++) {

    //                 // Cycle through different videos
    //                 counter++;
    //                 if (counter == 1) {
    //                     newVideo = giphyVideos[0];
    //                 } else if (counter == 2 ){
    //                     newVideo = giphyVideos[1];
    //                 } else if (counter == 3 ){
    //                     newVideo = giphyVideos[2];
    //                 } else if (counter == 4 ){
    //                     newVideo = giphyVideos[3];
    //                     counter = 0;
    //                 }

    //                 // Clear any internal source elements, just in case
    //                 videos[i].innerHTML = "";

    //                 // Set video element src to giphy video
    //                 videos[i].setAttribute('src', newVideo);
    //                 videos[i].autoplay = true;
    //                 videos[i].loop = true;

    //                 // Reload and play new video, just in case
    //                 videos[i].load();
    //                 videos[i].play();
    //             }

    //         })();

    //         /*********
    //         *****
    //         Replace all 'svg' elements with images of nick cage.
    //         Note this is best done with a background image.
    //         *****
    //         **********/

    //         (function(){

    //             var w;
    //             var h;
    //             var newURL;
    //             var counter = 0;

    //             $('svg').each(function(){
    //                 var bSize = 'cover';
    //                 var svg = $(this);

    //                 // Get dimensions of current svg
    //                 w = Math.floor(svg.width());
    //                 h = Math.floor(svg.height());

    //                 // If the dimensions are 0 x 0 do nothing
    //                 if ( (w >= 1) && (h >= 1) ) {

    //                     //Get dimensions of current element so we can make sure those don't go away when removing its insides
    //                     elWidth = 'width: ' + w + 'px !important; ';
    //                     elHeight = 'height: ' + h + 'px !important; ';

    //                     // Check to see if it's a wide/tall rectangle, if it is, tweak it so it will work as a tiled/repeating background image
    //                     var wide = isWideRectangle(w, h, $(this));
    //                     var tall = isTallRectangle(w, h, $(this));
    //                     if (wide) {
    //                         w = wide.newWidth;
    //                         bSize = wide.newbSize;
    //                     }
    //                     if (tall) {
    //                         h = tall.newHeight;
    //                         bSize = tall.newbSize;
    //                     }

    //                     counter++;

    //                     if (counter == 1) {
    //                         imgType = "";
    //                     } else if (counter == 2 ){
    //                         imgType = "g/";
    //                     } else if (counter == 3 ){
    //                         imgType = "c/";
    //                     } else if (counter == 4 ){
    //                         imgType = "gif/";
    //                         counter = 0;
    //                     }

    //                     newUrl = "background-image: url(" + placeholderSite + imgType + w + "/" + h + ") !important";

    //                     // Need to use cssText to use !important
    //                     var cssText = elWidth + elHeight + newUrl;

    //                     // svg.width(elWidth);
    //                     svg.css({
    //                         'cssText' : cssText,
    //                         'display' : 'block',
    //                         'background-size' : bSize,
    //                         'background-position' : 'center center'
    //                     });
    //                     // Clear svg in case it contains anything
    //                     svg.empty();

    //                 }

    //             });


    //         })();

    //         /*********
    //         *****
    //         Replace all 'i' elements (normally used for icon fonts) with images of nick cage.
    //         Note this is best done with a background image.
    //         *****
    //         **********/

    //         (function(){

    //             // var icons = document.getElementsByTagName("i");

    //             // for (var i = 0; i < icons.length; i++) {
    //             //   w = icons[i].clientWidth; // Get width of image
    //             //   h = icons[i].clientHeight; // Get height of image
    //             //   console.log('width: ' + w + ', height: ' + h);
    //             // }

    //             var w;
    //             var h;
    //             var newURL;
    //             var imgType;
    //             var counter = 0;

    //             $('i').each(function(){
    //                 w = Math.floor($(this).width());
    //                 h = Math.floor($(this).height());

    //                 // If the dimensions are 0 x 0 do nothing
    //                 if ( (w >= 1) && (h >= 1) ) {
    //                     w2 = w + 'px'
    //                     h2 = h + 'px'

    //                     // console.log('width: ' + w + ', height: ' + h);

    //                     counter++;

    //                     if (counter == 1) {
    //                         imgType = "";
    //                     } else if (counter == 2 ){
    //                         imgType = "g/";
    //                     } else if (counter == 3 ){
    //                         imgType = "c/";
    //                     } else if (counter == 4 ){
    //                         imgType = "gif/";
    //                         counter = 0;
    //                     }

    //                     newUrl = "url(" + placeholderSite + imgType + w + "/" + h + ")";

    //                     $(this).css({
    //                         'display' : 'inline-block',
    //                         'background-image' : newUrl,
    //                         'width': w2,
    //                         'height': h2,
    //                     });

    //                     $(this).addClass('kill-pseudo');
    //                 }



    //             });
    //         })();

    //         /*********
    //         *****
    //         Replace all psuedo elements background images' with images of nick cage.
    //         *****
    //         **********/

    //         (function(){

    //             var w;
    //             var h;
    //             var newURL;
    //             var imgType;
    //             var beforeCounter = 0;
    //             var afterCounter = 0;
    //             var counter = 0;
    //             var newRules = [];
    //             var foundPseudo = false;

    //             $('*').each(function(){
    //                 // This counter is used for the custom class names for each element
    //                 counter++;

    //                 // Use these to find elements that have a pseudo element with a background image
    //                 var before = window.getComputedStyle($(this)[0], ':before');
    //                 var beforeImage = before.getPropertyValue('background-image');
    //                 // var beforeContent = before.getPropertyValue('content');
    //                 var beforeContent = JSON.stringify(before.getPropertyValue('content'));
    //                 console.log(beforeContent);


    //                 var after = window.getComputedStyle($(this)[0], ':after');
    //                 var afterImage = after.getPropertyValue('background-image');
    //                 // var afterContent = "\\" + after.getPropertyValue('content');
    //                 // var afterContent = JSON.stringify(after.getPropertyValue('content'));
    //                 // var afterContent = encodeURI("\f2b1");
    //                 // JSON.stringify(str)

    //                 // var afterIsIcon = /^\\[a-zA-Z]/.test(afterContent);

    //                 // For if they have a :before with a background-image
    //                 if (beforeImage != "none" ) {
    //                     beforeCounter++;

    //                     //Get pseudo's dimensions for url
    //                     var beforeWidthPx = before.getPropertyValue('width');
    //                     var beforeWidth = beforeWidthPx.replace('px', '');
    //                     var beforeWidthClean = parseInt(beforeWidth);
    //                     var beforeWidthPxClean = beforeWidthClean + "px";
    //                     // console.log('after:', beforeWidthPx, beforeWidth, beforeWidthClean, beforeWidthPxClean);
    //                     var beforeHeightPx = before.getPropertyValue('height');
    //                     var beforeHeight = beforeHeightPx.replace('px', '');
    //                     var beforeHeightClean = parseInt(beforeHeight);
    //                     var beforeHeightPxClean = beforeHeightClean + "px";

    //                     if (beforeCounter == 1) {
    //                         imgType = "";
    //                     } else if (beforeCounter == 2 ){
    //                         imgType = "g/";
    //                     } else if (beforeCounter == 3 ){
    //                         imgType = "c/";
    //                     } else if (beforeCounter == 4 ){
    //                         imgType = "gif/";
    //                         beforeCounter = 0;
    //                     }

    //                     newUrl = "url(" + placeholderSite + imgType + beforeWidthClean + "/" + beforeHeightClean + ")";

    //                     // Add new rule and class for new image styles
    //                     var beforeClass = 'pseudo-before-BG-' + counter;
    //                     var beforeRule = '.' + beforeClass + ':before { background-image: ' + newUrl + ' !important; }';
    //                     $(this).addClass(beforeClass);
    //                     newRules.push(beforeRule);

    //                     // Set this to true to trigger adding new style element after this each loop if we found an applicable pseudo
    //                     foundPseudo = true;

    //                 }

    //                 // For if they have an :after with a background-image
    //                 if (afterImage != "none" ) {
    //                     // console.log(typeof(afterContent), afterContent, afterIsIcon);
    //                     afterCounter++;

    //                     //Get pseudo's dimensions for url
    //                     var afterWidthPx = after.getPropertyValue('width');
    //                     var afterWidth = afterWidthPx.replace('px', '');
    //                     var afterWidthClean = parseInt(afterWidth);
    //                     var afterWidthPxClean = afterWidthClean + "px";
    //                     // console.log('after:', afterWidthPx, afterWidth, afterWidthClean, afterWidthPxClean);
    //                     var afterHeightPx = after.getPropertyValue('height');
    //                     var afterHeight = afterHeightPx.replace('px', '');
    //                     var afterHeightClean = parseInt(afterHeight);
    //                     var afterHeightPxClean = afterHeightClean + "px";

    //                     if (afterCounter == 1) {
    //                         imgType = "";
    //                     } else if (afterCounter == 2 ){
    //                         imgType = "g/";
    //                     } else if (afterCounter == 3 ){
    //                         imgType = "c/";
    //                     } else if (afterCounter == 4 ){
    //                         imgType = "gif/";
    //                         afterCounter = 0;
    //                     }

    //                     newUrl = "url(" + placeholderSite + imgType + afterWidth + "/" + afterHeight + ")";

    //                     // Add new rule and class for new image styles
    //                     var afterClass = 'pseudo-after-BG-' + counter;
    //                     var afterRule = '.' + afterClass + ':after { background-image: ' + newUrl + ' !important; background-size: cover !important; }';
    //                     $(this).addClass(afterClass);
    //                     newRules.push(afterRule);

    //                     // Set this to true to trigger adding new style element after this each loop if we found an applicable pseudo
    //                     foundPseudo = true;
    //                 }


    //             });

    //             // If we found a pseudo with a background-image add the new style element with the rules to replace it's image
    //             if (foundPseudo) {
    //                 var newRulesTogether = newRules.join(' ');
    //                 var newStyle = document.createElement("style");
    //                 newStyle.innerHTML = newRulesTogether;
    //                 head.append(newStyle);
    //             }

    //         })();

    //         console.log('All done, enjoy your Nick');

    //     } // end if
    // }, 25); // end timeout


});