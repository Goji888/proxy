const express=require("express");
const axios=require("axios");
const app=express();
const PORT=process.env.PORT||3000;
const API_KEY=process.env.KEY;
app.get("/fetch-data",async(req,res)=>{
try{
const ipRes=await axios.get("https://api.ipify.org?format=json");
console.log("Outgoing server IP for this request:",ipRes.data.ip);
}catch(err){
console.error("Failed to fetch outgoing IP:",err.message);
}
const{universeId,datastore,key,scope="global"}=req.query;
if(!universeId||!datastore||!key){
return res.status(400).json({error:"Missing required parameters."});
}
try{
const url=`https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`;
const result=await axios.get(url,{
headers:{"x-api-key":API_KEY},
params:{datastoreName:datastore,entryKey:key,scope},
});
res.json(result.data);
}catch(err){
res.status(err.response?.status||500).json({
error:err.response?.data||"Unknown error occurred",
});
}
});
app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`);
});
