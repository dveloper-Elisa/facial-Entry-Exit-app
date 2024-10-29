import Security from "../model/securityModel.js";


const deletesec = async(req,res)=>{
try{
    const {id} = req.params

    const remove = await Security.findByIdAndDelete({_id: id})

    if(!remove){
        return res.status({message:"Error deleting"})
    }
    return res.status(200).json({message:"Deleted successs full"})
}catch(error){
    console.log(error)
}
}


export default deletesec