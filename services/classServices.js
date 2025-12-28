import classroomRepository from "../repositories/classRepository.js";
import userRepository from "../repositories/userRepository.js";
import passwordHelper from "../utils/password-helper.js";

const classroomService = {

    create: async (teacherId, name, description, pin) => {
        // Hash the PIN
        const hashedPin = await passwordHelper.hash(pin);        
        // Create classroom
        const classroom = await classroomRepository.create({
            teacherId,
            name,
            description,
            pin: hashedPin
        });
        
        return classroom;
    },

    getTeacherClassrooms: async (teacherId) => {
        return await classroomRepository.findByTeacherId(teacherId);
    },

    joinClassroom: async (pupilId, classroomId) => {
        // Check classroom exists
        const classroom = await classroomRepository.findById(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }

        // Check pupil not already in ANY classroom
        const alreadyInClassroom = await userRepository.hasClassroom(pupilId);
        if (alreadyInClassroom) {
            throw new Error("Already enrolled in a classroom");
        }

        // Update pupil's classroomId
        await userRepository.updateClassroom(pupilId, classroomId);
        
        return { success: true, classroom };
    },

    verifyPin: async (classroomId, pin) => {
        // Find classroom
        const classroom = await classroomRepository.findById(classroomId);
        if (!classroom) {
            throw new Error("Invalid classroom or PIN");
        }

        // Compare hashed PIN
        const isValid = await passwordHelper.compare(pin, classroom.pin);
        if (!isValid) {
            throw new Error("Invalid classroom or PIN");
        }

        return { success: true };
    },

    getClassroomDetails: async (classroomId) => {
        const classroom = await classroomRepository.findByIdWithTeacher(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }
        return classroom;
    },

    // Get pupils in a classroom
    getClassroomPupils: async (classroomId) => {
        const classroom = await classroomRepository.findById(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }
        
        return await userRepository.findPupilsByClassroom(classroomId);
    },

    // Remove pupil from classroom
   removePupil: async (teacherId, pupilId, classroomId) => {
    // Verify classroom belongs to teacher
    const classroom = await classroomRepository.findById(classroomId);
    if (!classroom) {
        throw new Error("Classroom not found");
    }
    
    if (classroom.teacherId.toString() !== teacherId.toString()) {
        throw new Error("Not your classroom");
    }
    
    // Verify pupil is in this classroom
    const isInClassroom = await userRepository.isInClassroom(pupilId, classroomId);
    if (!isInClassroom) {
        throw new Error("Pupil not in this classroom");
    }
    
    // Remove pupil
    await userRepository.removeFromClassroom(pupilId);
    return { success: true };
}
};

export default classroomService;