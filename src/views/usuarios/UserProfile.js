var UserProfile = (function() {
    const enviroment ={
      TOKEN_AUTH_USERNAME: 'proyectodocente',
      TOKEN_AUTH_PASSWORD: 'pr0y3ct0',
      TOKEN_NAME: 'access_token'
    }
  
    var getRol = function() {
      return localStorage.getItem("rol"); 
    };

    var getNombre = function() {
      return localStorage.getItem("nombre");  
    };

    var getId = function() {
        return localStorage.getItem("id");
      };

      var getFoto = function() {
        return localStorage.getItem("foto");  
      };

      var getContrato = function() {
        return localStorage.getItem("contrato");  
      };

      var setToken= function(username, password) {
        enviroment.TOKEN_AUTH_USERNAME = username;  
        enviroment.TOKEN_AUTH_PASSWORD = password;
      };
      var getToken = function() {
        return enviroment;    
      };
  
    return {
      getRol: getRol,
      getId: getId,
      getNombre: getNombre,
      getFoto: getFoto,
      getContrato: getContrato,
      getToken: getToken,
      setToken: setToken
    }
  
  })();
  
  export default UserProfile;