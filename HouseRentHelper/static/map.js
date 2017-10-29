// setup CSRF ---------------------------------------------------
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

// load all streets of Beijing into index.html ----------------------

// fetch the streets data
function loadStreets(name) {
    $.get(name, function (data) {
        data.forEach(function(street) {
            $('#'+street.region).append(streets_html(street));
        });
    });
}

//fetch the regions data
function loadRegions(name) {
    $.get(name, function (data) {
        data.forEach(function(region) {
            $('#regions').append(regions_html(region));
        });  
    });
}

function regions_html(region) {
    return '<li class="street dropdown-submenu">'
    + '<a onClick="changeLocation(' + '\'' + region.name_chi + '\',\'' + region.name_eng + '\'' 
    + ')" class="dropdown-item dropdown-toggle"'
    + 'data-toggle="dropdown" href="#">' + region.name_chi
    +'</a><ul class="dropdown-menu" id="' + region.id + '"></ul></li>'
}

function streets_html(street) {
    return '<a onClick="changeLocation(' + '\'' + street.name_chi + '\',\'' + street.name_eng + '\'' 
    + ')"class="dropdown-item" href="#">' + street.name_chi + '</a>'
}

loadRegions('api/regions');
loadStreets('api/streets');

function changeLocation(region_utf8, region) {
    $('.street_name').text(region_utf8);
    $('.street_name').attr("name", region);
}

$(".price > li > a").click(function () {
    var price = $( this ).attr("name");
    $(".price_name").text(price);
});

$("#price_confirm").click(function () {
    var price = $("#min_price").val() + '_' + $("#max_price").val();
    $(".price_name").text(price);
})

$(".room > li > a, .room > li > ul > a").click(function () {
    var room = $( this ).attr("name");
    $(".room_name").text(room);
})

// create the map and setup the plugin used in map ------------------

// create a new map
var map = new AMap.Map('container', {
    resizeEnable: true,
    zoomEnable: true,
    center: [116.397428, 39.90923],
    zoom: 11
});

// add button click onClick event listner
['en', 'zh_en', 'zh_cn'].forEach(function(btn) {
  var button = document.getElementById(btn);
  AMap.event.addDomListener(button,'click',clickListener)
});

// setup language
function clickListener() {
    map.setLang(this.id);
}

// add scale object
var scale = new AMap.Scale({
    visible: true
})

// add toolbar object
var toolBar = new AMap.ToolBar({
    visible: false
})

// add verview
var overView = new AMap.OverView({
    visible: false
})

map.addControl(scale);
map.addControl(toolBar);
map.addControl(overView);

function toggleScale(checkbox) {
	if (checkbox.checked) {
		scale.show();
	} else {
		scale.hide();
	}
}

function toggleToolBar(checkbox) {
	if (checkbox.checked) {
		toolBar.show();
	} else {
		toolBar.hide();
	}
}

function toggleOverViewShow(checkbox) {
	if (checkbox.checked) {
		overView.show();
		overView.open();
	} else {
		overView.hide();
	}
}

// global variables -------------------------------------------------

var arrivalRange = new AMap.ArrivalRange();

// x: longitude, y: Latitude, t: time
var x, y, t, vehicle = "SUBWAY,BUS";

var workAddress, workMarker;

var rentMarkerArray = [];

var polygonArray = [];

var amapTransfer;

// message window obeject -------------------------------------------

var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

// select the travel mode -------------------------------------------

function takeBus(radio) {
    vehicle = radio.value;
    loadWorkLocation()
}

function takeSubway(radio) {
    vehicle = radio.value;
    loadWorkLocation()
}

// load the path plan and arrival range -----------------------------

// auto completion in search bar
var autoOptions = {
	// specify the input value vid id
    input: "work-location"
};
var auto = new AMap.Autocomplete(autoOptions);

// add Amap event Listner, invoke the function: workLocationSelected
// after address completion
AMap.event.addListener(auto, "select", workLocationSelected);

//update work address, load the arrival range 
function workLocationSelected(e) { 
    workAddress = e.poi.name;
    loadWorkLocation();
}

