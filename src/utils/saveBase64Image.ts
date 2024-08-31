import { join } from 'path';

export function saveBase64Image(base64Image: string, customerCode: string) {
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 image');
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');
    const fileType = `image/${matches[1].split('/')[1]}`;
    const fileName = `${Date.now()}.${fileType}`;
    const filePath = join(__dirname, '..', 'uploads', fileName);
    const imageSplit = base64Image.split(',')[1];

    // TODO implementar a lógica para armazenar a imagem temporariamente
    // e retornar um link para acessá-la. Por exemplo, armazenando no S3.

    const imageUrl = `http://localhost:8080/uploads/${fileName}`;

    return { imageUrl, fileType, imageSplit };
}
