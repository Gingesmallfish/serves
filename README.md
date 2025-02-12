# admin

## 进入项目
```bash
cd server 服务端
```

## 下载依赖
```bash
npm install
```

### 启动项目
``` bash
npm start
```


我现在我的项目怎么几个文件夹中间间Middleware，router路由，uitls工具函数，Services服务层，controller控制器，nodels存放数据库成怎么帮我写代码均匀分到这些文件夹中
project/
│
├── controller/    # 存放控制器，处理业务逻辑
│   └── xxx.js
├── models/         # 存放数据库模型相关操作
│   └── xxx.js
├── routers/        # 存放路由
│   └── xxx.js
├── utils/          # 工具函数
│   ├── xxx.js
└── index.js          # 主应用文件


端口被占用
netstat -ano|findstr "端口号"

删除被占用的端口
taskkill /f /t /im 
