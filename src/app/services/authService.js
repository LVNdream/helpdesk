const bcrypt = require("bcryptjs");
const authModel = require("../models/authModel");
const jwtService = require("./jwtService");
const jwt = require("jsonwebtoken");

class authService {
  async registerSevice(data) {
    try {
      const exist = await authModel.checkExistId(data.id);

      if (exist) {
        if (exist.status == false) {
          return {
            message: exist.message,
            status: exist.status,
            error: exist.error,
          };
        } else {
          const password_hash = bcrypt.hashSync(data.password, 8);
          const dataRegister = {
            ...data,
            password: password_hash,
            status_id: 1,
            role_id: 2,
          };
          const resultRegister = await authModel.register(dataRegister);


          return resultRegister
            ? resultRegister
            : { message: "Registered fail", status: false, error: 501 };
        }
      } else {
        return { message: "Server error find ID", status: false, error: 501 };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error registerSevice",
        status: false,
        error: 501,
      };
    }
  }

  async login(data) {
    try {
      const user = await authModel.findAccountById(data.id);
      if (!user) {
        return { message: "Error get account", status: false, error: 500 };
      }
      if (!user.id) {
        return { message: "Id not valid", status: true, error: 404 };
      }

      const validPass = await bcrypt.compareSync(
        data.password.toString(),
        user.password
      );
      if (!validPass) {
        return { message: "Password not valid", status: true, error: 404 };
      }
      const checked_firstLogin =
        user.first_login == 0 && user.status_id == 2 ? true : false;

      const resutlUpdateFirstLogin = await authModel.updateFirstLogin(user.id);
      if (!resutlUpdateFirstLogin) {
        return {
          message: "Server error upadteFirstLogin Model",
          status: false,
          error: 500,
        };
      }

      const dataToken = {
        id: parseInt(user.id),
        role_id: parseInt(user.role_id),
      };

      const accessToken = jwtService.generateAccessToken(dataToken);

      const refreshToken = jwtService.generateRefreshToken(dataToken);

      return {
        name: user.name,
        checked_firstLogin,
        accessToken,
        refreshToken,
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error login service",
        status: false,
        error: 501,
      };
    }
  }

  async checkId(data) {
    try {
      if (typeof data.id != typeof 123) {
        return {
          message: "Please enter number not string",
          status: true,
          error: 400,
        };
      }
      const exist = await authModel.checkExistId(data.id);
      if (exist) {
        return {
          message: exist.message,
          status: exist.status,
          error: exist.error,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error checkId service",
        status: false,
        error: 501,
      };
    }
  }

  async getBackId(data) {
    try {
      const resutl = await authModel.findId(data);

      if (!resutl.status) {
        return resutl;
      }
      console.log(resutl);
      if (resutl.data) {
        return resutl.data;
      } else {
        return {
          message: "ID have not found",
          status: false,
          error: 404,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error checkId service",
        status: false,
        error: 500,
      };
    }
  }

  // xac thuc pass de update thong tin user
  async verifyPassword(data, password) {
    try {
      const user = await authModel.findAccountById(data.id);
      if (!user) {
        return { message: "Error get account", status: false, error: 500 };
      }
      if (!user.id) {
        return { message: "Id not valid", status: false, error: 404 };
      }

      const validPass = await bcrypt.compareSync(
        password.toString(),
        user.password
      );
      if (!validPass) {
        return { message: "Password not valid", status: false, error: 404 };
      }

      return { message: "Verify successful", status: true, error: 200 };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error login service",
        status: false,
        error: 500,
      };
    }
  }
}
module.exports = new authService();
