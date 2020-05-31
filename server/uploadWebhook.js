exports = function(payload, response) {
    const body = JSON.parse(payload.body.text());
    
    async function getUser(){
      context.services.get("mongodb-atlas").db("quik_position").collection("uLogin").findOne({"identity":body.user.identity})
        .then(doc=>{ 
           if (!!doc){
              if (doc.uidHash!=body.user.uidHash){
               return 0;
              }
              return doc._id;
           }
           else{
               context.services.get("mongodb-atlas").db("quik_position").collection("uLogin").insertOne({identity:body.user.identity,uidHash:body.user.uidHash})
                .then(res=>{
                  console.log("res",JSON.stringify(res));
                  return res.insertedId;
                });
            }
          });
    }
    
    async function getUserCall(){
      return await getUser();
    }
    var uid = getUserCall(); 
    
    if (!uid){
      return  "authorization error";
    }
    
    //clear user position on date
    return context.services.get("mongodb-atlas").db("quik_position").collection("Positions").deleteMany({"uid":uid,"dt":body.portfolio.date,"folder":body.portfolio.folder})
          .then( () =>{
            //define assets
             body.positions.forEach((e)=>{
                
                context.services.get("mongodb-atlas").db("quik_position").collection("Assets").findOne({"_id":e.Ticker})
                  .then(asset=>{
                    if (!asset){
                        context.services.get("mongodb-atlas").db("quik_position").collection("Assets").insertOne({
                          _id:e.Ticker
                          ,Name:e.Name
                          ,Cur:e.Ticker.slice(-4)=="_SPB"?"USD":"RUB"
                          ,Country:e.Ticker.slice(-4)=="_SPB"?"USA":"RUB"
                          ,SecType:"Equity"
                        });
                    }
                  });
              //add positions
              context.services.get("mongodb-atlas").db("quik_position").collection("Positions").insertOne({
                "uid":uid
                ,"dt":body.portfolio.date
                ,"folder":body.portfolio.folder
                ,Ticker:e.Ticker
                ,beginQty:e.beginQty
                ,endQty:e.endQty 
                ,beginValue:e.beginValue
                ,endValue:e.endValue
                
              });   
            });
            return "uploaded";
         });
         
     
       
};