# SECURITY PRINCIPLE: Information Leakage
───────────────────────────────────────

## ❌ WRONG (reveals information):

   "User not found"     → Attacker learns: email doesn't exist
   "Wrong password"     → Attacker learns: email EXISTS, password wrong!

   Attacker can now:
   
   1. Build list of valid emails
   2. Focus brute-force on those emails


## ✅ CORRECT (reveals nothing):

   "Invalid credentials" → Attacker learns: ...nothing useful

   Was it email? Password? Both? 
   Attacker cannot tell.


This is called: USER ENUMERATION ATTACK prevention