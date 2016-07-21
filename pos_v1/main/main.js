'use strict';

function _getExistElementByBarcode(array, barcode) {
  for (let countItem of array) {
    if (countItem.barcode === barcode) {
      return countItem;
    }
  }

  return null;
}

function formatTags(tags) {
  let result = [];
  for (let tag of tags) {
    if (tag.indexOf('-') === -1) {
      result.push({barcode: tag, count: 1});
    } else {
      let temp = tag.split('-');
      result.push({barcode: temp[0], count: parseInt(temp[1])});
    }
  }

  return result;
}

function countBarcodes(formattedTags) {
  let result = [];
  for (let formattedTag of formattedTags) {
    let countItem = _getExistElementByBarcode(result, formattedTag.barcode);
    if (countItem === null) {
      result.push({barcode: formattedTag.barcode, count: formattedTag.count});
    } else {
      countItem.count += formattedTag.count;
    }
  }
  return result;
}


function buildCartItems(countedBarcodes, allItems) {
  let result = [];
  for (let countedBarcode of countedBarcodes) {
    let countItem = _getExistElementByBarcode(allItems, countedBarcode.barcode);
    result.push({
      barcode: countItem.barcode,
      name: countItem.name,
      unit: countItem.unit,
      price: countItem.price,
      count: countedBarcode.count
    });
  }
  return result;
}

function buildPromotedItems(cartItems, promotions) {
  let result = [];
  let currentPromotion = promotions[0];
  for (let element of cartItems) {
    let saved = 0;
    let hasPromoted = false;
    for (let barcode of currentPromotion.barcodes) {
      if (element.barcode === barcode) {
        hasPromoted = true;
      }
    }
    if (currentPromotion.type === 'BUY_TWO_GET_ONE_FREE' && hasPromoted === true) {
      saved = element.price * Math.floor(element.count / 3);
    }
    let payPrice = element.price * element.count - saved;
    result.push({
      barcode: element.barcode,
      name: element.name,
      unit: element.unit,
      price: element.price,
      count: element.count,
      payPrice,
      saved
    });
  }
  return result;
}


function caculateTotalPrices(promotedItems) {
  let result = {
    totalPayPrice: 0,
    totalSaved: 0
  };

  for (let item of promotedItems) {
    result.totalPayPrice += item.payPrice;
    result.totalSaved += item.saved;
  }

  return result;
}

function buildReceipt(promotedItems, totalPrices) {
  let receiptItems = [];
  for (let item of promotedItems) {
    receiptItems.push({
      name: item.name,
      unit: item.unit,
      price: item.price,
      count: item.count,
      payPrice: item.payPrice
    });
  }

  let result = {
    receiptItems,
    totalPayPrice: totalPrices.totalPayPrice,
    totalSaved: totalPrices.totalSaved
  };
  return result;
}


function printReceiptString(receipt) {
  let result=`***<没钱赚商店>收据***\n`
  for(let item of receipt.receiptItems){
      result+=`名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${item.payPrice.toFixed(2)}(元)`
      result+=`\n`;
  }

  result+=`----------------------
总计：${receipt.totalPayPrice.toFixed(2)}(元)
节省：${receipt.totalSaved.toFixed(2)}(元)
**********************`;
  console.log(result);

}

function printReceipt(tags) {
  let formattedTags=formatTags(tags);
  let countedBarcodes=countBarcodes(formattedTags);

  let allItems=loadAllItems();
  let cartItems=buildCartItems(countedBarcodes,allItems);

  let promotion=loadPromotions();
  let promotedItems = buildPromotedItems(cartItems,promotion);

  let totalPrices= caculateTotalPrices(promotedItems);

  let receipt = buildReceipt(promotedItems,totalPrices);
  return printReceiptString(receipt);
}

