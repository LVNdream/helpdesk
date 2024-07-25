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
  // delete all file array
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

  // delete file
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

  // move file to orther directory
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

  // remove files in  directory
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

  // get week (1->54)
  getWeek(date) {
    const currentDate = date ? date : new Date();
    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday =
      januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
    const nextMonday = new Date(
      currentDate.getFullYear(),
      0,
      januaryFirst.getDate() + daysToNextMonday
    );

    return currentDate < nextMonday
      ? 52
      : currentDate > nextMonday
      ? Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7)
      : 1;
  }
}
module.exports = new midService();
