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
      price: 3,
      priceTotal: 3 * 1,
      priceOriginal: 10 * 1,
      discount: Math.round((((10 * 1) - (3 * 1)) / (10 * 1)) * 100),
      activeDays: 30 * 1
    },
    {
        name: '4 Months',
        title: '4 Months Access',
        price: 2.25,
        priceTotal: 2.25 * 4,
        priceOriginal: 10 * 4,
        discount: Math.round((((10 * 4) - (2.25 * 4)) / (10 * 4)) * 100),
        activeDays: 30 * 4
      }
  ]