'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});
// TODO; alarms only fire every minuite at the most
// find out if we can make this an event page if we need it to
// run every 10 seconds?
// chrome.alarms.onAlarm.addListener(function(alarm){
// 	console.log(alarm);
// });
// chrome.browserAction.setBadgeText({text: 'Tabz'});

var at = {
	OPS : {
		checkmark: "\u2713"
	},
	start:function(){
		console.log('Awesome Tabber Started');
		at.setSetting({"key":"active","value":true});
		at.moveNext();

		chrome.alarms.create('moveNext', {hello:'boom'});
		chrome.browserAction.setBadgeText({text: at.OPS.checkmark});
		chrome.browserAction.setBadgeBackgroundColor( { color: [0, 0, 255, 255] } );
		chrome.browserAction.setIcon({path:"images/icon-arrows-128.png"});
	},
	stop:function(){
		clearTimeout(at.timer);
		console.log('Awesome Tabber Stopped');
		at.setSetting({"key":"active","value":false});
		chrome.browserAction.setBadgeText({text: 'X'});
		chrome.browserAction.setBadgeBackgroundColor( { color: [180, 180, 180, 255] } );
		chrome.browserAction.setIcon({path:"images/icon-arrows-disabled-128.png"});
	},
	setBadge: function(){
		var active = at.getSetting({'key':'active'});
		// TODO; move all the chrome.browserAction.set[Icon|Badge|Color] calls to this method
	},
	getSetting: function(ops){
		var key = ops.key;
		// TODO; get setting 
		return true;
	},
	setSetting: function(ops){
		var key = ops.key,
			value = ops.value;
		// TODO; set the setting !
	},
	moveNext:function(){
		// chrome.tabs.query({'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs){ console.log(tabs) });
		if (!at.getSetting({"key":"active","type":"boolean"})){
			return;
		}
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
		var interval = 7e3; // TODO; at.getSetting({"key":"interval","type":"number","default":20});
		chrome.tabs.update(tab.id, {selected: true});
		clearTimeout(at.timer);
		at.timer = setTimeout(function(){
			at.moveNext();
		},interval);
	},
	init:function(){
		at.setBadge();
	}
}
at.init();