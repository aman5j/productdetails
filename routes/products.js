var express = require('express');
var router = express.Router();
var pool = require("./pool");
var upload = require('./multer');
var fs=require("fs")
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get("/product_interface",function(req,res,next){
    try{
        var admin=JSON.parse(localStorage.getItem('ADMIN'))
        console.log("ADMIN",admin)
        if(admin==null)
        {   res.render("loginpage",{message:''})}
        else 
        {res.render("productinterface", { message : ''});}
        
    }
    catch(e)
    {
        res.render("loginpage",{message:''})
    }
});

router.get("/document_details", function(req,res){
   try{
    var admin = localStorage.getItem('ADMIN')
    if(admin==null)
    {res.render("loginpage",{message:''})}
    else 
    {res.render("documentpage")}
   }
   catch(e)
   {
    res.render("loginpage",{message:''})
   }
    
})

router.post("/product_submit",upload.single('picture'), function(req,res,next){
    try{
        console.log("DATA:",req.body)
        console.log("FILE:",req.file)
        pool.query("insert into products (producttypeid, productcategoryid, description, price, offer, quantity, quantitytype, productpicture, productname) values(?,?,?,?,?,?,?,?,?)",[req.body.producttypeid, req.body.productcategoryid, req.body.description, req.body.price, req.body.offer, req.body.quantity, req.body.quantitytype, req.file.filename, req.body.productname],function(error,result){
            if(error)
            {   console.log("D Error:",error);
                res.render("productinterface", { message: 'Database Error' });
            }
            else
            {
                res.render("productinterface", { message: 'Product Submitted Successfully...' });

            }
        })
    }
    catch(e)
    {   console.log("Error:",e);
        res.render("productinterface", { message: 'Server Error' });
    }
   
});

router.get("/fetch_product_type", function(req,res){
    try
    {
        pool.query("select * from producttype",function(error,result){
            if(error)
            {   console.log("D Error:",error);
                res.status(200).json([])
            }
            else
            {
                res.status(200).json({result:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e);
        res.render("productinterface", { message: 'Server Error' });
    }
})

router.get("/fetch_product_category",function(req,res,next){
    try
    {
        pool.query("select * from productcategory where producttypeid=?",[req.query.typeid],function(error,result){
            if(error)
            {
                console.log("D Error:",error)
                res.status(200).json([])
            }
            else 
            {
                res.status(200).json({result:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e)
        res.render("productinterface",{ message : 'Server Error'})
    }
})

router.get("/fetch_all_products", function(req,res,next){
    try{
        var admin=JSON.parse(localStorage.getItem('ADMIN'))
        console.log("ADMIN",admin)
        if(admin==null)
        {   res.render("loginpage",{message:''})}
        
        pool.query("select P.* ,(select PT.producttypename from producttype PT where PT.producttypeid=P.producttypeid) as producttypename, (select PC.productcategoryname from productcategory PC where PC.productcategoryid=P.productcategoryid) as productcategoryname from products P",function(error,result){
            if(error)
            {
                console.log("D Error",error)
                res.render("displayallproducts",{data:[],message:'Database error'})
            }
            else 
            {
                res.render("displayallproducts",{data:result,message:'Success'})
                
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.render("loginpage",{message:""})
    }
})

router.get("/displayforedit", function(req,res,next){
    try{
        pool.query("select P.* ,(select PT.producttypename from producttype PT where PT.producttypeid=P.producttypeid) as producttypename, (select PC.productcategoryname from productcategory PC where PC.productcategoryid=P.productcategoryid) as productcategoryname from products P where P.productid=?",[req.query.productid],function(error,result){
            if(error)
            {
                console.log("D Error",error)
                res.render("displayforedit",{data:[],message:'Database error'})
            }
            else 
            {
                res.render("displayforedit",{data:result[0],message:'Success'})
                
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.render("displayforedit",{data:[],message:"Server Error"})
    }
});

router.post('/edit_product', function(req,res){
    try{
        console.log("DATA:",req.body)
        if(req.body.btn=="Edit")
        {
        pool.query(
            "update products set producttypeid=?, productcategoryid=?, description=?, price=?, offer=?, quantity=?, quantitytype=?, productname=? where productid=?",
           [
            req.body.producttypeid,
            req.body.productcategoryid,
            req.body.description,
            req.body.price,
            req.body.offer,
            req.body.quantity,
            req.body.quantitytype,
            req.body.productname,
            req.body.productid
           ],
           function(error,result)
           {
            if(error)
            {
                console.log("D Error:",error)
                res.redirect("/product/fetch_all_products")
            }
            else 
            {
                res.redirect("/product/fetch_all_products")
            }
           }
        );
        }
        else
        {
            pool.query(
                "delete from products where productid=?",
               [
                req.body.productid
               ],
               function(error,result)
               {
                if(error)
                {
                    console.log("D Error:",error)
                    res.redirect("/product/fetch_all_products")
                }
                else 
                {
                    res.redirect("/product/fetch_all_products")
                }
               }
            );  
        }
    }
    catch(e)
    {
        console.log("Error:",e)
        res.redirect("/product/fetch_all_products")
    }
})

router.get("/displaypictureforedit", function(req,res){
    res.render("displaypictureforedit",{data:req.query})
})

router.post("/edit_picture",upload.single("productpicture"), function(req,res,next){
    try{

        pool.query(
            "update products set productpicture=? where productid=?",
            [
                req.file.filename,
                req.body.productid
            ],
            function(error,result){
            if(error)
            {   console.log("D Error:",error);
                res.redirect("/product/fetch_all_products")
            }
            else
            {
                fs.unlinkSync(`D:/Mern/productdetails/public/images/${req.body.oldfilename}`)
                res.redirect("/product/fetch_all_products")
            }
        })
    }
    catch(e)
    {   console.log("Error:",e);
    res.redirect("/product/fetch_all_products")
    }
   
});



module.exports = router;


// pool.query("query",[parameters],function(error,result){
    // })

// select count(*) from products where productid in (select productid from producttype where productname='electronics')