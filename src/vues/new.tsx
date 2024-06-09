
import Navbar from '../components/navbar/navbar';
import Sidebar from '../components/sidbar/sidbar';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, { useState } from "react";
import "./css/new.scss"
import { Box, Button } from '@mui/material';
interface Input {
  options?: string[];
  id: number;
  label: string;
  type: string;
  placeholder?: string;
}

interface NewProps {
  inputs: Input[];
  title: string;
}

const New: React.FC<NewProps> = ({ inputs, title }) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="new">
      
      <div className="newContainer">
        
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.type === "select" && input.options ? (
            <select>
              {input.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={input.type}
              placeholder={input.placeholder}
            />
          )}
                </div>
              ))}
              
              <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
              </Box>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
