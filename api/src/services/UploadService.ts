import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL("../..", import.meta.url));
const publicDir = path.join(__dirname, `public`);

class UploadService {
  static delete = (...names: string[]) => {
    if (names?.length) {
      const bools = names.map((name) => {
        if (name?.includes(process.env.API_URL)) {
          const s = name.split("/");
          const bool = fs.existsSync(
            path.join(publicDir, `${s[s.length - 1]}`)
          );
          if (bool) {
            fs.unlinkSync(path.join(publicDir, `${s[s.length - 1]}`));
            return 1;
          }
        }
      });
      return bools;
    }
    return 0;
  };
  static deleteAll = () => {
    return new Promise((res, rej) => {
      fs.readdir(publicDir, (err, files) => {
        if (err) rej(err);
        files.map((file) =>
          fs.unlink(path.join(publicDir, file), (error) => {
            if (error) rej(error);
          })
        );
        res(files);
      });
    });
  };
}

export default UploadService;
