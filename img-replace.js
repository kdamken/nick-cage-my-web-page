$(document).ready(function(){

    var settings = {};
    settings.placeholderSite = '//www.placecage.com/';

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
            console.log('Loaded initNick');
            console.info("Nick Cage is ready!");
            // where the magic happens
            replaceAllElements();
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
    testAndInitCage();

    /**************************************************
    Functions for finding and replacing elements
    **************************************************/

    function replaceAllElements() {

        replacePseudoBackgroundImages();
        var counters = {};
        counters.totalElements = 0;
        counters.backgroundImages = 0;
        counters.images = 0;
        counters.iframes = 0;
        counters.videos = 0;
        counters.svgs = 0;
        counters.iElements = 0;

        var iframeVideos = ["https://www.youtube.com/embed/S73swRzxs8Y",
        "https://www.youtube.com/embed/e6i2WRreARo",
        "https://www.youtube.com/embed/A23TuxKex_w"];

        var giphyVideos = ["https://media.giphy.com/media/LAhPbwzAsWzKw/giphy.mp4",
        "https://media.giphy.com/media/8JZkR2HiOCQbm/giphy.mp4",
        "https://media.giphy.com/media/PHHtPDk6peKyI/giphy.mp4",
        "https://media.giphy.com/media/Kbc2X7IHgyd7a/giphy.mp4"];

        // Add classes to remove pseudo elements if needed
        var head = $('head');
        var newStyle = document.createElement("style");
        newStyle.innerHTML = '.kill-pseudo:before, .kill-pseudo:before  { content: none !important;}';
        head.append(newStyle);

        // $('*').each(function(){
        //     counters.totalElements++;
        //     var _this = $(this);

        //     if (false) {
        //         console.log('check for pseudo for background image');

        //     } else if (_this.css('background-image') !== 'none') {
        //         // console.log('has background image');

        //         // console.log('before background image', counters.backgroundImages);
        //         counters.backgroundImages = replaceBackgroundImages(_this, counters.backgroundImages);
        //         // console.log('after background image', counters.backgroundImages);

        //     } else if (_this.is('img') || _this.is('input[type=image]')) {
        //         // console.log(_this, 'is image');

        //         // console.log('before image', counters.images);
        //         counters.images = replaceImages(_this, counters.images);
        //         // console.log('after image', counters.images);

        //     } else if (_this.is('iframe') || _this.is('embed')) {
        //         // console.log(_this, 'is iframe');

        //         // console.log('before iframe', counters.iframes);
        //         counters.iframes = replaceIframesAndEmbeds(_this, counters.iframes, iframeVideos);
        //         // console.log('after iframe', counters.iframes);

        //     } else if (_this.is('video')) {
        //         // console.log(_this, 'is video element');

        //         // console.log('before video element', counters.videos);
        //         counters.videos = replaceVideos(_this, counters.videos, giphyVideos);
        //         // console.log('after video element', counters.videos);

        //     } else if (_this.is('svg')) {
        //         // console.log(_this, 'is svg');

        //         // console.log('before video element', counters.svgs);
        //         counters.svgs = replaceSVGs(_this, counters.svgs);
        //         // console.log('after video element', counters.svgs);

        //     } else if (_this.is('i')) {
        //         // console.log(_this, 'is i element');

        //         // console.log('before video element', counters.iElements);
        //         counters.iElements = replaceIElements(_this, counters.iElements);
        //         // console.log('after video element', counters.iElements);

        //     } else {
        //         // console.log(_this, 'other thing');

        //     }
        // });

        console.log('elements on page: ', counters.totalElements);
    }

    // gotta figure out what I did here

    /**
    either -
        first check content to see if empty - if content.length > 2
            yes - bg image if/else
            no - replace it
    **/

    function replacePseudoBackgroundImages() {
        var w;
        var h;
        var newURL;
        var imgType;
        var beforeCounter = 0;
        var afterCounter = 0;
        var counter = 0;
        var newRules = [];
        var foundPseudo = false;

        var head = $('head');
        var newStyle = document.createElement("style");
        newStyle.innerHTML = '.kill-pseudo:before, .kill-pseudo:before  { content: none !important;}';
        head.append(newStyle);

        var x = 0;

        console.log('total el', $('*').length);

        $('*').each(function(){
            console.log('this el', $(this)[0]);
            // console.log(window.getComputedStyle($(this)[0]).getPropertyValue('border'));

            var before = window.getComputedStyle($(this)[0], ':before');
            var beforeImage = before.getPropertyValue('backgroundImage');
            // var beforeContent = before.getPropertyValue('content');
            var beforeContent = before.getPropertyValue('content').length;
            // console.log('before', before);
            // console.log('beforeImage', beforeImage);
            // console.log('beforeContent:', beforeContent);

            if(before) {
                console.log('has before element');
                console.log('before', before);
                console.log('beforeImage', beforeImage);
                console.log('beforeContent:', beforeContent);
            }

            // For if they have a :before with a background-image
            if (beforeImage !== "none" ) {
                console.log('has image');
                beforeCounter++;

                //Get pseudo's dimensions for url
                var beforeWidthPx = before.getPropertyValue('width');
                var beforeWidth = beforeWidthPx.replace('px', '');
                var beforeWidthClean = parseInt(beforeWidth);
                var beforeWidthPxClean = beforeWidthClean + "px";
                // console.log('after width:', beforeWidthPx, beforeWidth, beforeWidthClean, beforeWidthPxClean);

                var beforeHeightPx = before.getPropertyValue('height');
                var beforeHeight = beforeHeightPx.replace('px', '');
                var beforeHeightClean = parseInt(beforeHeight);
                var beforeHeightPxClean = beforeHeightClean + "px";
                // console.log('after height:', beforeHeightPx, beforeHeight, beforeHeightClean, beforeHeightPxClean);

                if (beforeCounter == 1) {
                    imgType = "";
                } else if (beforeCounter == 2 ){
                    imgType = "g/";
                } else if (beforeCounter == 3 ){
                    imgType = "c/";
                } else if (beforeCounter == 4 ){
                    imgType = "gif/";
                    beforeCounter = 0;
                }

                newUrl = "url(" + settings.placeholderSite + imgType + beforeWidthClean + "/" + beforeHeightClean + ")";

                // Add new rule and class for new image styles
                var beforeClass = 'pseudo-before-BG-' + counter;
                var beforeRule = '.' + beforeClass + ':before { background-image: ' + newUrl + ' !important; }';
                $(this).addClass(beforeClass);
                newRules.push(beforeRule);

                // Set this to true to trigger adding new style element after this each loop if we found an applicable pseudo
                foundPseudo = true;

            }

            if (foundPseudo) {
                var newRulesTogether = newRules.join(' ');
                var newStyle = document.createElement("style");
                newStyle.innerHTML = newRulesTogether;
                head.append(newStyle);
            }
        });

        // length > 2?

        // $('*').each(function(){
        //     if (x < 1) {
        //         console.log($(this));
        //         x++;
        //         // This counter is used for the custom class names for each element
        //         counter++;

        //         // Use these to find elements that have a pseudo element with a background image
        //         console.log(window.getComputedStyle($(this)[0]));
        //         var before = window.getComputedStyle($(this)[0], ':before');
        //         console.log('before', before);
        //         var beforeImage = before.getPropertyValue('backgroundImage');
        //         // var beforeContent = before.getPropertyValue('content');
        //         var beforeContent = JSON.stringify(before.getPropertyValue('content'));
        //         console.log('before', before);
        //         console.log('beforeImage', beforeImage);
        //         console.log('beforeContent:', beforeContent);


        //         var after = window.getComputedStyle($(this)[0], ':after');
        //         var afterImage = after.getPropertyValue('background-image');
        //         // var afterContent = "\\" + after.getPropertyValue('content');
        //         // var afterContent = JSON.stringify(after.getPropertyValue('content'));
        //         // var afterContent = encodeURI("\f2b1");
        //         // JSON.stringify(str)

        //         // var afterIsIcon = /^\\[a-zA-Z]/.test(afterContent);

        //         // For if they have a :before with a background-image
        //         if (beforeImage != "none" ) {
        //             beforeCounter++;

        //             //Get pseudo's dimensions for url
        //             var beforeWidthPx = before.getPropertyValue('width');
        //             var beforeWidth = beforeWidthPx.replace('px', '');
        //             var beforeWidthClean = parseInt(beforeWidth);
        //             var beforeWidthPxClean = beforeWidthClean + "px";
        //             // console.log('after:', beforeWidthPx, beforeWidth, beforeWidthClean, beforeWidthPxClean);
        //             var beforeHeightPx = before.getPropertyValue('height');
        //             var beforeHeight = beforeHeightPx.replace('px', '');
        //             var beforeHeightClean = parseInt(beforeHeight);
        //             var beforeHeightPxClean = beforeHeightClean + "px";

        //             if (beforeCounter == 1) {
        //                 imgType = "";
        //             } else if (beforeCounter == 2 ){
        //                 imgType = "g/";
        //             } else if (beforeCounter == 3 ){
        //                 imgType = "c/";
        //             } else if (beforeCounter == 4 ){
        //                 imgType = "gif/";
        //                 beforeCounter = 0;
        //             }

        //             // newUrl = "url(" + placeholderSite + imgType + beforeWidthClean + "/" + beforeHeightClean + ")";

        //             // // Add new rule and class for new image styles
        //             // var beforeClass = 'pseudo-before-BG-' + counter;
        //             // var beforeRule = '.' + beforeClass + ':before { background-image: ' + newUrl + ' !important; }';
        //             // $(this).addClass(beforeClass);
        //             // newRules.push(beforeRule);

        //             // Set this to true to trigger adding new style element after this each loop if we found an applicable pseudo
        //             foundPseudo = true;

        //         }

        //         // For if they have an :after with a background-image
        //         // if (afterImage != "none" ) {
        //         //     // console.log(typeof(afterContent), afterContent, afterIsIcon);
        //         //     afterCounter++;

        //         //     //Get pseudo's dimensions for url
        //         //     var afterWidthPx = after.getPropertyValue('width');
        //         //     var afterWidth = afterWidthPx.replace('px', '');
        //         //     var afterWidthClean = parseInt(afterWidth);
        //         //     var afterWidthPxClean = afterWidthClean + "px";
        //         //     // console.log('after:', afterWidthPx, afterWidth, afterWidthClean, afterWidthPxClean);
        //         //     var afterHeightPx = after.getPropertyValue('height');
        //         //     var afterHeight = afterHeightPx.replace('px', '');
        //         //     var afterHeightClean = parseInt(afterHeight);
        //         //     var afterHeightPxClean = afterHeightClean + "px";

        //         //     if (afterCounter == 1) {
        //         //         imgType = "";
        //         //     } else if (afterCounter == 2 ){
        //         //         imgType = "g/";
        //         //     } else if (afterCounter == 3 ){
        //         //         imgType = "c/";
        //         //     } else if (afterCounter == 4 ){
        //         //         imgType = "gif/";
        //         //         afterCounter = 0;
        //         //     }

        //         //     newUrl = "url(" + placeholderSite + imgType + afterWidth + "/" + afterHeight + ")";

        //         //     // Add new rule and class for new image styles
        //         //     var afterClass = 'pseudo-after-BG-' + counter;
        //         //     var afterRule = '.' + afterClass + ':after { background-image: ' + newUrl + ' !important; background-size: cover !important; }';
        //         //     $(this).addClass(afterClass);
        //         //     newRules.push(afterRule);

        //         //     // Set this to true to trigger adding new style element after this each loop if we found an applicable pseudo
        //         //     foundPseudo = true;
        //         // }
        //     }

        // });

        // If we found a pseudo with a background-image add the new style element with the rules to replace it's image
        // if (foundPseudo) {
        //     var newRulesTogether = newRules.join(' ');
        //     var newStyle = document.createElement("style");
        //     newStyle.innerHTML = newRulesTogether;
        //     head.append(newStyle);
        // }
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