var express = require('express');
var router = express.Router();
var pool = require('./pool');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get("/adminlogin", function(req,res){
    res.render("loginpage",{message:''})
});

router.post("/check_admin_login", function(req,res){
    try{
        console.log("Login Data:",req.body)
        pool.query("select * from admins where (emailid=? or mobileno=?) and password=?;",[req.body.emailid, req.body.emailid, req.body.password],function(error,result){
            if(error)
            {
                console.log("D Error:",error)
                res.render("loginpage",{message:'DataBase Error'})
            }
            else 
            {
                if(result.length==1)
                {   localStorage.setItem('ADMIN',JSON.stringify(result[0]))
                    res.render("dashboard",{data:result[0]})
                }
                else
                {   console.log("Data:",result)
                    res.render("loginpage",{message:'Invaid UserId/Password'})
                }
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e)
        res.render("loginpage",{message:'Server Error'})
    }
})

router.get("/count_electrical_products", function(req,res){
    try{
        pool.query("select count(*) as e from products where producttypeid in (select producttypeid from producttype where producttypename='Electronics')", function(error,result){
            if(error)
            {
                console.log("D Error:",error)
                res.status(200).json([])
            }
            else
            {
                res.status(200).json({result:result[0]})
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e)
        res.status(200).json([])
    }
})
router.get("/count_securitycamera_products", function(req,res){
    try{
        pool.query("select count(*) as sc from products where producttypeid in (select producttypeid from producttype where producttypename='Security Camera')", function(error,result){
            if(error)
            {
                console.log("D Error:",error)
                res.status(200).json([])
            }
            else
            {
                res.status(200).json({sc:result[0]})
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e)
        res.status(200).json([])
    }
})


router.get("/count_furniture_products", function(req,res){
    try{
        pool.query("select count(*) as f from products where producttypeid in (select producttypeid from producttype where producttypename='furniture')", function(error,result){
            if(error)
            {
                console.log("D Error:",error)
                res.status(200).json([])
            }
            else
            {
                res.status(200).json({f:result[0]})
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e)
        res.status(200).json([])
    }
})

router.get("/logout", function(req,res){
    localStorage.clear()
    res.render("loginpage",{message:''})
});




module.exports = router;