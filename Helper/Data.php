<?php

namespace Theiconnz\Addressfinder\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Framework\App\Helper\Context;
use Magento\Store\Model\StoreManagerInterface;

class Data extends AbstractHelper implements \Magento\Framework\View\Element\Block\ArgumentInterface
{
    const GOOGLEADDRESSFINDER_ENABLE = 'addressfinder/general/enabled';
    const API_KEY = 'addressfinder/general/api_key';

    const GOOGLE_RESTRICTIONS = 'addressfinder/general/limitcountries';

    protected $_scopeConfig;

    protected $_request;
    protected $_state;

    protected $storeid;

    public function __construct(
        Context $context,
        \Magento\Framework\App\State $state,
        StoreManagerInterface $storeManager,
    )
    {
        parent::__construct($context);
        $this->_scopeConfig = $context->getScopeConfig();
        $this->_request = $context->getRequest();
        $this->_storeId = $storeManager->getStore()->getId();
        $this->_state = $state;
    }

    public function isenable($storeid = null)
    {
        return $this->getScopeSetting(
            self::GOOGLEADDRESSFINDER_ENABLE,
            $storeid
        );
    }

    public function getgoogleapikey($storeid = null)
    {
        return $this->getScopeSetting(
            self::API_KEY,
            $storeid
        );
    }

    public function getRestrictions($storeid = null)
    {
        return $this->getScopeSetting(
            self::GOOGLE_RESTRICTIONS,
            $storeid
        );
    }


    /**
     * Getter method for a given scope setting
     * @param string $path
     * @param int|null $storeId
     * @return
     */
    protected function getScopeSetting($path, $storeId = null)
    {
        $this->checkAreaCode();

        if (isset($storeId)) {
            $scopedStoreCode = $storeId;
        } elseif ($this->_state->getAreaCode() == \Magento\Framework\App\Area::AREA_ADMINHTML) {
            $scopedStoreCode = $this->_request->getParam('store');
            $scopedWebsiteCode = $this->_request->getParam('website');
        } else {
            // In frontend area. Only concerned with store for frontend.
            $scopedStoreCode = $this->_storeId;
        }

        if (isset($scopedStoreCode)) {
            $scope = \Magento\Store\Model\ScopeInterface::SCOPE_STORE;
            return $this->_scopeConfig->getValue($path, $scope, $scopedStoreCode);
        } elseif (isset($scopedWebsiteCode)) {
            $scope = \Magento\Store\Model\ScopeInterface::SCOPE_WEBSITE;
            return $this->_scopeConfig->getValue($path, $scope, $scopedWebsiteCode);
        } else {
            return $this->_scopeConfig->getValue($path);
        };
    }



    /**
     * helper function to allow this class to be used in Setup files
     */
    protected function checkAreaCode()
    {
        /**
         * when this class is accessed from cli commands, there is no area code set
         * (since there is no actual session running persay)
         * this try-catch block is needed to allow this helper to be used in setup files
         */
        try{
            $this->_state->getAreaCode();
        }
        catch (\Magento\Framework\Exception\LocalizedException $ex) {
            $this->_state->setAreaCode(\Magento\Framework\App\Area::AREA_ADMINHTML);
        }
    }

}
