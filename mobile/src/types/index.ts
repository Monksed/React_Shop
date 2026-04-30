export interface UserDTO {
  id: string;
  username?: string;
  telegramId?: number;
  score?: number;
  fio?: string;
  address?: string;
  email?: string;
  phone?: string;
  image?: string;
}

export interface UserUpdateDTO {
  username?: string;
  fio?: string;
  address?: string;
  email?: string;
  phone?: string;
  image?: string;
}

export interface ProductDTO {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  bonus?: number;
  brandId?: string;
}

export interface BrandDTO {
  id: string;
  title?: string;
  image?: string;
}

export interface OrderItemDTO {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedSize?: string | null;
  image?: string | null;
}
export interface OrderDTO {
  id: string;
  status: string;
  createDate: string;
  totalPrice: number;
  items: OrderItemDTO[];
}

export interface CreateOrderItemDTO {
  productId: string;
  productName: string;
  quantity: number;
  selectedSize?: string | null;
  image?: string | null;
}

export interface CreateOrderDTO {
  items: CreateOrderItemDTO[];
}