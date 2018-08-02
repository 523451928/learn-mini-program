// [HomeIndex, StoreFacade, Product, ProductGroup, Order, Coupon, MiniAppAuthorize, MiniAppAudit, PaymentConfiguration, ForwardSetting, FreightTemplate, CustomerSetting]
export const permissionsData = [
  {
    id: -1,
    label: '店铺',
    children: [{
      id: 'StoreFacade',
      label: '店铺装修'
    }]
  },
  {
    id: -2,
    label: '商品',
    children: [
      {
        id: -3,
        label: '商品管理',
        children: [
          {
            id: 'Product',
            label: '全部商品'
          },
          {
            id: 'ProductGroup',
            label: '商品分组'
          }
        ]
      }
    ]
  },
  {
    id: -4,
    label: '订单',
    children: [{
      id: 'Order',
      label: '订单管理'
    }]
  },
  {
    id: -5,
    label: '营销',
    children: [
      {
        id: -6,
        label: '营销工具',
        children: [
          {
            id: 'Coupon',
            label: '优惠券'
          }
        ]
      }
    ]
  },
  {
    id: -7,
    label: '设置',
    children: [
      {
        id: -8,
        label: '微信设置',
        children: [
          {
            id: 'MiniAppAuthorize',
            label: '小程序授权'
          },
          {
            id: 'MiniAppAudit',
            label: '小程序审核'
          },
          {
            id: 'PaymentConfiguration',
            label: '支付配置'
          }
        ]
      },
      {
        id: -9,
        label: '分享设置',
        children: [
          {
            id: 'ForwardSetting',
            label: '分享内容'
          }
        ]
      },
      {
        id: -10,
        label: '运费模板',
        children: [
          {
            id: 'FreightTemplate',
            label: '模板管理'
          }
        ]
      },
      {
        id: -11,
        label: '客服工具',
        children: [
          {
            id: 'CustomerSetting',
            label: '客服设置'
          }
        ]
      }
    ]
  }
]