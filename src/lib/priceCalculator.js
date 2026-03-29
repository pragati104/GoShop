export const priceCalculator = (price, discount) => {
  const discountedAmount = (price * discount) / 100;
  const afterDiscountedPrice = price - discountedAmount;
  return afterDiscountedPrice;
};
