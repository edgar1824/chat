import { FC } from "react";
import "./footer.css";

export const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="flex items-center justify-between flex-wrap">
        <div className="fText">Made by Edgar</div>
        <small className="text-base text-gray-500">
          github:{" "}
          <a
            className="underline"
            target="blank"
            href="https://github.com/edgar1824"
          >
            https://github.com/edgar1824
          </a>
        </small>
      </div>
    </footer>
  );
};
