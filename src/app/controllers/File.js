import File from '../models/file';

class FileController {
  async store(req, res) {
    if (!req.file)
      return res.status(400).json({ error: 'File not found in header' });
    const { originalname: name, filename: path } = req.file;

    const { url } = await File.create({
      name,
      path,
    });

    return res.json(url);
  }
}

export default new FileController();
