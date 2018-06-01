
var MediaHouseNoteSchema = new mongoose.Schema({
    publicationName: String,
    publicationState: String,
    releaseOrderNO: String,
    amount: Number,
    remark: String,
    date: {
        day:String,
        month:String,
        year:String
    },
    // Since releaseOrderNO is unique; it can be used for identification
    DocId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"ReleaseOrder"
    },
    firm: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Firm"
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model('MediaHouseNote', MediaHouseNoteSchema);