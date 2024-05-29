const userPageModel = require("../models/userPageModel");
const fs = require("fs");
class midService {
  async getMaintenanceType_checked(maintenace_id) {
    try {
      const getMaintenance = await userPageModel.getMaintenanceType();

      if (!getMaintenance) {
        return {
          message: "Error model getRequestRegister",
          status: false,
          error: 500,
        };
      }

      const maintenance_type = getMaintenance.map((item_mainClass) => {
        let checked = false;

        if (item_mainClass.id == maintenace_id) {
          checked = true;
        }

        return {
          ...item_mainClass,
          checked,
        };
      });
      return maintenance_type;
    } catch (error) {
      console.log(error);
      return {
        message: "Server error GetMaintanence Sevice",
        status: false,
        error: 500,
      };
    }
  }
  deleteFiles(files, directory) {
    try {
      return new Promise((resolve, reject) => {
        files.forEach((file) => {
          fs.unlink(`./src/public/${directory}/` + file.filename, (err) => {
            if (err) reject(err);
          });
        });
        resolve(true);
      });
    } catch (error) {
      console.log(error);
      return {
        message: "Error delete file",
        status: false,
        error: 500,
      };
    }
  }
  deleteFile(file, directory) {
    try {
      return new Promise((resolve, reject) => {
        fs.unlink(`./src/public/${directory}/` + file, (err) => {
          if (err) reject(err);
        });

        resolve(true);
      });
    } catch (error) {
      console.log(error);
      return {
        message: "Error delete file",
        status: false,
        error: 500,
      };
    }
  }
  moveFiles(files) {
    try {
      return new Promise((resolve, reject) => {
        files.forEach((file) => {
          fs.rename(
            "./src/public/temps/" + file.filename,
            "./src/public/files/" + file.filename,
            (err) => {
              if (err) reject(err);
            }
          );
        });
        resolve(true);
      });
    } catch (error) {
      console.log(error);
      return {
        message: "Error delete file",
        status: false,
        error: 500,
      };
    }
  }
  removeAllfile(directory) {
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink("./src/public/temps/" + file, (err) => {
          if (err) throw err;
        });
      }
    });
  }
}
module.exports = new midService();
