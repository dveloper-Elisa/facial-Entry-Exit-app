
import Security from "../model/securityModel.js"


const getAllSecurrity = async (req, res)=>{
    try{
        const getSecurity = await Security.find({role:"sec"});
        if(!getSecurity){
            return res.send({message:"Error in displaying security"})
        }
        return res.status(200).json({message:"success", getSecurity:getSecurity })

    }catch(error){
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

export default getAllSecurrity