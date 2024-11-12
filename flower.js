var express = require('express');
var router = express.Router();
let Book = require('../model/Flower')

/*CRUD*/
/*Read operation --> Get route for the book list */
router.get('/', async(req, res, next) => {
    try{
        const FlowerList= await Flower.find()
        res.render('Flower/list', {
            title:'Flowers',
            FlowerList:FlowerList
        })
    }
    catch(err){
        console.error(err)
        res.render('Flower/list', {
            error:'Error on Server'})
    }
})
/*Create operation --> Get route for Add page */
router.get('/add', async(req,res,next)=>{
    try{
        res.render('Flower/add',{
            title:"Add Flower"
        });
    }
    catch(err){
        console.error(err)
        res.render('Flower/list', {
        error:'Error on Server'})
    }
});
/*Create operation --> Post route for processing the Add page */
router.post('/add', async(req,res,next)=>{
    try{
        let newFlower = Flower({
            "name":req.body.name,
            "color":req.body.color,
            "price":req.body.price,
            "quantity":req.body.quantity,
        });
        Flower.create(newFlower).then(()=>{
            res.redirect('/flowerslist')
        })
    }
    catch(err){
        console.error(err);
        res.render('Flower/list', {
            error:'Error on server'
        })
    }
});
/*Update operation --> Get route for Edit page */
router.get('/edit/:id', async(req,res,next)=>{
    try{
        const id=req.params.id;
        const FlowerToEdit=await Flower.findById(id);
        res.render('Flower/edit', 
            {
                title:'Edit Flower',
                Flower:FlowerToEdit
            })
    }
    catch(err){
        console.error(err);
        next(err);
    }
});
/*Update operation --> Post route for processing Edit page */
router.post('/edit/:id', async(req,res,next)=>{
    try{
        let id = req.params.id;
        let updatedFlower = Flower({
            "_id":id,
            "name":req.body.name,
            "color":req.body.color,
            "price":req.body.price,
            "quantity":req.body.quantity,
        })
        Flower.findByIdAndUpdate(id,updatedFlower).then(()=>{
            res.redirect('/flowerslist')
        })
    }
    catch(err){
        console.error(err);
        res.render('Flower/list', {
            error:'Error on server'
        })
    }
});
/*Delete operation --> Get route for Deletion */
router.get('/edit/:id',(req,res,next)=>{
    try{
        let id=req.params.id;
        Flower.deleteOne({_id:id}).then(()=>{
            res.redirect('/flowerslist')
        })
    }
    catch(err){
    console.error(err);
    res.render('Flower/list', {
        error:'Error on server'
    })
    }
});
module.exports = router;