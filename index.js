const express = require('express');
const { redirect } = require('express/lib/response');
const path = require('path')
const PORT = process.env.PORT || 5000
const{ Pool}= require('pg');
var pool;
pool= new Pool({
    connectionString: process.env.DATABASE_URL
})

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


  app.get('/database',(req,res)=>{
    var getRecQuery = `SELECT * FROM rectangle`
    pool.query(getRecQuery,(error,result)=>{
        if(error)
            res.send(error);
        var results={'rows': result.rows}
        res.render('pages/db',results);
    })
});

app.post('/add',(req,res)=>{
    
        const generateUniqueId = require('generate-unique-id');
        let rectangle_name = req.body.name;
        let rectangle_height = req.body.height;
        let rectangle_width = req.body.width;
        let rectangle_color = req.body.color; 
        let id = generateUniqueId({
            includeSymbols: ['@','|'],
            excludeSymbols: ['0','#'],
            length: 10
          });
          console.log(id);
        if(rectangle_name=="" || rectangle_color=="" ||rectangle_height=="" || rectangle_width=="" || rectangle_height==0 || rectangle_width==0){
                var getRecQuery = `SELECT * FROM rectangle`
                pool.query(getRecQuery,(error,result)=>{
                if(error)
                    res.send(error);
                var results={'rows': result.rows}
                res.render('pages/db',results);
                }); 
        }
        else{
            
            
            var sql =`INSERT INTO rectangle VALUES ('${rectangle_name}',${rectangle_width},${rectangle_height},'${rectangle_color}','${id}')`;
            pool.query(sql,(error,result)=>{
                if(error)
                    res.send(error);
                var getRecQuery = `SELECT * FROM rectangle`
                pool.query(getRecQuery,(error,result)=>{
                if(error)
                    res.send(error);
                var results={'rows': result.rows}
                res.render('pages/db',results);
                });
            });
        }
});

app.post('/delete',(req,res)=>{

    let rectangle_id = req.body.delete_id;
    var sql =`DELETE from rectangle where uniqueid='${rectangle_id}'`;
    pool.query(sql,(error,result)=>{
        if(error)
            res.send(error);
        var getRecQuery = `SELECT * FROM rectangle`
        pool.query(getRecQuery,(error,result)=>{
            if(error)
                res.send(error);
            var results={'rows': result.rows}
            res.render('pages/db',results);
        });
    });

});

app.get('/views/pages/data/:id',(req,res)=>{
    
    let rectangle_id = req.params.id;
    console.log(rectangle_id);
    var sql =`SELECT * from rectangle where uniqueid='${rectangle_id}'`;
    pool.query(sql,(error,result)=>{
            if(error)
                res.send(error);
        var results = {'rows':result.rows}
        res.render('pages/data',results);
    })
});


app.post('/:id',(req,res)=>{
    
   let id = req.params.id;
   let new_name=req.body.Update_name;
   let new_color=req.body.Update_color;
   let new_width=req.body.Update_width;
   let new_height=req.body.Update_height;

   if(new_name != "")
   {
        let sql =`Update rectangle set name='${new_name}' where uniqueid='${id}'`;
        pool.query(sql,(error,result)=>{
            if(error)
                res.send(error);
        })      
    }
    if(new_color != "")
    {
        let sql =`Update rectangle set color='${new_color}' where uniqueid='${id}'`;
        pool.query(sql,(error,result)=>{
            if(error)
                res.send(error);
        })      
    }
    if(new_width != "" || new_width !=0)
    {
        let sql =`Update rectangle set width=${new_width} where uniqueid='${id}'`;
        pool.query(sql,(error,result)=>{
            if(error)
                res.send(error);
        })      
    }
    if(new_height != "" || new_height !=0)
    {
        let sql =`Update rectangle set height=${new_height} where uniqueid='${id}'`;
        pool.query(sql,(error,result)=>{
            if(error)
                res.send(error);
        })      
    }
    var sql =`SELECT * from rectangle where uniqueid='${id}'`;
    pool.query(sql,(error,result)=>{
            if(error)
                res.send(error);
        var results = {'rows':result.rows}
        res.render('pages/data',results);
    })
})


