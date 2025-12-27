# Architecture & Patterns - Lesson 1

## The Problem we had 

in the previous code [here](https://github.com/DarkDeadly/3decommercecarBackend/blob/main/controllers/userController.ts)

we can notice that the one function is doing mostly all the jobs

 ``` TS

 const RegisterUser = async (req, res) => {
    // Validation here
    // Password hashing here
    // Database query here
    // Token generation here
    // Cookie setting here
    // Response formatting here
    // Error handling here
    // ... 100+ lines in ONE function
}

```
this is called a fat Controller which is not good for maintainability and when you want to change something u will be stuck in 115+ lines to find what you want to change that why : 

## The solution : Separation of Concerns

we separate the work into many layers and here what each layer do

#### the controller 

  * How to read req.body
  * How to send res.json()
  * How to set cookies
  * Does NOT know how to hash passwords
  * Does NOT know database queries

#### The Service Layer

  * Business rules ("password must be 8+ chars")
  * What steps to perform ("hash password, then save")
  * How to coordinate operations
  * Does NOT know about req/res
  * Does NOT know MongoDB syntax

#### The REPOSITORY Layer

  * How to query MongoDB
  * How to save/update/delete documents
  * Does NOT know business rules
  * Does NOT know about HTTP

#### The MiddleWare Layer

  * Processes requests BEFORE they reach controller.
  * Chain of responsibility.