import type { TCartItemRequest, TLocalCartItem, TLocalCartStorage } from '@/types/cart/TCart';

const CART_STORAGE_KEY = 'jajaja_cart';

export class LocalCartStorage {
  static get(): TLocalCartStorage {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : { items: [], lastUpdated: new Date().toISOString() };
    } catch {
      return { items: [], lastUpdated: new Date().toISOString() };
    }
  }

  static set(cart: TLocalCartStorage): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('장바구니 저장 실패:', error);
    }
  }

  static clear(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  static addItem(
    item: TCartItemRequest & {
      productName: string;
      brand: string;
      optionName: string;
      productThumbnail: string;
      teamAvailable: boolean;
      teamPrice?: number;
      individualPrice?: number;
      discountRate?: number;
    },
  ): void {
    const cart = this.get();

    const unitPrice = item.unitPrice || 0;
    const totalPrice = item.totalPrice || unitPrice * item.quantity;

    const newItem: TLocalCartItem = {
      ...item,
      id: `local_${Date.now()}_${Math.random()}`,
      addedAt: new Date().toISOString(),
      unitPrice,
      totalPrice,
    };

    const existingIndex = cart.items.findIndex((cartItem) => cartItem.productId === item.productId && cartItem.optionId === item.optionId);

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
      cart.items[existingIndex].totalPrice = cart.items[existingIndex].unitPrice * cart.items[existingIndex].quantity;
    } else {
      cart.items.push(newItem);
    }

    cart.lastUpdated = new Date().toISOString();
    this.set(cart);
  }

  static removeItem(itemId: string): void {
    const cart = this.get();
    cart.items = cart.items.filter((item) => item.id !== itemId);
    cart.lastUpdated = new Date().toISOString();
    this.set(cart);
  }

  static updateQuantity(itemId: string, quantity: number): void {
    const cart = this.get();
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].totalPrice = cart.items[itemIndex].unitPrice * quantity;
      }
      cart.lastUpdated = new Date().toISOString();
      this.set(cart);
    }
  }

  static updateItem(productId: number, optionId: number, updates: Partial<TLocalCartItem>): void {
    const cart = this.get();
    const itemIndex = cart.items.findIndex((item) => item.productId === productId && item.optionId === optionId);

    if (itemIndex >= 0) {
      cart.items[itemIndex] = { ...cart.items[itemIndex], ...updates };
      if (updates.quantity !== undefined) {
        const unitPrice = updates.unitPrice ?? cart.items[itemIndex].unitPrice;
        cart.items[itemIndex].totalPrice = unitPrice * updates.quantity;
      }
      cart.lastUpdated = new Date().toISOString();
      this.set(cart);
    }
  }

  static removeByProductAndOption(productId: number, optionId?: number): void {
    const cart = this.get();
    cart.items = cart.items.filter((item) => {
      if (optionId !== undefined) {
        return !(item.productId === productId && item.optionId === optionId);
      }
      return item.productId !== productId;
    });
    cart.lastUpdated = new Date().toISOString();
    this.set(cart);
  }

  static removeMultiple(items: Array<{ productId: number; optionId?: number }>): void {
    const cart = this.get();
    items.forEach(({ productId, optionId }) => {
      cart.items = cart.items.filter((item) => {
        if (optionId !== undefined) {
          return !(item.productId === productId && item.optionId === optionId);
        }
        return item.productId !== productId;
      });
    });
    cart.lastUpdated = new Date().toISOString();
    this.set(cart);
  }

  static convertToServerFormat(): TCartItemRequest[] {
    const cart = this.get();
    return cart.items.map((item) => ({
      productId: item.productId,
      optionId: item.optionId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));
  }
}
