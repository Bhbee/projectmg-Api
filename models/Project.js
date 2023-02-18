const mongoose = require('mongoose')
const projectSchema = new mongoose.Schema({
    title:{
        unique: true,
        required: true,
        type:String,
        len: [10, 30]
    },
    description:{
        required: true,
        type:String,
    },
    creator:{
        required: true,
        type:String,
    },
    participants:[String],
    admins:[String],
    tasks: [{
        title:{
            unique: true,
            required: true,
            type:String,
        },
        description:{
            required: true,
            type:String,
        },
        assignedTo:{
            type: String
        },
        isComplete:{
            required:true,
            type: Boolean,
            default: false
        }
    }]
},
{timestamps: true} 
);
        
module.exports = mongoose.model('Project', projectSchema)