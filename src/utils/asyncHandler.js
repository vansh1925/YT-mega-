/*

Why is asyncHandler needed?
In Express.js, if an asynchronous function throws an error, you need to explicitly pass that error to the next function for the Express error-handling middleware to catch it. Without this, your server might crash or not handle the error properly.

Different Variations

Version 1: The normal function
const asyncHandler = () => {};
This is a simple function

Version 2: The higher-order function
const asyncHandler = (func) => {
  return () => {};
};
Takes a function (func) as an argument.
Returns a new function.

Version 3: The higher-order async function
const asyncHandler = (func) => {
  return async () => {};
};
Same as above, but the returned function is asynchronous (async).
Used when the inner function (func) involves asynchronous operations.
*/
//----------------------------------------1st way----------------------------------------------------------------------
/* steps ki kaise pohoche vahan tk
const asyncHandler=()=>{}   we know this
const asyncHandler=(func)=>{return ()=>{}} we accepted a function and return a fx 
const asyncHandler=(func)=>()=>{} if {} use kiya to return aayega if ()/no braces use kiya to nhi aayega
*//*

// const asyncHandler = (func) => async (req, res, next) => {
//     try {
//         await func(req,res,next)

//     }
//     catch (error) {
//         res.status(error.code || 404).json({
//             success: false,
//             message: error.message

//         })
//     }

// } 
// //upar vala main bas aync fx return kiya 
*/

//-------------------------------------2nd way------------------------------------------------

export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
  }
}