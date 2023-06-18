const messageUtil = require("../utilities/message");
const contactService = require("../services/contactService");
const {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  badRequestErrorResponse,
} = require("../utilities/response");
const HtmlGenerator = require("../utilities/email");
const mailer = require("../utilities/emailSender");

class Contact {
  CreateContact = async (req, res) => {
    let errors =[];
    const {
        sure_name,
        company,
        email,
        phone,
        message,
        authorized
    } = req.body;

    if (!sure_name) {
      errors.push("Sure Name");
    }

    if (!company) {
      errors.push("Company");
    }

    if (!email) {
      errors.push("Email");
    }
    
    if (!phone) {
        errors.push("Phone");
    }

    if (!message) {
        errors.push("Message");
    }
    
    if (!authorized) {
        errors.push("Authorized");
    }
    if (errors.length > 0) {
      errors = errors.join(", ");
      return badRequestErrorResponse(res, messageUtil.empytyField+errors);
    }
    try {
      let contact = await contactService.create({
        ...req.body,
      });

      if(!contact){
        return badRequestErrorResponse(res, messageUtil.recordNotCreated)
      }

      /*****Email***/
      var to = contact.email;
      var from = process.env.EMAIL_ADDRESS;
      let sellerEmail = HtmlGenerator.ContactEmail({
        sure_name: contact.sure_name,
        company: contact.company,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
      });
    //   let msg = `Your verification code is: ${user.resetToken}`;
      mailer.emailSender(to, from, sellerEmail.subject, sellerEmail.html);
      /********/
      
      return successResponse(res, messageUtil.QuoteAdded, contact);
    } catch (err) {
      console.log("error", err);
      return serverErrorResponse(res, err);
    }
  };

  GetAllContact = async (req, res) => {
    try {
      let contact = await contactService.getAll({...req.body});
      if (!contact) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.ok, contact);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  GetContactById = async (req, res) => {
    const { id } = req.params;
    try {
      let contact = await contactService.getOne({ _id: id });
      if (!contact) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.ok, contact);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };
  UpdateContact = async (req, res) => {
    const { id } = req.params;
    try {
      let contact = await contactService.update({ _id: id }, { ...req.body });
      if (!contact) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.updateSuccess, contact);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };
  DeleteContact = async (req, res) => {
    const { id } = req.params;
    let contact;
    try {
      contact = await contactService.delete({ _id: id });
      if (!contact) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.deleteSuccess, contact);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };
}
module.exports = new Contact();
