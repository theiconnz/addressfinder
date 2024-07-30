<?php

namespace Theiconnz\Addressfinder\Model;

use Magento\Integration\Model\Oauth\TokenFactory;
use Theiconnz\Addressfinder\Api\GoogleInterface;

/**
 * Google Model Class
 */
class Google implements GoogleInterface
{
    /**
     * @var \Theiconnz\Addressfinder\Helper\Data
     */
    protected $helperData;

    /**
     * @var \Magento\Integration\Model\Oauth\TokenFactory
     */
    protected $tokenFactory;

    /**
     * @param Data $helperData
     * @param TokenFactory $tokenFactory
     */
    public function __construct(
        \Theiconnz\Addressfinder\Helper\Data $helperData,
        \Magento\Integration\Model\Oauth\TokenFactory $tokenFactory
    ) {
        $this->helperData = $helperData;
        $this->tokenFactory = $tokenFactory;
    }

    /**
     * Retrun Google address list
     *
     * @param string $auth_token
     * @param int $storeid
     * @return false|object
     */
    public function getGoogleCollection($auth_token, $storeid)
    {
        try {
            $token = $this->tokenFactory->create();
            if ($auth_token !== "") {
                $token->loadByToken($auth_token);
                if (!$token->getData('entity_id') && $token->getData('admin_id')!='1') {
                    $response = [
                        'status'=> false ,
                        'message' => __("Invalid authorization token")
                    ];
                } else {
                    if (!$this->helperData->isenable($storeid)) {
                        $response = [
                            'status'=>false,
                            'message' => __("Please Enable The Extension")
                        ];
                    } else {
                        $response = [
                            "status" => true,
                            "Enable" => $this->helperData->isenable(),
                            "Googleapikey" => $this->helperData->getgoogleapikey(),
                            'message' => __("successfully get configuration")
                        ];
                    }
                }
            }
            return json_encode($response);
        } catch (\Expection $e) {
            $response = [
                'status'=>false,
                'message' => __($e->getMessage())
            ];
            return json_encode($response);
        }
    }
}
