import React from 'react';
const  obtenerDatos = async () =>{
  const data=await fetch('http://localhost:8080/docente/retornarTodos')
  const users = await data.json()
  console.log(users)

}
const usersData = [obtenerDatos()]

export default usersData
