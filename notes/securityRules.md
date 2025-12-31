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


## SECURITY CONCEPTS:
──────────────────

1. JWT + REFRESH TOKEN
   → Access token (15 min, stateless)
   → Refresh token (15 days, in database)

2. TOKEN ROTATION
   → New refresh token on each refresh
   → Old token revoked

3. THEFT DETECTION
   → Revoked token used → Revoke ALL tokens

4. HASH TOKENS BEFORE STORING
   → If database breached, tokens useless

5. HASH PASSWORDS
   → bcrypt with salt

6. HASH PINs
   → Same as passwords

7. SAME ERROR MESSAGES
   → "Invalid credentials" for both wrong email and wrong password
   → Prevents user enumeration

8. ROLE-BASED ACCESS
   → Teacher can do X
   → Pupil can do Y


   ###  401 vs 403: 

 
───────────

401 UNAUTHORIZED:
  * "Who are you? I don't know you"
  *  No token, expired token, invalid token
  *  User needs to LOGIN

403 FORBIDDEN:
  *  "I know who you are, but you can't do this"
  *  Valid token, but wrong role
  *  Pupil trying to access teacher route
  *  User needs DIFFERENT PERMISSIONS
  
9. SELECT: FALSE FOR SENSITIVE FIELDS
   → Password hidden by default in queries
   → Must explicitly select("+password")
   → Defense in depth

10. COOKIE SECURITY TRIAD
    → httpOnly: true    (prevents XSS reading cookie)
    → secure: true      (HTTPS only in production)
    → sameSite: strict  (prevents CSRF attacks)

11. TTL INDEXES
    → Auto-delete expired tokens from database
    → Self-cleaning data
    → { expiresAt: 1 }, { expireAfterSeconds: 0 }