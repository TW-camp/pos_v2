'use strict';

//测试第一步
describe('pos', () => {
  it('#1|should format tags', () => {
    const tags=[
      'ITEM000001',
      'ITEM000002-2',
      'ITEM000001'
    ];

    let formattedTags = formatTags(tags);
    const expTags=[
      {
        barcode:'ITEM000001',
        count:1
      },
      {
        barcode:'ITEM000002',
        count:2
      },
      {
        barcode:'ITEM000001',
        count:1
      }
    ];
    expect(formattedTags).toEqual(expTags);
  });

  it('#2|should count barcodes', () => {
    const formattedTags=[
      {
        barcode:'ITEM000001',
        count:1
      },
      {
        barcode:'ITEM000002',
        count:2
      },
      {
        barcode:'ITEM000001',
        count:1
      }
    ];

    let countedBarcodes = countBarcodes(formattedTags);
    const expCounts=[
      {
        barcode:'ITEM000001',
        count:2
      },
      {
        barcode:'ITEM000002',
        count:2
      }
    ];

    expect(countedBarcodes).toEqual(expCounts);
  });

  it('#3|should build cart items', () => {
    const countedBarcodes=[
      {
        barcode:'ITEM000001',
        count:2
      },
      {
        barcode:'ITEM000002',
        count:2
      }
    ];

    let allItems = loadAllItems();
    let cartItems = buildCartItems(countedBarcodes,allItems);

    const expCarts = [
      {
        barcode:'ITEM000001',
        name:'雪碧',
        unit:'瓶',
        price:3.00,
        count:2
      },
      {
        barcode:'ITEM000002',
        name:'苹果',
        unit:'斤',
        price:5.50,
        count:2
      }
    ];

    expect(cartItems).toEqual(expCarts);

  });


  it('#4|shuld build promot items', () => {
    const cartItems=[
      {
        barcode:'ITEM000001',
        name:'雪碧',
        unit:'瓶',
        price:3.00,
        count:3
      },
      {
        barcode:'ITEM000004',
        name:'电池',
        unit:'个',
        price:2.00,
        count:20
      }
    ];

    let promotions = loadPromotions();
    let promotedItems = buildPromotedItems(cartItems,promotions);

    const expPromotedItems = [
      {
        barcode:'ITEM000001',
        name:'雪碧',
        unit:'瓶',
        price:3.00,
        count:3,
        payPrice:9,
        saved:0
      },

      {
        barcode:'ITEM000004',
        name:'电池',
        unit:'个',
        price:2.00,
        count:20,
        payPrice:38,
        saved:2
      }
    ];


    expect(promotedItems).toEqual(expPromotedItems);
  });

  it('#5|should calculate total prices', () => {
    const promotedItems = [
      {
        barcode:'ITEM000001',
        name:'雪碧',
        unit:'瓶',
        price:3.00,
        count:3,
        payPrice:9,
        saved:0
      },

      {
        barcode:'ITEM000004',
        name:'电池',
        unit:'个',
        price:2.00,
        count:20,
        payPrice:38,
        saved:2
      }
    ];

    let totalPrices = calculateTotalPrices(promotedItems);
    const expTotalPrices = {
      totalPayPrice:47,
      totalSaved:2
    };

    expect(totalPrices).toEqual(expTotalPrices);
  });


  it('#6|should build receipt',()=>{
    const promotedItems = [
      {
        barcode:'ITEM000001',
        name:'雪碧',
        unit:'瓶',
        price:3.00,
        count:3,
        payPrice:9,
        saved:0
      },

      {
        barcode:'ITEM000004',
        name:'电池',
        unit:'个',
        price:2.00,
        count:20,
        payPrice:38,
        saved:2
      }
    ];

    const totalPayPrices = {
      totalPayPrice:47,
      totalSaved:2
    };

    let receipt = buildReceipt(promotedItems,totalPayPrices);

    let expReceipt = {
      receiptItems:[
        {
          name:'雪碧',
          unit:'瓶',
          price:3.00,
          count:3,
          payPrice:9,
          saved:0
        },

        {
          name:'电池',
          unit:'个',
          price:2.00,
          count:20,
          payPrice:38,
          saved:2
        }
      ],
      totalPayPrice:47,
      totalSaved:2
    };

    expect(receipt).toEqual(expReceipt);

  });

  it('should print text', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000002-14',
      'ITEM000004-20',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];

    spyOn(console,'log');

    printReceipt(tags);

    const expText = `***<没钱赚商店>购物清单***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：15.00(元)
名称：苹果，数量：14斤，单价：5.50(元)，小计：73.15(元)，优惠：3.85(元)
名称：电池，数量：20个，单价：2.00(元)，小计：38.00(元)，优惠：2.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：13.50(元)
----------------------
批发价出售商品：
名称：苹果，数量：14斤
名称：电池，数量：20个
----------------------
总计：139.65(元)
节省：5.85(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expText);
  });

});



