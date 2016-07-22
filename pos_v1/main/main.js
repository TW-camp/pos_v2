function _getExistElementByBarcode(array, barcode) {
  return array.find((countItem) => {
    return countItem.barcode === barcode;
  });
}

function formatTags(tags) {
  return tags.map((tag) => {
    if (tag.includes('-')) {
      let temps = tag.split('-');
      return {barcode: temps[0], count: parseInt(temps[1])};
    } else {
      return {barcode: tag, count: 1};
    }
  });
}

function countBarcodes(formattedTags) {
  let result=[];

  formattedTags.forEach((formattedTag) => {
    let countItem = _getExistElementByBarcode(result,formattedTag.barcode);

    if(countItem === undefined){
      result.push({barcode:formattedTag.barcode,count:formattedTag.count});
    }else {
      countItem.count+=formattedTag.count;
    }

  });

  return result;
}

function buildCartItems(countedBarcodes,allItems) {
  let result=[];

  countedBarcodes.forEach((countedBarcode) => {
    let countItem = _getExistElementByBarcode(allItems,countedBarcode.barcode);
        result.push({
        barcode:countItem.barcode,
        name:countItem.name,
        unit:countItem.unit,
        price:countItem.price,
        count:countedBarcode.count
      });


  });

  return result;
}


function buildPromotedItems(cartItems, promotions) {
  let result = [];

  let currentPromotion = promotions.find((promotion) => {
    return promotion.type === 'BUY_GREATER_THAN_TEN_GET_95%_DISCOUNT';
  });

  cartItems.forEach((cartItem) => {
    let hasPromoted = false;
    let saved = 0;

    currentPromotion.barcodes.forEach((barcode) => {
      if (barcode === cartItem.barcode && cartItem.count > 10) {
        hasPromoted = true;
      }
    });

    if (hasPromoted) {
      saved = (cartItem.price * 0.05) * cartItem.count;
    }

    let payPrice = cartItem.price * cartItem.count - saved;

    result.push({
      barcode: cartItem.barcode,
      name: cartItem.name,
      unit: cartItem.unit,
      price: cartItem.price,
      count: cartItem.count,
      payPrice,
      saved
    });
  });

  return result;
}



function calculateTotalPrices(promotedItems) {
  var result = {
    totalPayPrice:0,
    totalSaved:0
  };

  promotedItems.forEach((promotedItem) => {
    result.totalPayPrice+=promotedItem.payPrice;
    result.totalSaved+=promotedItem.saved;
  });

  return result;
}



function buildReceipt(promotedItems,totalPayPrices) {
  let receiptItems = [];

  promotedItems.forEach((promotedItem) => {
    receiptItems.push({
      name:promotedItem.name,
      unit:promotedItem.unit,
      price:promotedItem.price,
      count:promotedItem.count,
      payPrice:promotedItem.payPrice,
      saved:promotedItem.saved
    });
  });
  let result={
    receiptItems,
    totalPayPrice:totalPayPrices.totalPayPrice,
    totalSaved:totalPayPrices.totalSaved
  };

  return result;
}


function buildReceiptString(receipt) {
  let receiptString="";
  let result;

  let totalPayPrice = receipt.totalPayPrice;
  let promotionText="",promotionString="",text="";
  let totalSaved = receipt.totalSaved;

  receipt.receiptItems.forEach((receiptItem) => {
    if(receiptItem.saved !== 0){
      receiptString +=`名称：${receiptItem.name}，数量：${receiptItem.count}${receiptItem.unit}，单价：${receiptItem.price.toFixed(2)}(元)，小计：${receiptItem.payPrice.toFixed(2)}(元)，优惠：${receiptItem.saved.toFixed(2)}(元)`;
      receiptString+="\n";

      text=`批发价出售商品：\n`;
      promotionString+=`名称：${receiptItem.name}，数量：${receiptItem.count}${receiptItem.unit}`;
      promotionString+="\n";

      promotionText = `----------------------`;


    }else {
      receiptString +=`名称：${receiptItem.name}，数量：${receiptItem.count}${receiptItem.unit}，单价：${receiptItem.price.toFixed(2)}(元)，小计：${receiptItem.payPrice.toFixed(2)}(元)`;
      receiptString+="\n";
      promotionString+="";
      promotionText+="";
    }

    result = `***<没钱赚商店>购物清单***
${receiptString}${promotionText}
${text}${promotionString}----------------------
总计：${totalPayPrice.toFixed(2)}(元)
节省：${totalSaved.toFixed(2)}(元)
**********************`;
  });

  return result;
}

function printReceipt(tags) {
  let formattedTags = formatTags(tags);
  let countedBarcodes = countBarcodes(formattedTags);
  let allItems = loadAllItems();
  let cartItems = buildCartItems(countedBarcodes,allItems);
  let promotions = loadPromotions();
  let promotedItems = buildPromotedItems(cartItems,promotions);
  let totalPayPrices = calculateTotalPrices(promotedItems);
  let receipt = buildReceipt(promotedItems,totalPayPrices);
  let receiptText = buildReceiptString(receipt);
  console.log(receiptText);

}
