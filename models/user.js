/* 
* User login model.
* DEV-NOTE: This does NOT have authentication yet.
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logger = require('../utils/logger');


const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }]
  }
});


// The 'methods' property in mongoose.Schema allows us to create our own 
// methods that we can call from the object.
// N.B. We do not use an arrow function to make sure that that the 
// 'this' keyword refers to the 'userSchema' object in this context.
//
// Adds a cart item to the current user's cart.
userSchema.methods.addToCart = function (product) {
  // Check if the product is already in the cart.
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  // Update cart quantity
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  }
  // Otherwise, add new item to cart.
  else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;

  return this.save();
}

// Removes an item (regardless of quantity) from the current
// user's cart.
userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString()
  });
  this.cart.items = updatedCartItems;
  return this.save();
}

// Clears the current user's cart.
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
}

module.exports = mongoose.model('User', userSchema);



// const mongodb = require('mongodb');

// const logger = require('../utils/logger');
// const getDb = require('../utils/database').getDb;

// // Documents to access in MongoDB.
// const _USERS = 'Users';
// const _PRODUCTS = 'dummy';
// const _ORDERS = 'Orders';

// class User {

//   // Schema
//   // _id: mongodb.ObjectId()
//   // username: string
//   // email: string
//   // cart: [items]
//   constructor(id, username, email, cart) {
//     this._id = new mongodb.ObjectId(id);
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//   }

//   // Saves
//   save() {
//     const db = getDb();

//     return db
//       .collection(_USERS)
//       .insertOne(this)
//       .then(result => {
//         logger.plog("Made a new user in Mongo!");
//         //console.log(result);
//       })
//       .catch(err => { throw err; });
//   }

//   // Fetches the user's cart.
//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });

//     return db
//       .collection(_PRODUCTS)
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       // Product details from cart.
//       .then(products => {
//         // Transform the cart to get the correct details + qty.
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }

//   // Saves a product into a user's cart.
//   addToCart(product) {

//     // Check if the product is already in the cart.
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     // Update cart quantity
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     }
//     // Otherwise, add new item to cart.
//     else {
//       updatedCartItems.push({
//         productId: product._id,
//         quantity: newQuantity
//       });
//     }

//     const updatedCart = { items: updatedCartItems };

//     const db = getDb();
//     return db
//       .collection(_USERS)
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   // Deletes a product from a user's cart.
//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString()
//     });

//     const db = getDb();
//     return db
//       .collection(_USERS)
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   // Add cart to orders then reset cart locally and in DB.
//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       // Insert cart into order
//       .then(products => {
//         const orderDetails = {
//           items: products,
//           user: {
//             _id: this._id,
//             name: this.username,
//             email: this.email
//           }
//         };

//         return db.collection(_ORDERS).insertOne(orderDetails);
//       })
//       // Reset cart locally and in database.
//       .then(result => {
//         this.cart = { items: [] };
//         return db
//           .collection(_USERS)
//           .updateOne(
//             { _id: this._id },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch(err => console.log(err));
//   }

//   // Same as addOrder() but checks if the products in the cart still exists
//   // in the database.
//   // For cases where some products have been removed or modified,
//   // this will inform the user the database has changed and therefore
//   // the cart will be reset.
//   addOrderSafely() {
//     // Implement later...
//   }

//   // Fetches all orders for the user
//   getOrders() {
//     const db = getDb();

//     return db
//       .collection(_ORDERS)
//       .find({ 'user._id': this._id })
//       .toArray();
//   }

//   // Finds a user within MongoDB via their ID.
//   static findById(userId) {
//     const db = getDb();

//     return db
//       .collection(_USERS)
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then(user => { return user; })
//       .catch(err => { throw err; });
//   }
// }

// module.exports = User;