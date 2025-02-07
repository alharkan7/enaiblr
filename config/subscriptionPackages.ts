export const subscriptionPackages = [
    {
      name: '1 Month',
      title: 'Akses 1 Bulan',
      price: 39000,
      priceTotal: 39000 * 1,
      priceOriginal: 99000 * 1,
      discount: Math.round((((99000 * 1) - (39000 * 1)) / (99000 * 1)) * 100),
      activeDays: 30 * 1
    },
    {
        name: '4 Months',
        title: 'Akses 4 Bulan',
        price: 25000,
        priceTotal: 25000 * 4,
        priceOriginal: 99000 * 4,
        discount: Math.round((((99000 * 4) - (25000 * 4)) / (99000 * 4)) * 100),
        activeDays: 30 * 4
      }
  ]

  export const subscriptionPackagesUS = [
    {
      name: '1 Month',
      title: '1 Month Access',
      price: 4.99,
      priceTotal: 4.99 * 1,
      priceOriginal: 19.99 * 1,
      discount: Math.round((((19.99 * 1) - (4.99 * 1)) / (19.99 * 1)) * 100),
      activeDays: 30 * 1
    },
    {
        name: '4 Months',
        title: '4 Months Access',
        price: 2.99,
        priceTotal: 2.99 * 4,
        priceOriginal: 19.99 * 4,
        discount: Math.round((((19.99 * 4) - (2.99 * 4)) / (19.99 * 4)) * 100),
        activeDays: 30 * 4
      }
  ]