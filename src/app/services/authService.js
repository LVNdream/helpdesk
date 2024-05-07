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
          return { message: exist.message, status: exist.status };
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
            : { message: "Registered fail", status: false };
        }
      } else {
        return { message: "Server error find ID", status: false };
      }
    } catch (error) {
      console.log(error);
      return { message: "Server error registerSevice", status: false };
    }
  }

  async login(data) {
    try {
      const user = await authModel.findAccountById(data.id);
      if (!user.status) {
        return { message: user.message, status: user.status };
      }
      if (!user.data) {
        return { message: "Id not valid", status: true };
      }

      const validPass = await bcrypt.compareSync(
        data.password.toString(),
        user.data.password
      );
      if (!validPass) {
        return { message: "Password not valid", status: true };
      }
      const dataToken = {
        id: parseInt(user.data.id),
        name: user.data.name,
        email: user.data.email,
        role_id: parseInt(user.data.role_id),
      };

      const accessToken = jwtService.generateAccessToken(dataToken);

      const refreshToken = jwtService.generateRefreshToken(dataToken);

      console.log(accessToken, refreshToken);

      return {
        message: "Login Successfull",
        data: {
          accessToken,
          refreshToken,
        },
        status: true,
      };
    } catch (error) {
      console.log(error);
      return { message: "Server error login service", status: false };
    }
  }

  async checkId(data) {
    try {
      const exist = await authModel.checkExistId(data.id);
      console.log(exist);
      if (exist) {
        return { message: exist.message, status: exist.status };
      }
    } catch (error) {
      console.log(error);
      return { message: "Server error checkId service", status: false };
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
        return {
          message: "ID have found",
          data: resutl.data,
          status: true,
        };
      } else {
        return {
          message: "ID have not found",
          data: resutl.data,
          status: false,
        };
      }
    } catch (error) {
      console.log(error);
      return { message: "Server error checkId service", status: false };
    }
  }
}
module.exports = new authService();
