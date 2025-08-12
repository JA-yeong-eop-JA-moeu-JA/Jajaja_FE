export interface IOrderProductDeliveryResult {
  invoiceNumber: string;
  courier: string;
  delivery: {
    name: string;
    phone: string;
    address: string;
  };
}