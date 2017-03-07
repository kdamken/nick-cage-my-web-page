$(document).ready(function(){

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
        var listLength = list.length;

        video = list[counter - 1];

        // if the counter is the same as the length of the list, reset it
        if (counter === listLength) {
            counter = 0;
        }

        return {
            video: video,
            counter: counter
        }
    }

    function isWideOrTallRectangle (width, height, el)  {
        var backgroundSize;
        var calc;
        var height;
        var width;
        var magicNumber = 0.55;
        // console.log('checking if tall or wide rectangle');

        // check if element's width is longer than height
        if ( width > height ) {
            calc = (height / width);
            // check to see if the ratio is below the magic number
            if (calc < magicNumber) {
                // console.log('wide rectangle');
                // add class to check this is working
                el.addClass('is-wide-rectangle');
                // set width equal to height so we get a square image below
                width = height;
                backgroundSize = width + 'px ' + height + 'px';
                return {
                    wideOrTall: "wide",
                    newWidth: width,
                    newBackgroundSize: backgroundSize
                }
            } else {
                // console.log('not very wide')
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
                // console.log('tall rectangle');
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
                // console.log('not very tall')
                return {
                    wideOrTall: false
                }
            }
        }
        // if the height and the width are the same
        else {
            // console.log('not tall or wide')
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
            // where the magic happens
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

        replaceAllElements();

        // replaceImages();
        replaceBackgroundImages();
        replaceIframes();
        replaceVideos();
        replaceSVGs();
        replaceIElements();
        // need i replace
        // need psuedo replace
        // need embed replace
    }

    /**************************************************
    Functions for finding and replacing elements
    **************************************************/

    function replaceAllElements() {
        var elementCounter = 0;
         $('*').each(function(){
            elementCounter++;
            var _this = $(this);
            if (_this.is('img')) {
                console.log(_this, 'is image');
                replaceImages2(_this);
            } else if (_this.is('iframe')) {
                // console.log(_this, 'is iframe');

            } else if (_this.is('video')) {
                // console.log(_this, 'is video element');

            } else if (_this.is('svg')) {
                // console.log(_this, 'is svg');

            } else if (_this.is('i')) {
                // console.log(_this, 'is i element');

            } else {
                // console.log(_this, 'other thing');

            }
         });

         console.log('elements on page', elementCounter);
    }

    function replaceImages2(_this) {
        console.log(_this);
        var height;
        var imgType;
        var newURL;
        var width;

        var counter = 0;

        var width = Math.floor(_this.outerWidth());
        var height = Math.floor(_this.outerHeight());
        var backgroundSize;

        // console.log('element width: ', width, 'element height: ', height);

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
            // console.log('widthString: ', widthString, 'heightString: ', heightString);

            // Check if the element is very wide or very tall. if it is, set new dimensions as needed so we can add a tiled background image
            var isWideOrTall = isWideOrTallRectangle(width, height, _this);
            // console.log('isWideOrTall: ', isWideOrTall);

            if (isWideOrTall.wideOrTall === "wide") {
                width = isWideOrTall.newWidth;
                backgroundSize = isWideOrTall.newBackgroundSize;
            } else if (isWideOrTall.wideOrTall === "tall") {
                height = isWideOrTall.newHeight;
                backgroundSize = isWideOrTall.newBackgroundSize;
            }

            // If a wide or tall rectangle was found, give the image a tiled background image and take out the original image
            if (isWideOrTall.wideOrTall) {
                // create url for new image
                newUrl = 'background-image: url("' + settings.placeholderSite + imgType + width + '/' + height + '");';
                // combine image url with height and width rules to use in cssText
                var cssTextVar = widthString + heightString + newUrl;
                _this.css({
                    'display' : 'block',
                    'cssText': cssTextVar,
                    'background-size' : backgroundSize,
                    'background-repeat' : 'repeat',
                    'background-position' : 'center center'
                });
                // remove inline image attributes
                _this.attr({
                    src : '',
                    alt : '',
                    title : ''
                })
                // add classes to see it was changed
                _this.addClass('cagified-bg cagified-bg--image');
            }
            // If the image wasn't a wide or tall rectangle, just replace the image source
            else {
                newUrl = settings.placeholderSite + imgType + width + "/" + height;
                _this.attr("src", newUrl);
                _this.attr("srcset", newUrl);
            }

        }
    }

    // Replace all standard images with pictures of nick cage
    function replaceImages() {
        var height;
        var imgType;
        var newURL;
        var width;

        var counter = 0;

        // check every image element on the page
        $('img').each(function(){
            // get the dimensions of the image
            var width = Math.floor($(this).outerWidth());
            var height = Math.floor($(this).outerHeight());
            var backgroundSize;

            // console.log('element width: ', width, 'element height: ', height);

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
                // console.log('widthString: ', widthString, 'heightString: ', heightString);

                // Check if the element is very wide or very tall. if it is, set new dimensions as needed so we can add a tiled background image
                var isWideOrTall = isWideOrTallRectangle(width, height, $(this));
                // console.log('isWideOrTall: ', isWideOrTall);

                if (isWideOrTall.wideOrTall === "wide") {
                    width = isWideOrTall.newWidth;
                    backgroundSize = isWideOrTall.newBackgroundSize;
                } else if (isWideOrTall.wideOrTall === "tall") {
                    height = isWideOrTall.newHeight;
                    backgroundSize = isWideOrTall.newBackgroundSize;
                }

                // If a wide or tall rectangle was found, give the image a tiled background image and take out the original image
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
                    // remove inline image attributes
                    $(this).attr({
                        src : '',
                        alt : '',
                        title : ''
                    })
                    // add classes to see it was changed
                    $(this).addClass('cagified-bg cagified-bg--image');
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
    function replaceBackgroundImages() {
        var imgType;
        var counter = 0;

        // Check every element that's not a video, iframe or image on the page and see if it has a background image
        $('*').not('.cagified-bg', 'video', 'iframe', 'img', 'svg', 'i').each(function(){
            var backgroundSize = 'cover';
            var height;
            var imageUrl;
            var newURL;
            var width;

            // Check if the element has a background image
            if ($(this).css('background-image') !== 'none') {
                // console.log('has background image');

                //First, we need to get the width and height of the background image, depending on whether or not it's background-attachment fixed

                //If the element doesn't have a fixed background image, get the width/height of the element itself
                if ($(this).css('background-attachment') !== 'fixed') {

                    //for me to check this is working
                    $(this).addClass('not-fixed');
                    // console.log('is not fixed');

                    // Get height of actual element
                    width = Math.floor($(this).outerWidth());
                    height = Math.floor($(this).outerHeight());

                }

                // If the background is fixed, get the width/height of the background image instead because we'll need to replace that
                else {

                    //for me to check this is working
                    $(this).addClass('is-fixed');
                    // console.log('is fixed');

                    // Get image url from property value by removing the beginning url(" and ending ") part of it.
                    imageUrl = $(this).css('background-image');
                    var end = imageUrl.length - 2;
                    imageUrl = imageUrl.substring(5,end);
                    console.log('imageUrl', imageUrl)

                    // Make new image object and set its source to the background image so we can get its dimensions
                    image = new Image();
                    image.src = imageUrl;

                    // Set width and height to the background image's
                    width = Math.floor(image.width);
                    height = Math.floor(image.height);
                    console.log('width', width, 'height', height);

                }

                // Check and make sure the image is not 0 x 0 before applying Nick
                if ( (width >= 1) && (height >= 1) ) {

                    // If the background image isn't fixed, check if the element is very wide or very tall. if it is, set new dimensions as needed so we can add a tiled background image
                    if (!$(this).hasClass('is-fixed')) {
                        var isWideOrTall = isWideOrTallRectangle(width, height, $(this));
                        // console.log('isWideOrTall: ', isWideOrTall);

                        if (isWideOrTall.wideOrTall === "wide") {
                            width = isWideOrTall.newWidth;
                            backgroundSize = isWideOrTall.newBackgroundSize;
                        } else if (isWideOrTall.wideOrTall === "tall") {
                            height = isWideOrTall.newHeight;
                            backgroundSize = isWideOrTall.newBackgroundSize;
                        }
                    }

                    // Cycle through the different placecage options
                    counter++;
                    result = imgCounter(counter);
                    imgType = result.imgType;
                    counter = result.counter

                    // Need to use cssText to use !important
                    newUrl = "background-image: url(" + settings.placeholderSite + imgType + width + "/" + height + ") !important";
                    $(this).css({
                        'cssText' : newUrl,
                        'background-size' : backgroundSize,
                        'background-repeat': 'repeat',
                        'background-position' : 'center center'
                    });
                    // add classes to see it was changed
                    $(this).addClass('cagified-bg cagified-bg--bg-image');
                }
            }
        });
    }

    // Replace iframes with youtube video embeds of nick cage
    function replaceIframes() {

        var counterResult;
        var newIframe;

        var counter = 0;
        var iframes = document.getElementsByTagName("iframe");

        var youTubeVideos = ["https://www.youtube.com/embed/S73swRzxs8Y",
        "https://www.youtube.com/embed/e6i2WRreARo",
        "https://www.youtube.com/embed/A23TuxKex_w"];

        for (var i = 0; i < iframes.length; i++) {

            //Cycle through different videos
            counter++;

            counterResult = videoCounter(counter, youTubeVideos);
            newIframe = counterResult.video;
            counter = counterResult.counter;

            iframes[i].setAttribute("src", newIframe);
        }
    }


    // Replace all 'video' elements with giphy videos of nick cage
    function replaceVideos() {

        var counterResult;
        var newVideo;

        var counter = 0;
        var videos = document.getElementsByTagName("video");

        var giphyVideos = ["https://media.giphy.com/media/LAhPbwzAsWzKw/giphy.mp4",
        "https://media.giphy.com/media/8JZkR2HiOCQbm/giphy.mp4",
        "https://media.giphy.com/media/PHHtPDk6peKyI/giphy.mp4",
        "https://media.giphy.com/media/Kbc2X7IHgyd7a/giphy.mp4",]

        for (var i = 0; i < videos.length; i++) {

            //Cycle through different videos
            counter++;

            counterResult = videoCounter(counter, giphyVideos);
            newVideo = counterResult.video;
            counter = counterResult.counter;

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

    // Replace all 'svg' elements with images of nick cage. Note this is best done with a background image.
    function replaceSVGs() {
        var imgType;
        var counter = 0;

        $('svg').each(function(){

            var newURL;

            // get dimensions of current svg
            var width = Math.floor($(this).outerWidth());
            var height = Math.floor($(this).outerHeight());
            var backgroundSize = 'cover';

            // If the dimensions are 0 x 0 do nothing
            if ( (width >= 1) && (height >= 1) ) {

                // Set up dimensions of current element as strings to be used for css rules later
                var widthString = 'width: ' + width + 'px !important; ';
                var heightString = 'height: ' + height + 'px !important; ';
                // console.log('widthString: ', widthString, 'heightString: ', heightString);

                // Check if the element is very wide or very tall. if it is, set new dimensions as needed so we can add a tiled background image
                var isWideOrTall = isWideOrTallRectangle(width, height, $(this));
                // console.log('isWideOrTall: ', isWideOrTall);

                if (isWideOrTall.wideOrTall === "wide") {
                    width = isWideOrTall.newWidth;
                    backgroundSize = isWideOrTall.newBackgroundSize;
                } else if (isWideOrTall.wideOrTall === "tall") {
                    height = isWideOrTall.newHeight;
                    backgroundSize = isWideOrTall.newBackgroundSize;
                }

                // Cycle through the different placecage options
                counter++;
                result = imgCounter(counter);
                imgType = result.imgType;
                counter = result.counter;

                // Need to use cssText to use !important
                newUrl = "background-image: url(" + settings.placeholderSite + imgType + width + "/" + height + ") !important";

                // combine image url with height and width rules to use in cssText
                var cssTextVar = widthString + heightString + newUrl;
                $(this).css({
                    'cssText' : cssTextVar,
                    'background-size' : backgroundSize,
                    'background-repeat': 'repeat',
                    'background-position' : 'center center'
                });

                // add classes to see it was changed
                $(this).addClass('cagified-bg cagified-bg--svg');

                // clear svg in case it contains anything
                $(this).empty();
            }

        });
    }

    function replaceIElements() {
        var imgType;
        var counter = 0;

        $('i').each(function(){

            var newURL;

            // get dimensions of current svg
            var width = Math.floor($(this).outerWidth());
            var height = Math.floor($(this).outerHeight());
            var backgroundSize = 'cover';

            // If the dimensions are 0 x 0 do nothing
            if ( (width >= 1) && (height >= 1) ) {

                // Set up dimensions of current element as strings to be used for css rules later
                var widthString = 'width: ' + width + 'px !important; ';
                var heightString = 'height: ' + height + 'px !important; ';
                // console.log('widthString: ', widthString, 'heightString: ', heightString);

                // Check if the element is very wide or very tall. if it is, set new dimensions as needed so we can add a tiled background image
                var isWideOrTall = isWideOrTallRectangle(width, height, $(this));
                // console.log('isWideOrTall: ', isWideOrTall);

                if (isWideOrTall.wideOrTall === "wide") {
                    width = isWideOrTall.newWidth;
                    backgroundSize = isWideOrTall.newBackgroundSize;
                } else if (isWideOrTall.wideOrTall === "tall") {
                    height = isWideOrTall.newHeight;
                    backgroundSize = isWideOrTall.newBackgroundSize;
                }

                // Cycle through the different placecage options
                counter++;
                result = imgCounter(counter);
                imgType = result.imgType;
                counter = result.counter;

                // Need to use cssText to use !important
                newUrl = "background-image: url(" + settings.placeholderSite + imgType + width + "/" + height + ") !important";
                // combine image url with height and width rules to use in cssText
                var cssTextVar = widthString + heightString + newUrl;
                $(this).css({
                    'cssText' : cssTextVar,
                    'background-size' : backgroundSize,
                    'background-repeat': 'repeat',
                    'background-position' : 'center center'
                });

                // add classes to see it was changed
                $(this).addClass('cagified-bg cagified-bg--i-element');

                // remove all pseudo elements from it, as this is how font icons usually work
                $(this).addClass('kill-pseudo');
            }

        });
    }

    // ADD FUNCTION for replacing pseudo elements from old code commented out in other file
    // ADD FUNCTION for replacing embed elements from old code commented out in other file

});