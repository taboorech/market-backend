import * as yup from 'yup';
import { OrderStatus } from '../libs/enum/order-status.enum';

const updateOrderStatusValidation = yup.object().shape({
  order: yup.number().required('Order id can\'t be empty'),
  status: yup
    .mixed<OrderStatus>()
    .oneOf(Object.values(OrderStatus), `Order status must be one of the following: ${Object.values(OrderStatus).join(', ')}`)
    .required('Status must contain value'),
});

export { updateOrderStatusValidation };