var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')
User = mongoose.model('User');
module.exports = (function(){
    return{
        login: function(req,res){
            var password = req.body.password;
            bcrypt.genSalt(10,function(err,salt){
                if(err){
                    console.log(err);
                    res.json({status:false,error:err});
                }else{
                    bcrypt.hash(password,salt,function(err,hash){
                        if(err){
                            console.log(err);
                            res.json({status:false,error:err});
                        }else{
                            User.findOne({user:req.body.name}, function(err,data){
                                if(err){
                                    console.log(err)
                                    res.json({status:false,error:err});
                                }else{
                                    if(!data){
                                        console.log("no data found")
                                        /////////////////////////////////////////////////
                                        /*
                                        var user = new User({user: req.body.name, password:hash, level:1})
                                        user.save(function(err,data){
                                            if(err){
                                                console.log(err)
                                                res.json({status:false,error:err})
                                            }else{
                                                console.log(data)
                                                req.session.name = data.name;
                                                req.session._id = data._id;
                                                req.session.level = data.level;
                                                req.session.save()
                                                res.json({status:true,error:false,user:data})
                                            }
                                        })
                                        */
                                        ////////////////////////////////////////////////////
                                        res.json({status:false,error:false});
                                    }else{
                                        bcrypt.compare(req.body.password,data.password,function(err,p_res){
                                            if(err){
                                                console.log(err);
                                            }else if(p_res===true){
                                                req.session.name = data.user;
                                                req.session._id = data._id;
                                                req.session.level = data.level;
                                                req.session.save();
                                                res.json({status:true,error:false,user:data});
                                            }else{
                                                res.json({status:false,error:false});
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            }) 
        },
        update: function(req,res){
            console.log("Server controller Update()",req.body)
            User.findOneAndUpdate({'user':req.body.user},{'level':8},function(err,data){
                if(err){
                    console.log(err)
                    res.json({status:false,error:err})
                }else{
                    res.json({status:true, user:data})
                }
            })
        },
        logout: function(req,res){
            req.session.destroy();
            res.redirect('/');
        },
        getSession: function(req,res){
            if(req.session.name){
                res.json({status:true, user:req.session.name, _id:req.session._id, level:req.session.level})
            }else{
                res.json({status:false})
            }
        }
    }
})();