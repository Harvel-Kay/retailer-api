const Joi = require("joi");
const admin = require("../middleware/admin");
const { Sale } = require("../models/sale");
const validDate = require("../utils/date");
const { default: mongoose } = require("mongoose");

const sumRoute = require("../utils/gen/miniApp")()

sumRoute.post('/',admin ,async (req, res) => {
  const { error } = validateSum(req.body)
   if (error) return res.status(400).send(error.details[0].message);
 
  const { fromdate, todate } = req.body 

  const invalid = validDate({ fromdate,todate })
  if (invalid) return res.status(400).send(invalid)
  
    const sales = await Sale.find({ dateSold: { $gte: fromdate, $lte: todate } })
  
    
  res.send(sales)
})
function validateSum(obj) {
  return Joi.object({
    fromdate: Joi.date(), todate: Joi.date().required() ,
    todate: Joi.date(), todate: Joi.date().required()   
  }).validate(obj)
  
}

module.exports= sumRoute