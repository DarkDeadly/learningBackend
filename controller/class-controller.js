/*
CONTROLLER FUNCTIONS:
─────────────────────

1. createClassroom (Teacher only)
   ──────────────────────────────
   POST /api/classrooms
   Body: { name, description, pin }
   → Get teacherId from req.user.id
   → Call service.create()
   → Return classroom

2. getMyClassrooms (Teacher only)
   ───────────────────────────────
   GET /api/classrooms/my
   → Get teacherId from req.user.id
   → Call service.getTeacherClassrooms()
   → Return array

3. joinClassroom (Pupil only)
   ───────────────────────────
   POST /api/classrooms/:id/join
   → Get pupilId from req.user.id
   → Get classroomId from req.params.id
   → Call service.joinClassroom()
   → Return success

4. verifyPin (Pupil only)
   ────────────────────────
   POST /api/classrooms/:id/enter
   Body: { pin }
   → Get classroomId from req.params.id
   → Call service.verifyPin()
   → Return success

5. getClassroomDetails (Teacher or Pupil in class)
   ─────────────────────────────────────────────────
   GET /api/classrooms/:id
   → Call service.getClassroomDetails()
   → Return classroom

6. getClassroomPupils (Teacher only)
   ───────────────────────────────────
   GET /api/classrooms/:id/pupils
   → Call service.getClassroomPupils()
   → Return pupils array

7. leaveClassroom (Pupil only)
   ────────────────────────────
   POST /api/classrooms/leave
   → Get pupilId from req.user.id
   → Call service.leaveClassroom()
   → Return success
*/