$(document).ready(function(){

    var settings = {};

    // check if we're on localhost/a file or a live site
    var currentUrl = window.location.href;
    if (currentUrl.includes("file://") || currentUrl.includes("localhost")) {
        // console.log('On localhost or file');
        settings.placeholderSite = 'http://www.placecage.com/';
    } else {
        // console.log('On live site');
        settings.placeholderSite = '//www.placecage.com/';
    }

    /**************************************************
    Helper functions
    **************************************************/

    // provide the different varieties of image type urls during the loop based on the counter
    function imgCounter(counter) {
        var imgType;

        if (counter == 1 || counter == 0) {
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

    // takes a list and provides a different item in it based on the counter
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

    // checks whether the picture/element is very wide or tall, which helps determine whether a repeating background image will be used
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
    function testAndInitCage() {
        //Check for image working
        var testImage = new Image();

        // Only runs on load
        function onloadHandler(){
            console.info("Nick Cage is ready!");
            // where the magic happens
            replaceAllElements();
        }

        // Only runs on error
        function onerrorHandler(){
            console.error("Cannot connect to placecage.com - abandon ship!");
            alert("Nick Cage is unavailable at the moment - please try again later!");
        }

        testImage.onload = onloadHandler;
        testImage.onerror = onerrorHandler;

        testImage.src = "https://www.placecage.com/200/300";

        // console.log('End of testCage');
    }

    // Initiate nick cage testing and initialization if the site is up
    testAndInitCage();

    /**************************************************
    Functions for finding and replacing elements
    **************************************************/

    function replaceAllElements() {

        // Set up object for all our counters
        var counters = {};
        counters.totalElements = 0;
        counters.backgroundImages = 0;
        counters.images = 0;
        counters.iframes = 0;
        counters.videos = 0;
        counters.svgs = 0;
        counters.iElements = 0;
        counters.pseudoElementsBefore = 0;
        counters.pseudoElementsBeforeTotal = 0;
        counters.pseudoElementsAfter = 0;
        counters.pseudoElementsAfterTotal = 0;

        // list for replacing iframes and embeds
        var iframeVideos = ["https://www.youtube.com/embed/S73swRzxs8Y",
        "https://www.youtube.com/embed/e6i2WRreARo",
        "https://www.youtube.com/embed/A23TuxKex_w"];

        // list for replacing video elements
        var giphyVideos = ["https://media.giphy.com/media/LAhPbwzAsWzKw/giphy.mp4",
        "https://media.giphy.com/media/8JZkR2HiOCQbm/giphy.mp4",
        "https://media.giphy.com/media/PHHtPDk6peKyI/giphy.mp4",
        "https://media.giphy.com/media/Kbc2X7IHgyd7a/giphy.mp4"];

        // Add classes to remove pseudo elements if needed
        var head = $('head');
        var newStyle = document.createElement("style");
        newStyle.innerHTML = '.kill-pseudo:before, .kill-pseudo:after  { content: "" !important;}';
        head.append(newStyle);

        // Loop through everything and check if it needs to be replaced
        $('*').not('html, head, title, style, script,.cagified').each(function(){

            var _this = $(this);
            var before = window.getComputedStyle(_this[0], ':before');
            var beforeContent = before.getPropertyValue('content');
            var beforeReturn
            var after = window.getComputedStyle(_this[0], ':after');
            var afterContent = after.getPropertyValue('content');
            var afterReturn;
            // console.log('beforeContent', beforeContent, 'afterContent', afterContent);

            counters.totalElements++;

            // check for :before and :after pseudo elements, but not on i elements because we do those differently
            if (!_this.is('i')) {
                if (beforeContent.length > 1) {
                    // console.log(_this, 'has before pseudo element');
                    beforeReturn = replacePseudoElements(_this, counters.pseudoElementsBefore, counters.pseudoElementsBeforeTotal, before, "before");
                    counters.pseudoElementsBefore = beforeReturn.counter;
                    counters.pseudoElementsBeforeTotal = beforeReturn.totalCounter;
                    // counters.pseudoElementsBefore = replacePseudoElements(_this, counters.pseudoElementsBefore, counters.pseudoElementsBeforeTotal, before, "before");
                }
                if (afterContent.length > 1) {
                    // console.log(_this, 'has after pseudo element');

                    afterReturn = replacePseudoElements(_this, counters.pseudoElementsAfter, counters.pseudoElementsAfterTotal, after, "after");
                    counters.pseudoElementsAfter = afterReturn.counter;
                    counters.pseudoElementsAfterTotal = afterReturn.totalCounter;
                    // counters.pseudoElementsAfter = replacePseudoElements(_this, counters.pseudoElementsAfter, after, "after");
                }

            }


            // Check the element itself to see if it needs replacing
            if (_this.css('background-image') !== 'none') {
                // console.log(_this, 'has background image');

                // console.log('before background image', counters.backgroundImages);
                counters.backgroundImages = replaceBackgroundImages(_this, counters.backgroundImages);
                // console.log('after background image', counters.backgroundImages);

            } else if (_this.is('img') || _this.is('input[type=image]')) {
                // console.log(_this, 'is image');

                // console.log('before image', counters.images);
                counters.images = replaceImages(_this, counters.images);
                // console.log('after image', counters.images);

            } else if (_this.is('iframe') || _this.is('embed')) {
                // console.log(_this, 'is iframe');

                // console.log('before iframe', counters.iframes);
                counters.iframes = replaceIframesAndEmbeds(_this, counters.iframes, iframeVideos);
                // console.log('after iframe', counters.iframes);

            } else if (_this.is('video')) {
                // console.log(_this, 'is video element');

                // console.log('before video element', counters.videos);
                counters.videos = replaceVideos(_this, counters.videos, giphyVideos);
                // console.log('after video element', counters.videos);

            } else if (_this.is('svg')) {
                // console.log(_this, 'is svg');

                // console.log('before video element', counters.svgs);
                counters.svgs = replaceSVGs(_this, counters.svgs);
                // console.log('after video element', counters.svgs);

            } else if (_this.is('i')) {
                // console.log(_this, 'is i element');

                // console.log('before video element', counters.iElements);
                counters.iElements = replaceIElements(_this, counters.iElements);
                // console.log('after video element', counters.iElements);

            } else {
                // console.log(_this, 'other thing');

            }
        });

        console.log('elements on page: ', counters.totalElements);
    }

    // Replace all pseudo elements with pictures of nick cage
    function replacePseudoElements(_this, counter, totalCounter, pseudoElement, beforeOrAfter) {
        var newUrl;
        var result;
        var imgType;
        var beforeOrAfter = beforeOrAfter;

        var pseudo = pseudoElement;
        var pseudoImage = pseudo.getPropertyValue('background-image');
        var counter = counter;
        var totalCounter = totalCounter;
        var head = $('head');
        var usingParentDimensions = false;

        // console.log(_this);
        // console.log(pseudo);

        //Get pseudo's dimensions for url
        // get width value
        var pseudoWidthPx = pseudo.getPropertyValue('width');
        // remove px from it
        var pseudoWidth = pseudoWidthPx.replace('px', '');

        if (pseudoWidth == "auto") {
            console.log('autowidth');
            var pseudoWidthClean = Math.floor(_this.outerWidth());
            usingParentDimensions = true;
        } else {
            var pseudoWidthClean = parseInt(pseudoWidth);
        }

        // make it a whole number
        // var pseudoWidthClean = parseInt(pseudoWidth);
        // add px so it can be used again
        var pseudoWidthPxClean = pseudoWidthClean + "px";
        // console.log('pseudo widths:', pseudoWidthPx, pseudoWidth, pseudoWidthClean, pseudoWidthPxClean);

        var pseudoHeightPx = pseudo.getPropertyValue('height');
        var pseudoHeight = pseudoHeightPx.replace('px', '');

        if (pseudoHeight == "auto") {
            console.log('autoheight');
            var pseudoHeightClean = Math.floor(_this.outerHeight());
            usingParentDimensions = true;
        } else {
            var pseudoHeightClean = parseInt(pseudoHeight);
        }
        var pseudoHeightPxClean = pseudoHeightClean + "px";
        // var pseudoHeightClean = parseInt(pseudoHeight);
        // var pseudoHeightPxClean = pseudoHeightClean + "px";
        console.log('pseudo height:', pseudoHeightPx, pseudoHeight, pseudoHeightClean, pseudoHeightPxClean);

        // check if the value is "auto". if so, use the parents height/width
        // if (psuedoHeight == "auto") {
        //     console.log('autoheight');
        // }

        // Cycle through the different placecage options
        counter++;
        totalCounter++;
        result = imgCounter(counter);
        imgType = result.imgType;
        counter = result.counter;

        newUrl = "url(" + settings.placeholderSite + imgType + pseudoWidthClean + "/" + pseudoHeightClean + ")";

        // Add new rule and class for new image styles
        var pseudoClass = 'pseudo-' + beforeOrAfter + '-BG-' + totalCounter;
        if (usingParentDimensions) {
            var pseudoRule = '.' + pseudoClass + ':' + beforeOrAfter + '{ content: "" !important; background-image: ' + newUrl + ' !important; background-size: cover !important; background-position: 0 0 !important; width: ' + pseudoWidthPxClean + ' !important ; height: ' + pseudoHeightPxClean + ' !important; display: inline-block !important; top: 0; left: 0; position: absolute;}';
        } else {
            var pseudoRule = '.' + pseudoClass + ':' + beforeOrAfter + '{ content: "" !important; background-image: ' + newUrl + ' !important; background-size: cover !important; background-position: 0 0 !important; width: ' + pseudoWidthPxClean + ' !important ; height: ' + pseudoHeightPxClean + ' !important;}';

        }

        // display: inline-block; top: 0; left: 0;?????
        _this.addClass(pseudoClass);

        // Add new rule to head of document
        var newStyle = document.createElement("style");
        newStyle.innerHTML = pseudoRule;
        head.append(newStyle);

        return {
            counter: counter,
            totalCounter: totalCounter
        }
    }

    // Replace all standard images with pictures of nick cage
    function replaceImages(_this, counter) {
        var height;
        var imgType;
        var newURL;
        var width;
        var counter = counter;

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
            counter = result.counter;

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
        return counter;
    }

    // Replace background images with pictures of nick cage
    function replaceBackgroundImages(_this, counter) {
        var imgType;
        var counter = counter;

        var backgroundSize = 'cover';
        var height;
        var imageUrl;
        var newURL;
        var width;

        //First, we need to get the width and height of the background image, depending on whether or not it's background-attachment fixed

        //If the element doesn't have a fixed background image, get the width/height of the element itself
        if (_this.css('background-attachment') !== 'fixed') {

            //for me to check this is working
            _this.addClass('not-fixed');
            // console.log('is not fixed');

            // Get height of actual element
            width = Math.floor(_this.outerWidth());
            height = Math.floor(_this.outerHeight());

        }

        // If the background is fixed, get the width/height of the background image instead because we'll need to replace that
        else {

            //for me to check this is working
            _this.addClass('is-fixed');
            // console.log('is fixed');

            // Get image url from property value by removing the beginning url(" and ending ") part of it.
            imageUrl = _this.css('background-image');
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
            if (!_this.hasClass('is-fixed')) {
                var isWideOrTall = isWideOrTallRectangle(width, height, _this);
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
            _this.css({
                'cssText' : newUrl,
                'background-size' : backgroundSize,
                'background-repeat': 'repeat',
                'background-position' : 'center center'
            });
            // add classes to see it was changed
            _this.addClass('cagified-bg cagified-bg--bg-image');
        }

        return counter;
    }

    // Replace iframes with youtube video embeds of nick cage
    function replaceIframesAndEmbeds(_this, counter, videoList) {

        var counterResult;
        var newIframe;

        var counter = counter;

        counter++;

        counterResult = videoCounter(counter, videoList);
        newIframe = counterResult.video;
        counter = counterResult.counter;

        // _this.contents().empty();
        _this.attr("src", newIframe);
        //

        return counter;
    }

    // Replace all 'video' elements with giphy videos of nick cage
    function replaceVideos(_this, counter, videoList) {

        var counterResult;
        var newVideo;

        var counter = counter;

        //Cycle through different videos
        counter++;

        counterResult = videoCounter(counter, videoList);
        newVideo = counterResult.video;
        counter = counterResult.counter;

        // Clear any internal source elements, just in case
        _this.empty();

        // Set video element src to giphy video
        _this.attr('src', newVideo);
        _this[0].autoplay = true;
        _this[0].loop = true;

        // Reload and play new video, just in case
        _this[0].load();
        _this[0].play();

        return counter;

    }

    // Replace all 'svg' elements with images of nick cage. Note this is best done with a background image.
    function replaceSVGs(_this, counter) {
        var imgType;
        var counter = counter;

        var newURL;

        // get dimensions of current svg
        var width = Math.floor(_this.outerWidth());
        var height = Math.floor(_this.outerHeight());
        var backgroundSize = 'cover';

        // If the dimensions are 0 x 0 do nothing
        if ( (width >= 1) && (height >= 1) ) {

            // Set up dimensions of current element as strings to be used for css rules later
            var widthString = 'width: ' + width + 'px !important; ';
            var heightString = 'height: ' + height + 'px !important; ';
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

            // Cycle through the different placecage options
            counter++;
            result = imgCounter(counter);
            imgType = result.imgType;
            counter = result.counter;

            // Need to use cssText to use !important
            newUrl = "background-image: url(" + settings.placeholderSite + imgType + width + "/" + height + ") !important";

            // combine image url with height and width rules to use in cssText
            var cssTextVar = widthString + heightString + newUrl;
            _this.css({
                'cssText' : cssTextVar,
                'background-size' : backgroundSize,
                'background-repeat': 'repeat',
                'background-position' : 'center center'
            });

            // add classes to see it was changed
            _this.addClass('cagified-bg cagified-bg--svg');

            // clear svg in case it contains anything
            _this.empty();
        }

        return counter;
    }

    function replaceIElements(_this, counter) {
        var imgType;
        var counter = counter;

        var newURL;

        // get dimensions of current svg
        var width = Math.floor(_this.outerWidth());
        var height = Math.floor(_this.outerHeight());
        var backgroundSize = 'cover';

        // If the dimensions are 0 x 0 do nothing
        if ( (width >= 1) && (height >= 1) ) {

            // Set up dimensions of current element as strings to be used for css rules later
            var widthString = 'width: ' + width + 'px !important; ';
            var heightString = 'height: ' + height + 'px !important; ';
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

            // Cycle through the different placecage options
            counter++;
            result = imgCounter(counter);
            imgType = result.imgType;
            counter = result.counter;

            // Need to use cssText to use !important
            newUrl = "background-image: url(" + settings.placeholderSite + imgType + width + "/" + height + ") !important";
            // combine image url with height and width rules to use in cssText
            var cssTextVar = widthString + heightString + newUrl;
            _this.css({
                'cssText' : cssTextVar,
                'background-size' : backgroundSize,
                'background-repeat': 'repeat',
                'background-position' : 'center center',
                'display': 'inline-block'
            });

            // add classes to see it was changed
            _this.addClass('cagified-bg cagified-bg--i-element');

            // remove all pseudo elements from it, as this is how font icons usually work
            _this.addClass('kill-pseudo');
        }

        return counter;
    }

});