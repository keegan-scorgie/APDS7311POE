import express from "express";
const app = express();

app.get('/',(req,res)=>{
    res.send('HTTPS IN Express')
})

app.get('/fruit',(req,res)=>{
    res.send('Tomato isnt a fruit ')
})

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self' https://localhost:3000; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://localhost:3000");
    next();
});


export default app;