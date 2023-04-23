const mongoose = require('mongoose');
  
// Schema  
const Message = mongoose.Schema({
   titleMessage: { type: String, required: true },
   message: { type: String, required: true },
   creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   
   createdAt: { type: Date, required: false, default: Date.now },
});

Message.statics = {
   // Aggregation to get all messages
   getAll: async function ({ query: outsideQuery, limit, skip }) {
      return await this.aggregate([

         {
            $lookup: {
              from: "users",
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator',
            }
         },
         {
            $unwind: { path: "$creator" }
         },
         {
            $match: { ...outsideQuery }
         },
         {
            $facet: {
               totalData: [{ $count: 'count' }],
               data: [
                  { $sort: {createdAt: -1} },
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: {
                        titleMessage: 1,
                        message: 1,
                        createdAt: 1,
                        creator: {
                           fullUserName: 1,
                           email: 1,
                           _id: 1
                        }
                     }
                  }
               ]
            }
         },
         { $unwind: { path: '$totalData' } },
      ])
   }
}
    
module.exports = mongoose.model('Message', Message);