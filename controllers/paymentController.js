const stripe = require("stripe")(
  "sk_test_51L8gJIGcwuk8geTIREM1gnrSkaRoyJjXTTFvVKvCCaSxCeVpHeSmGVl4kg1jVACkuqqDBpciX0SwSU7VaDVruf9M001MTxJJQa"
);
const messageUtil = require("../utilities/message");
const paymentService = require("../services/paymentService");
const userServices = require("../services/userService")
const { bcryptHash, comparePassword } = require("../utilities/password");
const {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  badRequestErrorResponse,
  existAlreadyResponse
} = require("../utilities/response");
const HtmlGenerator = require("../utilities/email");
const mailer = require("../utilities/emailSender");

class Payment {

  CreateSubscription = async (req, res) => {
    const { sure_name, email, token, amount, useage, gbs, data_storage } = req.body;
    console.log({...req.body})
    const penny = Math.round(amount * 100)
    try {
      let user = await userServices.getUser({ email });
      if (user) {
        return existAlreadyResponse(res, messageUtil.emailAlreadyExist);
      }
      console.log("enter hua", req.body.payment_method)
      let customer = await stripe.customers.create({
        email: email,
        name: sure_name,
      });

      console.log("customer", customer)
      const card = await stripe.customers.createSource(customer.id, {
        source: token,
      });

      console.log("card",card)
      const product = await stripe.products.create({
        name: "N-ABLE"
      });
     
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ 
          price_data: {
            currency: "USD",
            product: product.id,
            unit_amount: penny,
            recurring:{
              interval: 'month'
            }
          }
         }],
        expand: ["latest_invoice.payment_intent"],
      });
  
      if (!subscription) {
        return badRequestErrorResponse(res, messageUtil.subscriptionNot);
      }
       
      const length = 8;
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
      }
      console.log("yahan tak aya")
       user = await userServices.createUser({
         email,
         useage,
         data_storage,
         sure_name,
         password: password
        });

        user.password = await bcryptHash(password);
        await user.save();
      if (!user) {
        return badRequestErrorResponse(res, messageUtil.recordNotCreated);
      }

      let payment = await paymentService.create({
        user_id: user._id,
        gbs,
        sure_name,
        customer_id: customer.id,
        amount: subscription.items.data[0].plan.amount / 100,
        subscription_id: subscription.id,
        product_id: product.id
      });

      if (!payment) {
        return badRequestErrorResponse(res, messageUtil.recordNotCreated);
      }

      user = await userServices.updateUserById(
        { email: email },
        { payment_id: payment._id, payment_status: true }
      );
      
       /*****Email***/
       var to = user.email;
       var from = process.env.EMAIL_ADDRESS;
       let sellerEmail = HtmlGenerator.SignUpEmail({
         email: user.email,
         password: password
       });
     //   let msg = `Your verification code is: ${user.resetToken}`;
       mailer.emailSender2(to, from, sellerEmail.subject, sellerEmail.html);
       /********/
      return successResponse(res, messageUtil.checkEmail, payment);
    } catch (error) {
      return serverErrorResponse(res, error);
    }
  };

  GetAllPayment = async (req, res) => {
    try {
      let payment = await paymentService.getAll({...req.body});
      if (!payment) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.ok, payment);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  GetPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
      let payment = await paymentService.getOne({ _id: id });
      if (!payment) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.ok, payment);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  UpdateCard = async (req, res) => {
    const { id } = req.params;
    const {token, sure_name, country} = req.body;
    try {
      let payment = await paymentService.getOne({user_id: id}) 
      console.log(payment.customer_id);

      let customer = await stripe.customers.update(payment.customer_id, {
        source: token
      });
      console.log(customer)

      payment = await paymentService.update({ _id: payment._id }, { 
        customer_id: customer.id,
        sure_name: sure_name,
       });
      if (!payment) {
        return notFoundResponse(res, messageUtil.NotFound);
      }
      await userServices.updateUserById({_id: id}, 
        {sure_name: sure_name,
          country: country
        }) 
        return successResponse(res, messageUtil.updateSuccess, payment);
      
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  UpdateSubscription = async (req, res) => {
    const { id } = req.params;
    const {amount, gbs} = req.body;
    try {
      
      let payment = await paymentService.getOne({user_id: id}) 

      const price = await stripe.prices.create({
        product: payment.product_id,
        unit_amount: amount,
        currency: "usd",
        recurring: {
          interval: "month",
        },
      });
      const subscription = await stripe.subscriptions.retrieve(payment.subscription_id);
      const updatedSubscription = await stripe.subscriptions.update(payment.subscription_id, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: price.id, // Replace with the new price ID for the increased package
          },
        ],
      });

      console.log("----->",updatedSubscription)
      await stripe.charges.create({
        amount: amount*100,
        currency: 'usd',
        customer: payment.customer_id,
      });
     
      payment = await paymentService.update({ _id: payment._id }, { 
        subscription_id: updatedSubscription.id,
        amount,
        gbs
       });
      if (!payment) {
        return notFoundResponse(res, messageUtil.NotFound);
      }
    
        return successResponse(res, messageUtil.updateSuccess, payment);
      
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };



  UpdatePayment = async (req, res) => {
    const { id } = req.params;
    try {
      let payment = await paymentService.update({ _id: id }, { ...req.body });
      if (!payment) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.updateSuccess, payment);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };
  DeletePayment = async (req, res) => {
    const { id } = req.params;
    let payment;
    try {
      payment = await paymentService.delete({ _id: id });
      if (!payment) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.deleteSuccess, payment);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };
}
module.exports = new Payment();
