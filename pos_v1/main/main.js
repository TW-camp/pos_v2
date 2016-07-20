'use strict';

//全部商品信息
var allItems=[
  {
    barcode: 'ITEM000000',
    name: '可口可乐',
    unit: '瓶',
    price: 3.00
  },

  {
    barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3.00
  },

  {
    barcode: 'ITEM000002',
    name: '羽毛球',
    unit: '个',
    price: 1.00
  },

  {
    barcode: 'ITEM000003',
    name: '荔枝',
    unit: '斤',
    price: 15.00
  },

  {
    barcode: 'ITEM000004',
    name: '乒乓球',
    unit: '个',
    price: 1.00
  },

  {
    barcode: 'ITEM000005',
    name: '方便面',
    unit: '袋',
    price: 4.50
  }

];

//全部商品优惠信息
var promotions=[
  {
    type: 'BUY_TWO_GET_ONE_FREE',
    barcodes: [
      'ITEM000005',
      'ITEM000001'
    ]
  },
  {
    type: 'OTHER_PROMOTION',
    barcodes: [
      'ITEM000003',
      'ITEM000004'
    ]
  }
];

function printReceipt(buyedBarcodes){
  var itemBarcode = buyedBarcodes;

  //提取商品码和商品数量
  function getCount(itemBarcodes){
    var temp;
    var flag;
    var i;
    var itemCounts=[];
    var arr1=[],arr2=[],arr3=[];
    var tempCode,tempCount;

    for(i=0; i<itemBarcodes.length; i++){
      if (itemBarcodes[i].length<=10) {
        arr1.push(itemBarcodes[i]);
      }
      else{
        arr3.push(itemBarcodes[i]);
      }


    }


    for(i=0; i<arr1.length; i++){
      if (arr2.indexOf(arr1[i])<0) {
        arr2.push(arr1[i]);
      }
    }

    for(i=0; i<arr2.length; i++){

      flag=0;
      temp=arr2[i];
      for(var j=0;j<arr1.length;j++){
        if (temp==arr1[j]) {
          flag++;
        }
      }
      itemCounts.push({barcode:arr2[i],count:flag})

    }

    for(i=0;i<arr3.length;i++){
      tempCode=arr3[i].substr(0,10);
      tempCount=parseInt(arr3[i].substr(11));
      itemCounts.push({barcode:tempCode,count:tempCount});
    }

    return itemCounts;

  }

  //获取所购商品的全部信息
  function loadAllItems (itemCounts) {
    var itemDetails=[],i;


    for(i=0;i<itemCounts.length;i++){
      itemDetails.push({barcode:itemCounts[i].barcode,count:itemCounts[i].count});
    }

    for(i=0;i<itemDetails.length;i++){
      for(var j=0;j<allItems.length;j++){
        if (itemDetails[i].barcode==allItems[j].barcode) {
          itemDetails[i].name=allItems[j].name;
          itemDetails[i].unit=allItems[j].unit;
          itemDetails[i].price=allItems[j].price;
        }
      }
    }

    return itemDetails;
  }

  //获取优惠商品信息
  function loadPromotions(itemDetails){
    var purchasedItems=[];
    var i,sale;

    for(i=0;i<itemDetails.length;i++){
      purchasedItems.push({barcode:itemDetails[i].barcode,name:itemDetails[i].name,unit:itemDetails[i].unit,price:itemDetails[i].price,count:itemDetails[i].count,discount:0});
    }

    for(i=0;i<promotions.length;i++){
      if (promotions[i].type=='BUY_TWO_GET_ONE_FREE') {
        sale=promotions[i].barcodes;
        break;
      }
    }

    for(i=0;i<purchasedItems.length;i++){
      for(var j=0;j<sale.length;j++){
        if(purchasedItems[i].barcode==sale[j]){
          if (purchasedItems[i].count>=3) {
            purchasedItems[i].discount=Math.floor(purchasedItems[i].count/3);
            //买二赠一是买大于或等于2个只送一个还是满3增1？
          }
          else {
            purchasedItems[i].discount=0;
          }

        }

      }
    }

    return purchasedItems;

  }

  //计算商品小计、总金额和优惠金额
  function getPrice(purchasedItems){
    var priceTotal=[];
    var aTotal=0,aOrigin=0;
    var i;
    for(i=0;i<purchasedItems.length;i++){
      priceTotal.push({barcode:purchasedItems[i].barcode,name:purchasedItems[i].name,unit:purchasedItems[i].unit,price:purchasedItems[i].price,count:purchasedItems[i].count,discount:purchasedItems[i].discount})
    }

    for(i=0;i<priceTotal.length;i++){
      priceTotal[i].origintotal=priceTotal[i].price*priceTotal[i].count;
      priceTotal[i].subtotal=priceTotal[i].price*(priceTotal[i].count-priceTotal[i].discount);
    }

    for(i=0;i<priceTotal.length;i++){
      aTotal+=priceTotal[i].subtotal;
      aOrigin+=priceTotal[i].origintotal
    }

    priceTotal.push({total:aTotal,saletotal:aOrigin-aTotal});

    return priceTotal;
  }

  //将商品转为字符串并输出
  function outPut (priceTotal) {
    var i;

    function priceSort(price) {
      var temp;
      for(i=0;i<price.length-2;i++){
        if(parseInt(price[i].barcode.substr(4)) > parseInt(price[i+1].barcode.substr(4))){
          temp = price[i];
          price[i] =price[i+1];
          price[i+1]=temp;
        }
      }
      return price;
    }

   priceSort(priceTotal);

    var receipt="***<没钱赚商店>收据***"+"\n";
    for(i=0;i<priceTotal.length-1;i++){
      receipt+="名称:"+priceTotal[i].name+",数量:"+priceTotal[i].count+priceTotal[i].unit+",单价:"+priceTotal[i].price.toFixed(2)+"(元),小计:"+priceTotal[i].subtotal.toFixed(2)+"(元)\n";
    }

    receipt+="----------------------\n";
    receipt+="总计:"+priceTotal[priceTotal.length-1].total.toFixed(2)+"(元)\n";
    receipt+="节省:"+priceTotal[priceTotal.length-1].saletotal.toFixed(2)+"(元)\n";
    receipt+="**********************";
    console.log(receipt);
  }

  return outPut(getPrice(loadPromotions(loadAllItems(getCount(itemBarcode)))));
}

console.log(printReceipt([
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2',
  'ITEM000005',
  'ITEM000005',
  'ITEM000005'
]));


