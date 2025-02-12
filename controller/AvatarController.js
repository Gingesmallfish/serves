const { saveAvatar, getAvatar } = require('../services/avatarService');
const multer = require('multer');
const path = require('path');
// 设置 multer 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');  // 上传的文件存储在 uploads 文件夹中
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // 文件名加上时间戳，避免重复
  }
});

const upload = multer({ storage: storage });

// 上传头像接口
const uploadAvatar = (req, res) => {
  const userId = req.body.userId;  // 用户 ID 从请求中获取
  if (!req.file) {
    return res.status(400).json({ message: '没有文件上传' });
  }

  // 调用服务层保存头像
  saveAvatar(userId, req.file)
    .then((avatarUrl) => {
      res.json({ avatarUrl });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};

// 获取头像接口
const getUserAvatar = (req, res) => {
  const userId = req.query.userId || 1;  // 默认获取用户 ID 为 1
  getAvatar(userId)
    .then((avatarUrl) => {
      res.json({ avatarUrl });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};

module.exports = { upload, uploadAvatar, getUserAvatar };
