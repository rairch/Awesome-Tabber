(function($, document, window, undefined){
    "use strict";


    var options = {backgroundPage : null, active : false},
        manifest = chrome.runtime.getManifest();


    options.init = function(){
    	$("h1").text( manifest.name + " Settings");
        $(".form__lable--title").text( manifest.name )

        $("input[name=active]").on("click",function(e){
            var $el = $(e.target);
            // TODO; options.backgoundPage.at.setSetting({  the active setting  })
            if ($el.prop("checked")){
            	options.backgroundPage.at.start();
            } else {
            	options.backgroundPage.at.stop();
            }
        });
        $("input[name=active]").prop("checked", options.active);
        $("input[type=range]").on('input change',function(e){
            var $el = $(e.target),
                val = $el.val(),
                $parent = $el.closest("div"),
                $display = $parent.find(".form__show-value");

            $display.text( val );
            // TODO; options.backgoundPage.at.setSetting({  the interval setting  })
        });
        $("input[name=interval]").val( options.interval ).trigger('change');
        
        setTimeout(function(){
            $("body").addClass( "ready" );
        },100);
    }
    $(document).ready(function(){
        // IF USING EVENT PAGE
        // chrome.runtime.getBackgroundPage(function(bg){
        //     options.backgroundPage = bg;
        //     options.active = options.backgroundPage.at.getSetting({"key":"active","type":"boolean"});
        //     options.init();
        // })
        options.backgroundPage = chrome.extension.getBackgroundPage();
        options.active = true ;// options.backgroundPage.at.getSetting({"key":"active","type":"boolean"});
        options.interval = 50 ; // TODO GET FROM BACKGROUND
        options.init();
    });
    

})(window.$, document, window);
