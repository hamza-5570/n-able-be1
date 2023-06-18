const UserServices = require("../services/userService");
const { bcryptHash, comparePassword } = require("../utilities/password");
const messageUtil = require("../utilities/message");
const {
  successResponse,
  existAlreadyResponse,
  notFoundResponse,
  authorizationErrorResponse,
  serverErrorResponse,
  badRequestErrorResponse,
} = require("../utilities/response");
const jwtHelper = require("../utilities/jwt");

class Users {
  // custom singup function
  UserSignUp = async (req, res) => {
    let errors = [];

    const {
      email,
      password
    } = req.body;

    if (!email) {
      errors.push("Email");
    }

    if (!password) {
      errors.push("Password");
    }

    

    if (errors.length > 0) {
      errors = errors.join(", ");
      return badRequestErrorResponse(res, messageUtil.empytyField+errors);
    }
    try {
      let user = await UserServices.getUser({ email });
      if (user) {
        existAlreadyResponse(res, messageUtil.emailAlreadyExist);
      } else {
        user = await UserServices.createUser({
          ...req.body,
        });
        user.password = await bcryptHash(password);
        await user.save();

        successResponse(res, messageUtil.userRegister, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  UserLogin = async (req, res) => {
    const { email, password } = req.body;
    let errors = [];
    if (!email) {
      errors.push("Email");
    }

    if (!password) {
      errors.push("Password");
    }

    if (errors.length > 0) {
      errors = errors.join(", ");
      return res.send({
        message: `Please insert: ${errors}`,
        status: "400",
      });
    }
    let user;
    try {
      user = await UserServices.getUser({ email });
      if (!user) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return authorizationErrorResponse(res, messageUtil.incorrectPassword);
        }
        const token = jwtHelper.issue({ id: user._id });
        return successResponse(res, messageUtil.ok, user, token);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  UserAuth = async (req, res) => {
    try {
      let user = await UserServices.getUser({ _id: req.userId });
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        // const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.ok, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  GetAllUsers = async (req, res) => {
    let user;
    try {
      user = await UserServices.getAllUsers({ ...req.body });
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        successResponse(res, messageUtil.ok, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  GetUserById = async (req, res) => {
    const { customerId } = req.params;
    console.log("customerId", customerId);
    let user;
    try {
      user = await UserServices.getUser({ _id: customerId });
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        // const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.ok, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  UpdateUser = async (req, res) => {
    const { customerId } = req.params;
    console.log("customerId", customerId);
    let user;
    try {
      user = await UserServices.updateUserById(
        { _id: customerId },
        { ...req.body }
      );
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        // const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.updateSuccess, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };
  UpdateUserPassword = async (req, res) => {
    const { newPassword, password, sure_name } = req.body;
    let errors = [];

    if (!newPassword) {
      errors.push("New password");
    }

    if (!password) {
      errors.push("Password");
    }

    if (errors.length > 0) {
      // errors = errors.join(" ,");
      return res.send({
        message: `Please insert: ${errors}`,
        status: "400",
      });
    }

    try {
      const { customerId } = req.params;
      let user = await UserServices.getUser({
        _id: customerId,
      });

      if (user) {
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
          return authorizationErrorResponse(
            res,
            messageUtil.incorrectOldPassword
          );
        }

        user.password = await bcryptHash(newPassword);

        let updatedUser = await UserServices.updateUserById(
          { _id: customerId },
          { ...user,
            sure_name: sure_name ? sure_name:user.sure_name
           }
        );

        return successResponse(res, messageUtil.updateSuccess, updatedUser);
      } else {
        return notFoundResponse(res, messageUtil.NotFound);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  DeleteUser = async (req, res) => {
    const { customerId } = req.params;
    console.log("ider aya")
    let user;
    try {
      user = await UserServices.getUser({_id: req.userId});
      if(user.role != "admin")
      {
        return authorizationErrorResponse(res, messageUtil.unAuthorized)
      }
      user = await UserServices.deleteUserById(
        { _id: customerId }
      );
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        // const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.updateSuccess, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };
}
module.exports = new Users();
