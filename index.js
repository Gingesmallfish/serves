const express = require('express')
const session = require('express-session')
const cors = require('cors')
const captchaRoutes = require('./routes/captcha.routes')
const authRoutes = require('./routes/auth.routes')
const app = express()

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080',  // 前端项目地址
    credentials: true
}));
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 挂载路由
app.use('/api', captchaRoutes);
app.use('/api/users', authRoutes);


const port = 3000

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
