export interface User{
    id:string
    name:string

  }
  
  export interface Message{
    message:string,
    room:string,
    userId:string,
    userName:string,
  }
  export interface Room{
    name:string
  }