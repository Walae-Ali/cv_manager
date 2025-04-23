import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    console.log('🔒 JWT_SECRET:', secret); // Log the secret

    super({
      jwtFromRequest: (req) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        console.log('🧠 Full headers:', req.headers);

        console.log('🔑 JWT Token extracted:', token); // Log the token extraction
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    console.log('✅ JwtStrategy initialized');
  }

  async validate(payload: any) {
    try {
      console.log('🚀 JwtStrategy.validate() called');
      console.log('✅ JWT Payload:', payload);

      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      console.log('Token Expiration:', payload.exp);

      if (payload.exp < now) {
        console.error('❌ Token Expired!');
        throw new Error('Token expired');
      }

      return {
        userId: payload.sub,
        username: payload.username,
        role: payload.role,
      };
    } catch (error) {
      console.error('❌ Error in JwtStrategy.validate():', error.message);
      throw error;
    }
  }
}