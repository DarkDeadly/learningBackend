import PointTransaction from "../models/purchase-history.js"

const pointRepository = {
    create : async (transactionData) => {
        return await PointTransaction.create(transactionData)
    },
    findByPupilId : async (pupilId) => {
        const result = await PointTransaction
        .find({ pupilId })
        .sort({ createdAt: -1 })
        .populate("givenBy", "fullname")
        return result
        ;
    },
    findByClassroomId : async (classroomId) => {
        const result = await PointTransaction
        .find({classroomId})
        .sort({ createdAt: -1 })
        .populate("pupilId", "fullname email")
        .populate("givenBy", "fullname")

        return result
    }
}

export default pointRepository