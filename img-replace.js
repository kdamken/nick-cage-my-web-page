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

    var settings = {};
    settings.placeholderSite = '//www.placecage.com/';

    /**************************************************
    Helper functions
    **************************************************/

    // handles the extension to provide the different varieties of image type urls during the loop
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

    // handles the extension to provide the different varieties of image type urls during the loop
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

    function isWideOrTallRectangle (width, height, el)  {
        var backgroundSize;
        var calc;
        var height;
        var width;
        var magicNumber = 0.55;
        console.log('checking if tall or wide rectangle');

        // check if element's width is longer than height
        if ( width > height ) {
            calc = (height / width);
            // check to see if the ratio is below the magic number
            if (calc < magicNumber) {
                console.log('wide rectangle');
                // add class to check this is working
                el.addClass('is-wide-rectangle');
                // set width equal to height so we get a square image below
                width = height;
                backgroundSize = width + 'px ' + height + 'px';
                return {
                    wideOrTall: "wide",
                    newWidth: w,
                    newBackgroundSize: backgroundSize
                }
            } else {
                console.log('not tall or wide')
                return {
                    wideOrTall: false
                }
            }
        }
        // check if the element's height is bigger than it's width
        else if ( height > width ) {
            calc = (width / height);
            // check to see if the ratio is below the magic number
            if (calc < magicNumber) {
                console.log('tall rectangle');
                // add class to check this is working
                el.addClass('is-tall-rectangle');
                // set height equal to width so we get a square image below
                height = width;
                backgroundSize = width + 'px ' + height + 'px';
                return {
                    wideOrTall: "tall",
                    newHeight: height,
                    newBackgroundSize: backgroundSize
                }
            } else {
                return {
                    wideOrTall: false
                }
            }
        }
        // if the height and the width are the same
        else {
            console.log('not tall or wide')
            return {
                wideOrTall: false
            }
        }
    }


    /**************************************************
    Testing site is up and initialization
    **************************************************/

    // test to see if website is up, and then init everything else
    function testCage() {
        //Check for image working
        var testImage = new Image();

        // Only runs on load
        function onloadHandler(){
            console.log('Loaded initNick');
            console.info("Nick Cage is ready!");
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

        // console.log('End of testCage');
    }

    // Initiate nick cage testing and initialization if the site is up
    testCage();


    // function that intiializes all the find and replace functions
    function initNick() {

        // Add classes to remove pseudo elements if needed
        var head = $('head');
        var newStyle = document.createElement("style");
        newStyle.innerHTML = '.kill-pseudo:before, .kill-pseudo:before  { content: none !important;}';
        head.append(newStyle);

        //combine into one function? makes more sense, we're running two functions on everything for no reason

        //Functions for checking if an element is a very tall or wide rectangle, which will use a repeating background images when that would look best
        // function isWideRectangle (width, height, el)  {
        //     var calc;
        //     console.log('wide1 rectangle');

        //     if ( width > height ) {
        //         console.log('wide rectangle');
        //         calc = (height / width);
        //         if (calc < 0.55) {
        //             el.addClass('is-wide-rectangle'); //for me to check this is working
        //             width = height;
        //             backgroundSize = width + 'px ' + height + 'px';
        //             // console.log('wide bSize', bSize);
        //             return {
        //                 newWidth: width,
        //                 newbSize: backgroundSize
        //             }
        //         }
        //     }
        // }

        // function isTallRectangle (width, height, el)  {
        //     var calc;
        //     console.log('tall1 rectangle');

        //     // if the element's height is bigger than it's width
        //     if ( height > width ) {
        //         console.log('tall rectangle');
        //         // check to see if the ratio is below the magic number
        //         calc = (width / height);
        //         if (calc < 0.55) {
        //             // add class to check this is working
        //             el.addClass('is-tall-rectangle');
        //             // set height equal to width so we get a square image below
        //             height = width;
        //             backgroundSize = width + 'px ' + height + 'px';
        //             // console.log('tall bSize', bSize);
        //             return {
        //                 newHeight: height,
        //                 newbSize: backgroundSize
        //             }
        //         }
        //     }
        // }

        replaceImages(isWideRectangle, isTallRectangle, imgCounter);
        replaceBackgroundImages(isWideRectangle, isTallRectangle, imgCounter);
        // replaceIframes(videoCounter);
        // need psuedo replace
        // need video replace
    }

    /**************************************************
    Functions for finding and replacing elements
    **************************************************/

    // Replace all standard images with pictures of nick cage
    function replaceImages(isWide, isTall, imgCounter) {
        // var w;
        // var h;
        var width;
        var height;
        var newURL;
        var imgType;


        var counter = 0;

        // check every image element on the page
        $('img').each(function(){
            // get the dimensions of the image
            var width = Math.floor($(this).outerWidth());
            var height = Math.floor($(this).outerHeight());
            var backgroundSize;

            console.log('element width: ', width, 'element height: ', height);

            // check if the image is bigger than 1 x 1 pixels
            if ( (width >= 1) && (height >= 1) ) {

                // Cycle through the different placecage options
                counter++;
                result = imgCounter(counter);
                imgType = result.imgType;
                counter = result.counter

                // Set up dimensions of current element as strings to be used for css rules later
                var widthString = 'width: ' + width + 'px;';
                var heightString = 'height: ' + height + 'px;';
                console.log('widthString: ', widthString, 'heightString: ', heightString);

                // check if the element is very wide or very tall. if it is, set new dimensions as needed
                // var wide = isWide(width, height, $(this));
                // var tall = isTall(width, height, $(this));
                var isWideOrTall = isWideOrTallRectangle(width, height, $(this));
                console.log('isWideOrTall: ', isWideOrTall);

                // not good error checking?
                // if (wide) {
                //     width = wide.newWidth;
                //     backgroundSize = wide.newbSize;
                // }
                // if (tall) {
                //     height = tall.newHeight;
                //     backgroundSize = tall.newbSize;
                // }

                if (isWideOrTall.wideOrTall === "wide") {
                    width = isWideOrTall.newWidth;
                    backgroundSize = isWideOrTall.newBackgroundSize;
                } else if (isWideOrTall.wideOrTall === "tall") {
                    height = isWideOrTall.newHeight;
                    backgroundSize = isWideOrTall.newBackgroundSize;
                }

                // If a wide or tall rectangle was found, give the image a background image and take out the original image
                if (isWideOrTall.wideOrTall) {
                    // create url for new image
                    newUrl = 'background-image: url("' + settings.placeholderSite + imgType + width + '/' + height + '");';
                    // combine image url with height and width rules to use in cssText
                    var cssTextVar = widthString + heightString + newUrl;
                    $(this).css({
                        'display' : 'block',
                        'cssText': cssTextVar,
                        'background-size' : backgroundSize,
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
                    newUrl = settings.placeholderSite + imgType + width + "/" + height;
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

        // check every element on the page and see if it has a background image

        // IGNORE IMAGES, VIDEOS AND IFRAMES??????
        // ^^DFJA LKJF ALKDHG LDG LJDH LADJFKHG

        $('*').not('.cagified-bg').each(function(){
            var bSize = 'cover';

            // Check if the element has a background image
            if ($(this).css('background-image') !== 'none') {

                //First, we need to get the width and height of the background image, depending on whether or not it's background-attachment fixed

                //If the element doesn't have a fixed background image, get the width/height of the element itself
                if ($(this).css('background-attachment') !== 'fixed') {

                    $(this).addClass('not-fixed'); //for me to check this is working

                    // Get height of actual element
                    w = Math.floor($(this).outerWidth());
                    h = Math.floor($(this).outerHeight());

                }

                // If the background is fixed, get the width/height of the background image instead because we'll need to replace that
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
                    newUrl = "background-image: url(" + settings.placeholderSite + imgType + w + "/" + h + ") !important";
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

    // Replace iframes with youtube video embeds of nick cage
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

    // ADD FUNTION for replacing pseudo elements from old code commented out in other file

});