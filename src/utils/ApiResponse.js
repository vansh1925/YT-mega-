class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }

/*
Agar ApiError failure ke liye banayi gayi hai, to ApiResponse success ke liye banayi jaati hai — taaki har API ka output ek consistent format mein aaye, chahe wo success ho ya error. Yeh bhi ek industry best practice hai jo sirf smart developers follow karte hain.

🧠 Purpose:
Jab bhi API call success hoti hai, aapko ek proper structured JSON response bhejna hota hai. Har API alag-alag format mein response na bheje, isiliye ek common response class banate hain: ApiResponse.

#Agar statusCode 200–399 ke beech hai, to response successful maana jaayega.

2xx = Success

3xx = Redirection (still not error)

4xx/5xx = Error
*/