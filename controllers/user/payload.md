### User
Para criar um usuário  utilize o payload abaixo, como exemplo:

```json
  {
    "companyId": "companyId",
    "name": "Alexandre Soares",
    "email": "ale_santos.soares@hotmail.com",
    "password": "123456",
    "userType": "admin"
  }
```
**Se não passar o companyId no body o backend irá utilizar o companyId que estiver na authorization do usuário**