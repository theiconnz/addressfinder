require([
    'jquery',
    'uiComponent',
    'Theiconnz_Addressfinder/js/google_maps_loader',
    'Magento_Checkout/js/checkout-data' ,
    'uiRegistry'
], function (
    $,
    Component,
    GoogleMapsLoader,
    checkoutData,
    uiRegistry
) {

    var autocomplete;
    var componentForm = {
        shortname: 'short_name',
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'short_name',
        postal_code: 'short_name',
        postal_code_suffix: 'short_name',
        postal_town: 'short_name',
        sublocality_level_1: 'short_name'
    };

    var lookupElement = {
        street_number: 'street_1',
        route: 'street_2',
        locality: 'city',
        administrative_area_level_1: 'region',
        country: 'country_id',
        postal_code: 'postcode'
    };

    var googleMapError = false;
    window.gm_authFailure = function() {
        googleMapError = true;
    };

    if(GoogleMapsLoader) {
        GoogleMapsLoader.done(function () {

            var enabledisable = $("#ticon_enabledisable").val();
            //  var payment_method = function(){}

            setTimeout(function () {
                if (!googleMapError) {
                    if (enabledisable == '1') {
                        var clist=window.ticonRestrictions.split(",");
                        //var street_id = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.street').elems()[0].uid;
                        var tmpstreet_id = document.querySelector("input[name='street[0]']");
                        var street_id=$(tmpstreet_id).attr('id');
                        autocomplete = new google.maps.places.Autocomplete(document.getElementById(street_id),
                            {types: ['geocode'],componentRestrictions: {country: clist}}
                        );
                        autocomplete.addListener('place_changed', addressAutofill);
                        $('#' + street_id).focus(geolocate);

                    }
                }
            }, 5000);

        }).fail(function () {
            console.error("ERROR: Google maps library failed to load");
        });
    }

    var addressAutofill = function () {
        var place = autocomplete.getPlace();

        var street = [];
        var region  = '';
        var streetNumber = '';
        var city = '';
        var postcode = '';
        var postcodeSuffix = '';

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var value = place.address_components[i][componentForm[addressType]];
                if (addressType == 'shortname') {
                    streetNumber = value + '/';
                } else if (addressType == 'street_number') {
                    streetNumber = streetNumber + value;
                } else if (addressType == 'route') {
                    street[1] = value;
                } else if (addressType == 'administrative_area_level_1') {
                    region = value;
                } else if (addressType == 'locality' && city == '') {
                    city = value;
                } else if (addressType == 'postal_code') {
                    postcode = value;

                    var this_id = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.postcode').uid
                    if ($('#'+this_id).length) {
                        $('#'+this_id).val(postcode + postcodeSuffix);
                        $('#'+this_id).trigger('change');
                    }
                } else if (addressType == 'postal_code_suffix') {
                    postcodeSuffix = '-' + value;
                    var this_id = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.postcode').uid
                    if ($('#'+this_id).length) {
                        $('#'+this_id).val(postcode + postcodeSuffix);
                        $('#'+this_id).trigger('change');
                    }
                } else {
                    var elementId = lookupElement[addressType];
                    if (elementId !== undefined) {
                        var this_id = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.' + elementId).uid;

                        if ($('#' + this_id).length) {
                            $('#' + this_id).val(value);
                            $('#' + this_id).trigger('change');
                        }
                    }
                }
            }
        }
        if (street.length > 0) {
            street[0] = streetNumber;
            var street_dom_id = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.street').elems()[0].uid;
            var streetString = street.join(' ');
            if ($('#'+street_dom_id).length) {
                $('#'+street_dom_id).val(streetString);
                $('#'+street_dom_id).trigger('change');
            }
        }
        var city_id = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.city').uid;
        if ($('#'+city_id).length) {
            $('#'+city_id).val(city);
            $('#'+city_id).trigger('change');
        }
        if (region != '') {
            if (uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.region_id')) {
                var region_id = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.region_id').uid;
                if ($('#'+region_id).length) {
                    $('#'+region_id +' option')
                    $('#'+region_id +' option')
                        .filter(function () {
                            return $.trim($(this).text()) == region;
                        })
                        .attr('selected',true);
                    $('#'+region_id).trigger('change');
                }
            }
            if (uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.region_id_input')) {
                var region_id = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.region_id_input').uid;

                if ($('#'+region_id).length) {
                    $('#'+region_id).val(region);
                    $('#'+region_id).trigger('change');
                }
            }
        }
    }

    geolocate = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                autocomplete.setBounds(circle.getBounds());
            });
        }
    }
    $("body").on('change',"input[type=radio][name='payment[method]'],billing-address-same-as-shipping-"+$("input[name='payment[method]']:checked").val()+"",function(){

        var payment_method = $(this).val();
        GoogleMapsLoader.done(function () {

            var enabledisable = $("#enabledisable").val();


            setTimeout(function () {
                if(!googleMapError) {
                    if (enabledisable == '1') {
                        var street_id = uiRegistry.get('checkout.steps.billing-step.payment.payments-list.' + payment_method + '-form.form-fields.street').elems()[0].uid;
                        autocomplete = new google.maps.places.Autocomplete(document.getElementById(street_id),
                            {types: ['geocode']}
                        );

                        autocomplete.addListener('place_changed', addressAutofill);
                        $('#' + street_id).focus(geolocate);
                    }
                }
            }, 5000);

        }).fail(function () {
            console.error("ERROR: Google maps library failed to load");
        });
    });
    return Component;


});

