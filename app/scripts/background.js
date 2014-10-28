'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: 'Tabz'});

var at = {
	start:function(){
		console.log('Awesome Tabber Started');

	},
	stop:function(){
		console.log('Awesome Tabber Stopped');
	},
	moveNext:function(){
		// chrome.tabs.query({'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs){ console.log(tabs) });

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

	        		console.log(tabs[i].id);
	        	}
	        	
	        });
	        // console.log(tab.id);
	    });
	},
	activateTab:function(tab){
		console.log(tab.id);
		chrome.tabs.update(tab.id, {selected: true});
	}
}
