//yeh api error , response lagega thora complex but aage almost har bari company main yeh use hota hai aasani ke liye ki if api main koi error aaye to vo is hi tareeke se handle ho.
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export { ApiError }
//exp
/*
har error same format mai hoga ex 
{
  "success": false,
  "message": "Validation failed",
  "errors": [ ... ],
  "statusCode": 400
}
  📦 Problem:
Jab backend mein kuch galat hota hai (jaise user nahi mila, ya input galat hai), to humein ek standardized error response bhejna hota hai frontend ko.
Agar har jagah throw new Error('...') likhenge to response kabhi 400, kabhi 500, kabhi message vague hoga. Yeh messy ho jaata hai.

✅ Solution: ApiError class
Is class ka kaam hai ek proper, consistent format mein error create karna — jise easily frontend handle kar sake.

💡 Why Each Line Exists:
Code	Kyun Likha Gaya Hai
class ApiError extends Error	Normal error se zyada powerful custom error banane ke liye.
constructor(...)	Jab new ApiError() karein, to use ye values mil jaayein: status, message, etc.
super(message)	Original Error class ko message dena (warna stack trace nahi milega).
this.statusCode = statusCode	HTTP error code bhejne ke liye (400, 401, 500 etc).
this.success = false	Har error response mein success: false aayega.
this.errors = errors	Agar multiple errors hain (jaise form validation), wo yahan store honge.
Error.captureStackTrace(...)	Debugging ke liye stack trace auto-generate karein.

🎯 Final Goal:
Aap backend mein kahin bhi simple likh sakte ho:

js
Copy code
throw new ApiError(404, "User not found", [{ field: "id", message: "Invalid user ID" }]);
Aur frontend ko hamesha milega:

json
Copy code
{
  "success": false,
  "message": "User not found",
  "errors": [
    { "field": "id", "message": "Invalid user ID" }
  ],
  "statusCode": 404
}
*/
