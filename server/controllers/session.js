var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')
User = mongoose.model('User');
module.exports = (function(){
    return{
        //These functions query the database and do all the necessary business logic based on the
        // client side request.

        index: function(req,res){
            User.find({},function(err,data){
                if(err)res.json({status:false,error:err})
                else{
                    res.json({status:true,users:data})
                }
            })
        },
        create: function(req,res){
            var password = req.body.password;
            bcrypt.genSalt(10,function(err,salt){
                if(err) res.json({status:false,error:err})
                else{
                    bcrypt.hash(password,salt,function(err,hash){
                        if(err)res.json({status:false,error:err})
                        else{
                            User.findOne({user:req.body.name}, function(err,data){
                                if(err)res.json({status:false,error:err})
                                else{
                                    if(data)res.json({status:false,message:"User already exists"})
                                    else{
                                        var user = new User({user: req.body.user, password:hash, level: parseInt(req.body.level)})
                                        user.save(function(err,data){
                                            if(err){
                                                res.json({status:false,error:err})
                                            }else{
                                                res.json({status:true,message:"Successful creation",user:data})
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
        login: function(req,res){
            var password = req.body.password;
            bcrypt.genSalt(10,function(err,salt){
                if(err){
                    res.json({status:false,error:err});
                }else{
                    bcrypt.hash(password,salt,function(err,hash){
                        if(err){
                            res.json({status:false,error:err});
                        }else{
                            User.findOne({user:req.body.name}, function(err,data){
                                if(err){
                                    res.json({status:false,error:err});
                                }else{
                                    if(!data){
                                        res.json({status:false,error:false,message:"No such user"});
                                    }else{
                                        bcrypt.compare(req.body.password,data.password,function(err,p_res){
                                            if(err){
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
            User.findOneAndUpdate({'user':req.body.user},{'level':8},function(err,data){
                if(err){
                    res.json({status:false,error:err})
                }else{
                    res.json({status:true, user:data})
                }
            })
        },
        delete: function(req,res){
            User.remove({_id:req.query._id},function(err,data){
                err ? res.json({status:false,error:err.message}) : res.json({status:true, message:"Deletion successful"})
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