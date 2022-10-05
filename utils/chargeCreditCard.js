var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;

function chargeCreditCard(callback) {
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName('78Z3qyNu');
    merchantAuthenticationType.setTransactionKey('2j4kURA5M4m8cV49');

    var creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber('4242424242424242');
    creditCard.setExpirationDate('1222');
    creditCard.setCardCode('999');

    var paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    var orderDetails = new ApiContracts.OrderType();
    orderDetails.setInvoiceNumber('INV-12345');
    orderDetails.setDescription('Product Description');

    var billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName('Ellen');
    billTo.setLastName('Johnson');
    billTo.setCompany('Souveniropolis');
    billTo.setAddress('14 Main Street');
    billTo.setCity('Pecan Springs');
    billTo.setState('TX');
    billTo.setZip('44628');
    billTo.setCountry('USA');

    var shipTo = new ApiContracts.CustomerAddressType();
    shipTo.setFirstName('China');
    shipTo.setLastName('Bayles');
    shipTo.setCompany('Thyme for Tea');
    shipTo.setAddress('12 Main Street');
    shipTo.setCity('Pecan Springs');
    shipTo.setState('TX');
    shipTo.setZip('44628');
    shipTo.setCountry('USA');

    var lineItem_id1 = new ApiContracts.LineItemType();
    lineItem_id1.setItemId('1');
    lineItem_id1.setName('vase');
    lineItem_id1.setDescription('cannes logo');
    lineItem_id1.setQuantity('18');
    lineItem_id1.setUnitPrice(45.00);

    var lineItem_id2 = new ApiContracts.LineItemType();
    lineItem_id2.setItemId('2');
    lineItem_id2.setName('vase2');
    lineItem_id2.setDescription('cannes logo2');
    lineItem_id2.setQuantity('28');
    lineItem_id2.setUnitPrice('25.00');

    var lineItemList = [];
    lineItemList.push(lineItem_id1);
    lineItemList.push(lineItem_id2);

    var lineItems = new ApiContracts.ArrayOfLineItem();
    lineItems.setLineItem(lineItemList);

    var transactionSetting1 = new ApiContracts.SettingType();
    transactionSetting1.setSettingName('duplicateWindow');
    transactionSetting1.setSettingValue('120');

    var transactionSetting2 = new ApiContracts.SettingType();
    transactionSetting2.setSettingName('recurringBilling');
    transactionSetting2.setSettingValue('false');

    var transactionSettingList = [];
    transactionSettingList.push(transactionSetting1);
    transactionSettingList.push(transactionSetting2);

    var transactionSettings = new ApiContracts.ArrayOfSetting();
    transactionSettings.setSetting(transactionSettingList);

    var transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount('101.00');
    transactionRequestType.setLineItems(lineItems);
    transactionRequestType.setOrder(orderDetails);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setShipTo(shipTo);
    transactionRequestType.setTransactionSettings(transactionSettings);

    var createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    //pretty print request
    console.log(JSON.stringify(createRequest.getJSON(), null, 2));

    var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

    ctrl.execute(function () {

        var apiResponse = ctrl.getResponse();

        var response = new ApiContracts.CreateTransactionResponse(apiResponse);

        //pretty print response
        console.log(JSON.stringify(response, null, 2));

        if (response != null) {
            if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                if (response.getTransactionResponse().getMessages() != null) {
                    console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
                    console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
                    console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
                    console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
                }
                else {
                    console.log('Failed Transaction.');
                    if (response.getTransactionResponse().getErrors() != null) {
                        console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                        console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                    }
                }
            }
            else {
                console.log('Failed Transaction. ');
                if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {

                    console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                    console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                }
                else {
                    console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                    console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                }
            }
        }
        else {
            console.log('Null Response.');
        }
        callback(response);
    });
}

if (require.main === module) {
    chargeCreditCard(function () {
        console.log('chargeCreditCard call complete.');
    });
}

module.exports.chargeCreditCard = chargeCreditCard;