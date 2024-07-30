<?php
namespace Theiconnz\Addressfinder\Api;

/**
 * Google collection interface.
 * @api
 */
interface GoogleInterface
{
    /**
     * Get configuration
     *
     * @param string $auth_token
     * @return string
     * @param int $storeid
     */
    public function getGoogleCollection($auth_token, $storeid);
}