// clean the arrival range that exists on map
function delWorkLocation() {
    if (polygonArray) map.remove(polygonArray);
    if (workMarker) map.remove(workMarker);
    polygonArray = [];
}

// work marker setup
function loadWorkMarker(x, y, locationName) {
    workMarker = new AMap.Marker({
        map: map,
        title: locationName,
        icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
        position: [x, y]
    });
}

function loadWorkRange(x, y, t, color, v) {
	arrivalRange.search([x,y],t, function(status,result){
        if(result.bounds){
            for(var i=0;i<result.bounds.length;i++){
                var polygon = new AMap.Polygon({
                    map:map,
                    fillColor:color,
                    fillOpacity:"0.4",
                    strokeColor:"#00FF00",
                    strokeOpacity:"0.5",
                    strokeWeight:1
                });
                polygon.setPath(result.bounds[i]);
                polygonArray.push(polygon);
            }
            map.setFitView();
        }
    },{
        policy:v
    });
}

function loadWorkLocation() {
	delWorkLocation();
	var geocoder = new AMap.Geocoder({
        city: "010" // city, default Beijing
    });
    geocoder.getLocation(workAddress, function(status, result) {
    	if (status === 'complete' && result.info === 'OK') {
    		var geocode = result.geocodes[0];
		    x = geocode.location.getLng();
		    y = geocode.location.getLat();
		    // load the workmarker
	        loadWorkMarker(x, y);
	        // load places which could be arrived within 60 min 
	        loadWorkRange(x, y, 60, "#3366FF", vehicle);
	        // center the map to the work location
	        map.setZoomAndCenter(12, [x, y]);
	    }
	});
}

// add markers by address and get the route from work place to selected address
function addMarkerByAddress(house) {
	var geocoder = new AMap.Geocoder({
        city: "北京",
        radius: 1000
    });
    address = house.house_location;
    geocoder.getLocation(address, function(status, result) {
    	if (status === "complete" && result.info === 'OK') {
            var geocode = result.geocodes[0];
            rentMarker = new AMap.Marker({
                map: map,
                title: house.house_title,
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                position: [geocode.location.getLng(), geocode.location.getLat()]
            });
            rentMarkerArray.push(rentMarker);

            rentMarker.content = "<div>source：<a target = '_blank' href='"
            + house.house_url + "'>" + house.house_title + ', ' + house.house_price + " RMB</a><div>"
            rentMarker.on('click', function(e) {
            	// marker content will show whenever click on marker
                infoWindow.setContent(e.target.content);
                // open the window in marker position
                infoWindow.open(map, e.target.getPosition());
                if (amapTransfer) amapTransfer.clear();
                amapTransfer = new AMap.Transfer({
                    map: map,
                    policy: AMap.TransferPolicy.LEAST_TIME,
                    city: "北京市",
                    panel: 'transfer-panel'
                });
                // inquery bus transfer routes according to start and end destination coordinates
                amapTransfer.search([{
                    keyword: workAddress
                }, {
                    keyword: address
                }], function(status, result) {})
            });
        }
    });
}

// get the search condition, then fetch the data from backend -------
function loadRentLocation() {
    delRentLocation();
	var region = $(".street_name").attr("name");
    var price = $(".price_name").text();
    if (price === 'Price') {
        price = '2000_4000'
    } else if (price=== 'Unlimited') {
        price = '600_30000'
    }
    var house_type = $(".room_name").text();
    var style;
    var room = '0';
    if (house_type === "Single Room") {
        style = '2';
    } else {
        style = '1';
        if (house_type !== "house") {
            room = house_type.split(" ")[2];
        }
    }
	$.post('/api/BJ58', {
        'region': region,
        'price': price,
        'style': style,
        'room': room
    }, function (data) {
        data.result.forEach(function (house) {
			addMarkerByAddress(house);
		});
	});
}

// delete all address information
function delRentLocation(argument) {
	if (rentMarkerArray) map.remove(rentMarkerArray);
    rentMarkerArray = [];
}