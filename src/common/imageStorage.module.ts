import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'public', 'uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `cv-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedExtensions = ['.jpeg', '.jpg', '.png'];
        const ext = extname(file.originalname).toLowerCase();
        
        if (!allowedExtensions.includes(ext)) {
          return callback(new BadRequestException('Seules les images JPEG, JPG et PNG sont autorisées'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024, // 1MB
      },
    }),
  ],
  exports: [MulterModule],
})
export class ImageStorageModule {}

