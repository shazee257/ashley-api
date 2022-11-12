var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;

function chargeCreditCard(order, billingUser, callback) {
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
    orderDetails.setInvoiceNumber(order.order_number);
    orderDetails.setDescription(order.products.length + ' type of products');

    var tax = new ApiContracts.ExtendedAmountType();
    tax.setAmount(order.tax_amount);
    tax.setName('Tax');
    tax.setDescription('Tax');

    // var duty = new ApiContracts.ExtendedAmountType();
    // duty.setAmount('8.55');
    // duty.setName('duty name');
    // duty.setDescription('duty description');

    // var shipping = new ApiContracts.ExtendedAmountType();
    // shipping.setAmount('8.55');
    // shipping.setName('shipping name');
    // shipping.setDescription('shipping description');

    console.log("billingUser: ", billingUser);

    var billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName(billingUser.first_name);
    billTo.setLastName(billingUser.last_name);
    billTo.setCompany(billingUser.company);
    billTo.setAddress(billingUser.email);
    billTo.setCity(billingUser.city);
    billTo.setState(billingUser.state);
    billTo.setZip(billingUser.zip);
    billTo.setCountry(billingUser.country);
    billTo.setPhoneNumber(billingUser.phone_no);
    billTo.setFaxNumber(billingUser.fax);
    billTo.setEmail(billingUser.email);

    var shipTo = new ApiContracts.CustomerAddressType();
    shipTo.setFirstName(order.first_name);
    shipTo.setLastName(order.last_name);
    shipTo.setCompany(order.email);
    shipTo.setAddress(order.address + ", " + order.unit + ", " + order.phone);
    shipTo.setCity(order.city);
    shipTo.setState(order.state);
    shipTo.setZip(order.zip);
    shipTo.setCountry(order.country);

    var lineItemList = [];
    order.products.forEach((p) => {
        var lineItem = new ApiContracts.LineItemType();
        lineItem.setItemId(p.sku);
        lineItem.setName("Size: " + p.size + ", Color: " + p.color);
        lineItem.setDescription(p.title);
        lineItem.setQuantity(p.quantity);
        lineItem.setUnitPrice(p.price);
        lineItemList.push(lineItem);
    });

    // var lineItems = new ApiContracts.ArrayOfLineItem();
    // lineItems.setLineItem(lineItems);

    // var lineItem_id1 = new ApiContracts.LineItemType();
    // lineItem_id1.setItemId('1');
    // lineItem_id1.setName('vase');
    // lineItem_id1.setDescription('cannes logo');
    // lineItem_id1.setQuantity('18');
    // lineItem_id1.setUnitPrice(45.00);

    // var lineItem_id2 = new ApiContracts.LineItemType();
    // lineItem_id2.setItemId('2');
    // lineItem_id2.setName('vase2');
    // lineItem_id2.setDescription('cannes logo2');
    // lineItem_id2.setQuantity('28');
    // lineItem_id2.setUnitPrice('25.00');

    // var lineItemList = [];
    // lineItemList.push(lineItem_id1);
    // lineItemList.push(lineItem_id2);

    var lineItems = new ApiContracts.ArrayOfLineItem();
    lineItems.setLineItem(lineItemList);


    // Custom fields
    // var userField_a = new ApiContracts.UserField();
    // userField_a.setName('A');
    // userField_a.setValue('Aval');

    // var userField_b = new ApiContracts.UserField();
    // userField_b.setName('B');
    // userField_b.setValue('Bval');

    // var userFieldList = [];
    // userFieldList.push(userField_a);
    // userFieldList.push(userField_b);

    // var userFields = new ApiContracts.TransactionRequestType.UserFields();
    // userFields.setUserField(userFieldList);



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
    transactionRequestType.setAmount(order.total_amount);
    transactionRequestType.setLineItems(lineItems);
    // transactionRequestType.setUserFields(userFields);
    transactionRequestType.setOrder(orderDetails);
    transactionRequestType.setTax(tax);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setShipTo(shipTo);
    transactionRequestType.setTransactionSettings(transactionSettings);

    var createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    //pretty print request
    // console.log(JSON.stringify(createRequest.getJSON(), null, 2));

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