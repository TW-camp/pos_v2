'use strict';

//测试第一步
describe('should format tags #1|formatTags()',function () {
  let tags=[
    'ITEM000001',
    'ITEM000002-2',
    'ITEM000001'
  ];
  it('format tags',function () {
    let result = formatTags(tags);
    let exp=[
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
    expect(result).toEqual(exp);
  });
});

//测试第二步
describe('should build counts of items #2|countBarcodes()',function () {
  let formattedTags=[
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
  it('countBarcodes function',function () {
    let result=countBarcodes(formattedTags);
    let exp=[
      {
        barcode:'ITEM000001',
        count:2
      },
      {
        barcode:'ITEM000002',
        count:2
      }
    ];

    expect(result).toEqual(exp);
  });
});

//测试第三步
describe('should build cart of items #3|buildCartItems()',function () {
    let countedBarcodes=[
      {
        barcode:'ITEM000001',
        count:2
      },
      {
        barcode:'ITEM000002',
        count:2
      }
    ];
  let allItems=loadAllItems();
  it('buildCartItems function',function () {
    let result=buildCartItems(countedBarcodes,allItems);
    let exp=[
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

    expect(result).toEqual(exp);
  });
});


//测试第四步
describe('should build promoted items #4|buildPromotedItems()',function () {
    let cartItems=[
      {
        barcode:'ITEM000001',
        name:'雪碧',
        unit:'瓶',
        price:3.00,
        count:3
      },
      {
        barcode:'ITEM000002',
        name:'苹果',
        unit:'斤',
        price:5.50,
        count:2
      }
    ];
    let promotions = loadPromotions();
  it('build promotedItems',function () {
    let result=buildPromotedItems(cartItems,promotions);
    let exp = [
      {
        barcode:'ITEM000001',
        name:'雪碧',
        unit:'瓶',
        price:3.00,
        count:3,
        payPrice:6,
        saved:3
      },
      {
        barcode:'ITEM000002',
        name:'苹果',
        unit:'斤',
        price:5.50,
        count:2,
        payPrice:11,
        saved:0
      }
    ];

    expect(result).toEqual(exp);
  });
});


//测试第五步
describe('should caculate total #5|caculateTotalPrices()',function () {
  let promotedItems = [
    {
      barcode:'ITEM000001',
      name:'雪碧',
      unit:'瓶',
      price:3.00,
      count:3,
      payPrice:6,
      saved:3
    },
    {
      barcode:'ITEM000002',
      name:'苹果',
      unit:'斤',
      price:5.50,
      count:2,
      payPrice:11,
      saved:0
    }
  ];

  it('caculate total',function () {
    let result = caculateTotalPrices(promotedItems);
    let exp={
      totalPayPrice:17,
      totalSaved:3
    };

    expect(result).toEqual(exp);
  });
});

//测试第六步
describe('should build receipt #6|buildReceipt()',function () {
  let promotedItems = [
    {
      barcode:'ITEM000001',
      name:'雪碧',
      unit:'瓶',
      price:3.00,
      count:3,
      payPrice:6,
      saved:3
    },
    {
      barcode:'ITEM000002',
      name:'苹果',
      unit:'斤',
      price:5.50,
      count:2,
      payPrice:11,
      saved:0
    }
  ];

  let totalPrices={
    totalPayPrice:17,
    totalSaved:3
  };

  it('build receipt',function () {
    let result = buildReceipt(promotedItems,totalPrices);
    let exp = {
      receiptItems:[
      {
        name:'雪碧',
        unit:'瓶',
        price:3.00,
        count:3,
        payPrice:6
      },
      {
        name:'苹果',
        unit:'斤',
        price:5.50,
        count:2,
        payPrice:11
      }
    ],
      totalPayPrice:17,
      totalSaved:3
  };

  expect(result).toEqual(exp);
  });
});


describe('pos', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
})
;
