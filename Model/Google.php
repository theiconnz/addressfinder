<?php

namespace Theiconnz\Addressfinder\Model;

use Theiconnz\Addressfinder\Api\GoogleInterface;
use Magento\Framework\Exception\AuthenticationException;

class Google implements GoogleInterface
{
    protected $helperData;
    protected $tokenFactory;

    public function __construct(
        \Theiconnz\Addressfinder\Helper\Data $helperData,
        \Magento\Integration\Model\Oauth\TokenFactory $tokenFactory
    )
    {
        $this->helperData = $helperData;
        $this->tokenFactory = $tokenFactory;
    }
    public function getGoogleCollection($auth_token,$storeid)
    {
        try {

                $token = $this->tokenFactory->create();
                 if($auth_token !== ""){
                    $token->loadByToken($auth_token);
                    $data = $token->getData();
                    if(!$token->getData('entity_id') && $token->getData('admin_id')!='1'){
                        $response = [
                            'status'=> false ,
                            'message' => __("Invalid authorization token")
                        ];
                    }else{
                        if(!$this->helperData->isenable($storeid)){
                            $response = [
                                'status'=>false,
                                'message' => __("Please Enable The Extension")
                            ];
                        }
                        else{
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
