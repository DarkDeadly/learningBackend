``` JS
// 1. create(userData) 

userData : async(fullname , email , password) => {
   const newUser = await User.create({
    fullname,
    email,
    password,
   })
   return newUser
},

// 2. findByEmail(email)

findByEmail : async (email) => {
    return await User.findOne({email})
},

// 3. findById(id) 

findById : async (id) => {
    return await User.findById(id)
}

```

Issue 1: Naming confusion

``` JS
userData : async(fullname , email , password) => { }
```

 You named it "userData" but it should be "create"
 Repository doesn't know about individual fields!
 
 Issue 2 :  Password field - remember select: false?

``` JS

findByEmail : async (email) => {
    return await User.findOne({email})
    // What if service needs password for login?
    // How will you get it?
}

```
## Repository Rules 

  1) Receives DATA OBJECTS, not individual fields
    * ❌ create(fullname, email, password)
    * ✅ create(userData)  
    * WHY? => Repository doesn't care what's inside.
   Today it's 3 fields. Tomorrow maybe 10.
   Repository just saves whatever you give it.
  2) Must handle special cases (like password select)
     * findByEmail(email)                    → Normal lookup
     * findByEmail(email, includePassword)   → Login needs password

the corrected version is see the userRepository now


### Notes to make 
in the repository u used async await u keep that in the services


```JS
 refreshToken : async(token , userId) => {}
 //                         ↑ Why userId?
// The refresh token contains the userId in the database!
// You don't need it as a parameter.
// Also: naming conflict with the NEW refreshToken variable below!
 ```
## JWT Payload 

Jwt takes the payload to use it 
``` JS
return jwt.sign({ id: userId , role : role}, secret, { expiresIn: "15m" });
```

here the payload will have id and role when you get the access token the result will be like this 

``` JS 
{
  "id": "694f2456e0ed3fac8c825667",
  "role": "pupil",
  "iat": 1766798704,
  "exp": 1766799604
}
```

