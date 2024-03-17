var google_maps_loaded_deferred = null;

define(['jquery','uiComponent'],function ($,Component) {
    var google_api_key = $("#ticon_addressfinderapikey").val();
    var enabledisable = $("#ticon_enabledisable").val();
    var restriction = $("#ticon_restriction").val();

    if (!google_maps_loaded_deferred && enabledisable == '1') {
        window.ticonRestrictions=restriction;
        google_maps_loaded_deferred = $.Deferred();
        window.google_maps_loaded = function () {
            google_maps_loaded_deferred.resolve(google.maps);
        }
        var url = 'https://maps.googleapis.com/maps/api/js?key=' + google_api_key + '&libraries=places&callback=google_maps_loaded';
        require([url], function () {}, function (err) {
            google_maps_loaded_deferred.reject();
        });
        return google_maps_loaded_deferred.promise();
    }
    return false;
});
