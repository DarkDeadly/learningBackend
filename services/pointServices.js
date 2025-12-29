import classRepository from "../repositories/classRepository.js";
import pointRepository from "../repositories/pointRepository.js"
import userRepository from "../repositories/userRepository.js"
const pointService = {
   givePoints: async (teacherId, pupilId, classroomId, amount, reason) => {
        // Verify classroom exists
        const classroom = await classRepository.findById(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }

        // Verify teacher owns this classroom
        if (classroom.teacherId.toString() !== teacherId.toString()) {
            throw new Error("Not your classroom");
        }

        // Verify pupil is in this classroom
        const isInClassroom = await userRepository.isInClassroom(pupilId, classroomId);
        if (!isInClassroom) {
            throw new Error("Pupil not in this classroom");
        }

        // Create transaction
        const transaction = await pointRepository.create({
            pupilId,
            classroomId,
            amount: amount,
            type: "bonus",
            reason,
            givenBy: teacherId
        });

        // Update pupil balance
        await userRepository.updatePoints(pupilId, amount);

        return { success: true, transaction };
    },
    removePoints : async (teacherId, pupilId, classroomId, amount, reason) => {
        // Verify classroom exists
        const classroom = await classRepository.findById(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }

        // Verify teacher owns this classroom
        if (classroom.teacherId.toString() !== teacherId.toString()) {
            throw new Error("Not your classroom");
        }

        // Verify pupil is in this classroom
        const isInClassroom = await userRepository.isInClassroom(pupilId, classroomId);
        if (!isInClassroom) {
            throw new Error("Pupil not in this classroom");
        }
        // Create transaction
        const transaction = await pointRepository.create({
            pupilId,
            classroomId,
            amount: -amount,
            type: "penalty",
            reason,
            givenBy: teacherId
        });

        // Update pupil balance
        await userRepository.updatePoints(pupilId, -amount);

        return { success: true, transaction };
    },
    getHistory : async(pupilId) => {
       return await pointRepository.findByPupilId(pupilId) 
    }
    }
export default pointService