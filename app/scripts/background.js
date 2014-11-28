'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});
chrome.browserAction.onClicked.addListener(function(){
  at.toggle();
});
// TODO; alarms only fire every minuite at the most
// find out if we can make this an event page if we need it to
// run every 10 seconds?
// chrome.alarms.onAlarm.addListener(function(alarm){
// 	console.log(alarm);
// });
// chrome.browserAction.setBadgeText({text: 'Tabz'});

var at = {
  DEBUG: true,
	OPS : {
		checkmark: "\u2713"
	},
  console: {
    log:function(){
      if (at.DEBUG){
        console.log(arguments)
      }
    }
  },
  toggle:function(){
    if ( at.getSetting({"key":"active","type":"boolean"}) ){
      at.stop();
    }else{
      at.start();
    }
  },
	start:function(){
		at.console.log('Awesome Tabber Started');
		at.setSetting({"key":"active","value":true});
    //at.setBadge(at.OPS.checkmark,[0, 200, 0, 255],"images/icon-arrows-128.png");
		at.moveNext();
		// chrome.browserAction.setBadgeText({text: at.OPS.checkmark});
		// chrome.browserAction.setBadgeBackgroundColor( { color: [0, 0, 255, 255] } );
		// chrome.browserAction.setIcon({path:"images/icon-arrows-128.png"});
	},
	stop:function(){
		clearTimeout(at.timer);
		at.console.log('Awesome Tabber Stopped');
		at.setSetting({"key":"active","value":false});
    at.setBadge('',[180, 180, 180, 255],"images/icon-arrows-disabled-128.png");
		// chrome.browserAction.setBadgeText({text: 'X'});
		// chrome.browserAction.setBadgeBackgroundColor( { color: [180, 180, 180, 255] } );
		// chrome.browserAction.setIcon({path:"images/icon-arrows-disabled-128.png"});
	},
	setBadge: function(text, colour, image){
		var active = at.getSetting({'key':'active'});

    chrome.browserAction.setBadgeText({text: text});
    chrome.browserAction.setBadgeBackgroundColor( { color: colour } );
    chrome.browserAction.setIcon({path: image});
	},
	getSetting: function(ops){
		var key = ops.key,
        value;

		value = localStorage.getItem(key);
    if (ops.type && ops.type === "boolean"){
      value = value === "true";
    } else if (ops.type && ops.type === "number"){
      value = parseFloat(value);
    }
    if (value === null || isNaN(value) && ops.default){
      value = ops.default;
    }
    return value;
	},
	setSetting: function(ops){
		var key = ops.key,
			value = ops.value;
		localStorage.setItem(key, value);
	},
	moveNextIfIdle:function(detectionIntervalInSeconds){
    at.console.log('it movenext if idle')
		chrome.idle.queryState(detectionIntervalInSeconds, function ( state ){
			if (state !== "idle"){
        at.console.log('move next we are not idle!');
				at.moveNext();
			} else {
        at.console.log('page is active, ignoring')
      }
		});
	},
	moveNext:function(){
		// chrome.tabs.query({'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs){ console.log(tabs) });
		if (!at.getSetting({"key":"active","type":"boolean"})){
      console.log('active is true so exiting');
			return;
		}
    var step = at.getSetting({"key":"step","type": "number"});
    step = step + 1;
    if (step > 2){
      step = 0;
    }
    at.setSetting({"key":"step","value": step});
    at.setBadge(at.OPS.checkmark,[0, 200, 0, 255],"images/icon-arrows-128-"+ step +".png");
		chrome.tabs.getSelected(null, function(tab) {
	        var tabId = tab.id;

	        chrome.tabs.query({'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
	        	console.log(tabs);
	        	var i;
	        	for(i = 0; i<tabs.length; i++){

	        		if(tabs[i].id===tabId){
	        			++i;
	        			if(i===tabs.length){
	        				i=0;
	        			}
	        			at.activateTab(tabs[i]);
	        			break;
	        		}
	        	}

	        });
	        // console.log(tab.id);
	    });
	},
	activateTab:function(tab){
		var intervalInSeconds = at.getSetting({"key":"interval","type":"number","default":20});
		chrome.tabs.update(tab.id, {selected: true});
		clearTimeout(at.timer);
		at.timer = setTimeout(function(){
			//at.moveNextIfIdle(intervalInSeconds);
			at.moveNext();
		}, (intervalInSeconds*1000) );
	},
	init:function(){
    at.setSetting({"key":"active","value": false});
    at.setSetting({"key":"step","value": 0});
		//  at.setBadge();
	}
}
at.init();
