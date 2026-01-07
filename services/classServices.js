import classRepository from "../repositories/classRepository.js";
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

  joinClassroom: async (pupilId, classroomId, pin) => {
    // Check classroom exists
    const classroom = await classroomRepository.findById(classroomId);
    if (!classroom) {
        throw new Error("Classroom not found");
    }
    if (!classroom.isActive) {
        throw new Error("Classroom is not active");
    }
    
    // Verify PIN first!
    const isValidPin = await passwordHelper.compare(pin, classroom.pin);
    if (!isValidPin) {
        throw new Error("Invalid PIN");
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

    getClassroomDetails: async (classroomId , userId) => {
        const classroom = await classroomRepository.findByIdWithTeacher(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }
        const isTeacher = classroom.teacherId._id.toString() === userId.toString()
        const isPupil = await userRepository.isInClassroom(userId , classroomId)
         if (!isTeacher && !isPupil) {
        throw new Error("Access denied");
    }
        return classroom;
    },

    // Get pupils in a classroom
    getClassroomPupils: async (classroomId ) => {
        const classroom = await classroomRepository.findById(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }
      
        return await userRepository.findPupilsByClassroom(classroomId);
    },

    // Remove pupil from classroom
  removePupil: async (teacherId, pupilId, classroomId) => {
        // Guard 1: Classroom exists and teacher owns it
        const classroom = await classroomRepository.findById(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }
        
        if (classroom.teacherId._id.toString() !== teacherId.toString()) {
            throw new Error("Not your classroom");
        }
        
        // Guard 2: Pupil is in this classroom
        const isInClassroom = await userRepository.isInClassroom(pupilId, classroomId);
        if (!isInClassroom) {
            throw new Error("Pupil not in this classroom");
        }
        
        // Happy path
        await userRepository.removeFromClassroom(pupilId);
        return { success: true };
    },
      deactivateClassroom: async (teacherId, classroomId) => {
        const classroom = await classRepository.findById(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }
        
        if (classroom.teacherId._id.toString() !== teacherId.toString()) {
            throw new Error("Not your classroom");
        }
        
        await classRepository.update(classroomId, { isActive: false });
        return { success: true };
    },
    getallclassrooms : async () => {
        const classroom = await classRepository.findAll()
        if (!classroom) {
            throw new Error("there is no classrooms");
        }
        return {success : true , class : classroom}
    }
};

export default classroomService;