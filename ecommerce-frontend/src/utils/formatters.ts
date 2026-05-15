export const formatPrice = (price: number): string => {
  if (!price || price === 0) {
    return 'Hết hàng';
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
