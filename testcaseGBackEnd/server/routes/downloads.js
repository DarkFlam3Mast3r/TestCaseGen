const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const router = express.Router();

// 检查文件是否存在的函数
// const checkFileExists = (filePath, callback) => {
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     callback(!err);
//   });
// };

// 检查文件是否存在的函数（返回 Promise）
const checkFileExists = (filePath) => {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

// 等待文件生成的函数
const waitForFile = (filePath, interval = 100, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      checkFileExists(filePath).then((exists) => {
        if (exists) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error("File generation timeout"));
        } else {
          setTimeout(check, interval);
        }
      });
    };

    check();
  });
};

router.get("", (req, res) => {
  const filePath = path.join(__dirname, "..", "files", "sample.txt");
  res.download(filePath, "example.txt", (err) => {
    if (err) {
      console.log("Error downloading file:", err);
    }
  });
});

router.get("/generate-file", (req, res, next) => {
  const scriptPath = path.join(
    __dirname,
    "..",
    "pythonScripts",
    "generate_file.py"
  );
  const filePath = path.join(__dirname, "..", "pythonScripts", "output.txt");
  exec(`python ${scriptPath}`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      console.error(`stderr: ${stderr}`);
      return res.status(500).send("Server error");
    }

    console.log(`stdout: ${stdout}`);

    // 等待文件生成
    try {
      await waitForFile(filePath);
      res.status(200).download(filePath, "output.txt", (err) => {
        if (err) {
          console.error(`File download error: ${err}`);
          res.status(500).send("Error downloading file");
        } else {
          console.log(`File sent: ${filePath}`);
        }
      });
    } catch (err) {
      console.error(`Error: ${err.message}`);
      res.status(500).send("Error generating file");
    }
  });
});

router.get("/:filename", (req, res, next) => {
  console.log(req.params.filename);
  const filePath = path.join(__dirname, "..", "files", req.params.filename);
  res.status(200).download(filePath, "hhh.txt", (err) => {
    if (err) {
      console.log("Error downloading file:", err);
    }
  });
});

module.exports = router;
