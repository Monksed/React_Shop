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
