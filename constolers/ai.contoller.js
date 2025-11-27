import  ai from '../services/ai.service.js';

export const getResult = async (req ,res )=>{

    try {
        const {prompt}= req.query;
        const result = await ai(prompt);
        res.send(result)

         
    } catch (error) {
        console.log('Error while getiing response from ai api')
        res.status(500).send({message:error.message});
        
    }
}