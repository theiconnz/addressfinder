<?php
namespace Theiconnz\Addressfinder\Api;


interface GoogleInterface {

    /**
     * get configuration
     * @param string $auth_token
     * @return string
     * @param int $storeid
     */

    public function getGoogleCollection($auth_token,$storeid);

}
