import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/*Advantages of Using JwtAuthGuard:
If you use JwtAuthGuard, you don't need to manually validate the token in every route. 
The guard centralizes the authentication logic, making your code cleaner and more reusable. 
*/