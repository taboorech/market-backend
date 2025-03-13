import Cart from "../models/cart.model";
import User from "../models/user.model";

const getCart = async (user: User): Promise<Cart[]> => {
  const cartItems = await Cart.query()
    .where("user_id", user.id)
    .withGraphFetched("product")
    .modifyGraph("product", (builder) => {
      builder.select("id", "title", "price");
    });

  return cartItems;
}

export { getCart };