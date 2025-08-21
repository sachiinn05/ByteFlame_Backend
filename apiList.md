authRouter
POST/signup
POST/login
POST/logout

profileRouter
GET/profile/view
PATCH/profile/edit
PATCH/profile/password

connectionRequestRouter
POST/request/send/interested/:userId
POST/request/send/ignore/:userId
POST/request/review/acceepted/:requestId
POST/request/review/rejected/:requestId


GET/user/connection
GET/user/requests/received
GET/user/feed -Gets you the profile of other users onn platfrom

Status:ignore,interested,accepeted,rejected
