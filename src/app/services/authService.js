const bcrypt = require("bcryptjs");
const authModel = require("../models/authModel");
const adminModel = require("../models/adminModel");

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
          };
        } else {
          const password_hash = bcrypt.hashSync(data.password, 8);
          const dataRegister = {
            ...data,
            password: password_hash,
            status_id: 1,
            role_id: 4,
          };
          const resultRegister = await authModel.register(dataRegister);

          return resultRegister
            ? resultRegister
            : { message: "Registered fail", status: false, error: 500 };
        }
      } else {
        return { message: "Server error find ID", status: false, error: 500 };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error registerSevice",
        status: false,
        error: 500,
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
        return { message: "Id not valid", status: false, error: "404_id" };
      }
      if (user.status_id != 2) {
        if (user.status_id == 1) {
          return {
            message: "Account is waitting accept from admin",
            status: false,
            error: "wait",
          };
        } else if (user.status_id == 3) {
          return {
            message: "Account was denied from admin",
            status: false,
            error: "denied",
          };
        } else if (user.status_id == 4) {
          return {
            message: "Account was block from admin",
            status: false,
            error: "block",
          };
        } else if (user.status_id == 5) {
          return {
            message: "Account policy volidation",
            status: false,
            error: "pv",
          };
        } else if (user.status_id == 6) {
          return {
            message: "Account stop working",
            status: false,
            error: "acc_die",
          };
        }
      }
      const timeLastLogin = new Date(user.last_login);

      const stopWorkingTime =
        (Date.now() - timeLastLogin.getTime()) / (1000 * 3600 * 24);

      if (stopWorkingTime >= 30) {
        const resultUpdateStatus = await adminModel.updateUserStatus(
          user.id,
          6
        );
        if (!resultUpdateStatus) {
          return {
            message: "Server error upadteStatus Model",
            status: false,
            error: 500,
          };
        }
        return {
          message: "Account not working a long time",
          status: false,
          error: "acc_die",
        };
      }

      if (user.count_login >= 10) {
        return {
          message: "User policy violation",
          status: false,
          error: "pv",
        };
      }
      const validPass = await bcrypt.compareSync(
        data.password.toString(),
        user.password
      );

      if (!validPass) {
        const countLogin = user.count_login + 1;
        if (countLogin >= 10) {
          const resultUpdateStatus = await adminModel.updateUserStatus(
            user.id,
            5
          );
          if (!resultUpdateStatus) {
            return {
              message: "Server error resultUpdateStatus Model",
              status: false,
              error: 500,
            };
          }
        }
        const resutlUpdateCountLogin = await authModel.updateCountLogin(
          user.id,
          countLogin
        );
        if (!resutlUpdateCountLogin) {
          return {
            message: "Server error upadteCountLogin Model",
            status: false,
            error: 500,
          };
        }
        return {
          message: "Password not valid",
          status: false,
          error: "f_pw",
        };
      }

      // reset password

      // 0 la khong yeu cau cap lai mat khau
      const result_update = await authModel.updateResetPass(user.id, 0);
      if (!result_update) {
        return {
          message: "Server error updateResetPass",
          status: false,
          error: 500,
        };
      }

      const resutlResetCountLogin = await authModel.updateCountLogin(
        user.id,
        0
      );
      if (!resutlResetCountLogin) {
        return {
          message: "Server error upadteCountLogin Model",
          status: false,
          error: 500,
        };
      }

      const resutlUpdateLastLogin = await authModel.updateLastTimeLogin(
        user.id,
        "now()"
      );
      if (!resutlUpdateLastLogin) {
        return {
          message: "Server error UpdateLastLogin Model",
          status: false,
          error: 500,
        };
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
        role_id: user.role_id,
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
        error: 500,
      };
    }
  }

  async handleRefreshToken(user) {
    try {
      const dataToken = {
        id: parseInt(user.id),
        role_id: parseInt(user.role_id),
      };

      const accessToken = jwtService.generateAccessToken(dataToken);
      const refreshToken = jwtService.generateRefreshToken(dataToken);

      return {
        name: user.name,
        role_id: user.role_id,
        accessToken,
        refreshToken,
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error handleRefreshToken service",
        status: false,
        error: 500,
      };
    }
  }

  async loginAdmin(data) {
    try {
      const user = await authModel.findAccountById(data.id);
      if (!user) {
        return { message: "Error get account", status: false, error: 500 };
      }
      if (!user.id) {
        return { message: "Id not valid", status: false, error: "404_id" };
      }

      const validPass = await bcrypt.compareSync(
        data.password.toString(),
        user.password
      );

      if (!validPass) {
        return {
          message: "Password not valid",
          status: false,
          error: "f_pw",
        };
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
        role_id: user.role_id,
        accessToken,
        refreshToken,
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error login service",
        status: false,
        error: 500,
      };
    }
  }

  async updatePassword(data) {
    try {
      // console.log(data)
      const resultUpdate = await authModel.updatePassword(
        data.user_id,
        data.password
      );
      return resultUpdate
        ? { message: "Update password sucess", status: true }
        : { message: "Update password fail", status: false };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error updatePassword service",
        status: false,
        error: 500,
      };
    }
  }

  async checkId(data) {
    try {
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
        error: 500,
      };
    }
  }

  async getBackId(data) {
    try {
      const resutl = await authModel.findId(data);
      if (!resutl) {
        return { message: "Error model find ID", status: false, error: 500 };
      }
      if (!resutl.status) {
        return {
          message: "ID have not found",
          status: false,
          error: 404,
        };
      } else {
        // reset password
        // 1 la yeu cau cap lai mat khau
        const result_update = await authModel.updateResetPass(
          resutl.data.id,
          1
        );
        if (!result_update) {
          return {
            message: "Server error updateResetPass",
            status: false,
            error: 500,
          };
        }
        delete resutl.data.id;
        return { ...resutl.data, status: true };
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
      // console.log(data)
      // console.log(password);


      const user = await authModel.findAccountCheckPass(data.id);
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

      return { message: "Verify successful", status: true };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error login service",
        status: false,
        error: 500,
      };
    }
  }

  async getNameUser(id) {
    try {
      const resutl = await authModel.getUserName(id);
      return resutl
        ? resutl
        : {
            message: "Error model getNameUser",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getNameUser",
        status: false,
        error: 500,
      };
    }
  }
}
module.exports = new authService();
