import { CustomerRepository } from "./customer.repository";
import { CustomerService } from "./customer.service";
import { CustomerController } from "./customer.controller";

export const customerRepository = new CustomerRepository();
export const customerService = new CustomerService(customerRepository);
export const customerController = new CustomerController(customerService);


