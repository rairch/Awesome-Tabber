(function($, document, window, undefined){
    "use strict";


    var options = {backgroundPage : null, active : false},
        manifest = chrome.runtime.getManifest();


    options.init = function(){
    	$("h1").text( manifest.name + " Settings");
        $(".form__lable--title").text( manifest.name )

        $("input[name=active]").on("click",function(e){
            var $el = $(e.target),
                val = $el.prop("checked");

            if (val){
            	backgroundPage.at.start();
            } else {
            	backgroundPage.at.stop();
            }
        });

        $("input[name=active]").prop("checked", options.active);
        $("input[name=interval]").on('input change',function(e){
            var $el = $(e.target),
                val = $el.val(),
                $parent = $el.closest("div"),
                $display = $parent.find(".form__show-value");

            $display.text( val );
            backgroundPage.at.setSetting({"key":"interval","value":val});
        });
        $("button[name=movenext]").on('click',function(e){
          e.preventDefault();
          backgroundPage.at.console.log('clicked')
          backgroundPage.at.moveNext();
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
        window.backgroundPage = chrome.extension.getBackgroundPage();
        options.active = backgroundPage.at.getSetting({"key":"active","type":"boolean"});
        options.interval = backgroundPage.at.getSetting({"key":"interval","type":"number","default":20});
        options.init();
    });


})(window.$, document, window);
