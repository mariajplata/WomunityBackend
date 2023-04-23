const Message = require('../models/message_model');
const User = require('../models/user_model');
const { ObjectId } = require('mongodb');

/**
 * Creates a message related to user
 * @param {*} req | { titleMessage, message, creatorId } 
 * @param {*} res | { success, data, msg }
 */
const createMessage = async (req, res) => {
    try {
        // User id
        const userId = req.params.user_id
        if (!userId || userId == ':user_id') throw new Error('Missing user_id param.');

        let checkExistingUser = await User.findById(new ObjectId(userId));
        if (!checkExistingUser) throw new Error('User does not exist');
        
        const { titleMessage, message, creatorId } = req.body;

        if (!titleMessage || !message || !creatorId) throw new Error('There is some missing information.');
        
        const messageObject = {
            titleMessage, 
            message, 
            creatorId: new ObjectId(creatorId) 
        }

        const messageToCreate = new Message(messageObject)
        await messageToCreate.save();
        
        res.status(200).json({
            success: true,
            data: messageToCreate,
            msg: 'Message created successfully'
        })

    } catch (error) {
        console.error('Error creating a message | createMessage', error)
        res.status(400).json({
            success: false,
            error: error.message,
            msg: 'Something went wrong creating a message'
        });
    }
}

/**
 * Update a message
 * @param {*} req 
 * @param {*} res 
 */
const updateMessage = async (req, res) => {
    try {
        const { message_id, user_id } = req.params;
        const updateBody = req.body;
        
        if (!user_id || user_id == ':user_id' || !message_id || message_id == ':message_id')
            throw new Error('Some params are missing.');
        
        if (!updateBody) throw new Error('Missing body to update.')

        let message = await Message.findById(new ObjectId(message_id)).populate('creatorId');
        if (!message) {
            throw new Error('Message does not exist.');
        } else if (message.creatorId._id != user_id) {
            throw new Error('User is not the message owner.')
        }
        
        let newMessage = 
            await Message.findOneAndUpdate({ _id: message._id }, { $set: updateBody }, { new: true })
            .populate({ path: 'creatorId', select: 'email fullUserName _id' });        

        res.json({
            success: true,
            data: newMessage,
            msg: 'Message updated successfully'
        })

    } catch (error) {
        console.error('Error updating a message | updateMessage', error)
        res.status(400).json({
            success: false,
            error: error.message,
            msg: 'Something went wrong updating the message'
        });
    }
}

/**
 * Get all messages, ready to be use including pagination, 
 * Filter by user, message title or all messages
 * @param {*} req 
 * @param {*} res 
 */
const getAllMessages = async (req, res) => {
    try {
        // Pagination variables
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit; // From index to start to limit.
        const userId = req.params.user_id // In case need messages for a user
        const { by_title, by_date } = req.query; 

        let query = {};
        
        // Check if the consultation it's messages for an specific user or by_user_name
        if (by_title && !userId) {
            query = {
                'titleMessage': { $regex: `${by_title}`, $options: 'i' }
            }
        } else if (userId) {
            query = {
                'creator._id': new ObjectId(userId)
            }
        }

        if (by_date) {
            console.log(by_date);
            query = {
                ...query,
                createdAt: { $gte: new Date(by_date), $lte: new Date(by_date) }
            }
        }

        let result = await Message.getAll({ query, limit, skip });
        let objectToReturn = {
            success: true, 
            data: [],
            totalPages: 0,
            currentPage: page,
            totalDocuments: 0
        }   

        if (result[0]) {
            objectToReturn = {
                ...objectToReturn,
                data: result[0].data,
                totalPages: Math.ceil(result[0].totalData.count / limit),
                totalDocuments: result[0].totalData.count
            }
        }

        res.status(200).json(objectToReturn)

    } catch (error) {
        console.error('Error getting all messages | getAllMessages', error);
        res.status(400).json({
            success: false,
            error,
            msg: 'Something went wrong creating a message'
        })
    }
}


module.exports = {
    createMessage,
    updateMessage,
    getAllMessages,
}