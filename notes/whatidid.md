┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              ARABIC CLASSROOM GAMIFICATION APP              │
│                                                             │
│                      USER STORIES                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Authentication & Users

AS AN ADMIN:
────────────
• I can promote a user to teacher role
• I can manage all users in the system


AS A TEACHER:
─────────────
• I can register with email and password
• I can login with email and password
• I can logout from current device
• I can logout from all devices
• I can view my profile


AS A PUPIL:
───────────
• I can register with email and password
• I can login with email and password
• I can logout from current device
• I can logout from all devices
• I can view my profile (including point balance)

Classroom Management

AS A TEACHER:
─────────────
• I can create a classroom with:
  - Name (e.g., "1st Year Arabic")
  - Description
  - PIN code (for pupils to join)

• I can view all my classrooms
• I can view all pupils in my classroom
• I can remove a pupil from my classroom
  (Pupils cannot leave by themselves - prevents accidents for ages 7-13)


AS A PUPIL:
───────────
• I can join a classroom by:
  - Entering the classroom ID
  - Entering the correct PIN code

• I can only be in ONE classroom at a time
• I can view my classroom details

Points System

AS A TEACHER:
─────────────
• I can give points to a pupil in my classroom
  - Specify amount
  - Specify reason (e.g., "Good participation")
  - Points are added to pupil's balance

• I can remove points from a pupil in my classroom
  - Specify amount
  - Specify reason (e.g., "Late homework")
  - Points are subtracted from pupil's balance
  - Balance CAN go negative (consequence for misbehavior)

• I can view a pupil's complete point transaction history


AS A PUPIL:
───────────
• I can see my current point balance (via profile)
• I CANNOT see my transaction history (client requirement)

Rewards System

AS A TEACHER:
─────────────
• I can create a reward for my classroom:
  - Name (e.g., "Skip Homework")
  - Cost in points (e.g., 50 points)
  - Expiration date

• I can view all rewards in my classroom
• I can update a reward
• I can delete a reward


AS A PUPIL:
───────────
• I can view all available rewards in my classroom
• I can purchase a reward if:
  - I have enough points (balance >= cost)
  - I have NOT already purchased this reward (one-time only)
  - The reward has not expired

• After purchase:
  - Points are deducted from my balance
  - I CANNOT purchase the same reward again

─────────────────────────────────────────────────────────────┐
│                    CLASSROOM ENDPOINTS                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   BASE: /api/classrooms                                     │
│                                                             │
│   CLASSROOM:                                                │
│   POST   /                          → Create classroom      │
│   GET    /my                        → My classrooms         │
│   GET    /:id                       → Classroom details     │
│   DELETE /:id                       → Deactivate            │
│                                                             │
│   PUPILS:                                                   │
│   GET    /:id/pupils                → List pupils           │
│   POST   /:id/join                  → Join classroom        │
│   DELETE /:id/pupils/:pupilId       → Remove pupil          │
│                                                             │
│   POINTS:                                                   │
│   POST   /:id/points/give           → Give points           │
│   POST   /:id/points/remove         → Remove points         │
│   GET    /:id/points/:pupilId       → Pupil history         │
│                                                             │
│   REWARDS:                                                  │
│   POST   /:id/rewards               → Create reward         │
│   GET    /:id/rewards               → List rewards          │
│                                                             │
│   COURSES: 🆕                                               │
│   POST   /:id/courses               → Create course         │
│   GET    /:id/courses               → List courses          │
│   GET    /:id/courses/:courseId     → Course details        │
│   PATCH  /:id/courses/:courseId     → Update course         │
│   DELETE /:id/courses/:courseId     → Delete course         │
│                                                             │
│   MATERIALS: 🆕                                             │
│   POST   /:id/courses/:courseId/materials     → Upload      │
│   DELETE /:id/courses/:courseId/materials/:materialId       │
│                                                             │
└─────────────────────────────────────────────────────────────┘