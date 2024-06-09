// Define the interface for the input fields
interface InputField {
    id: number;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
  }
  
  // Define the user input fields
  export const userInputs: InputField[] = [
    {
      id: 1,
      label: "Username",
      type: "text",
      placeholder: "john_doe",
    },
    {
      id: 2,
      label: "Name and surname",
      type: "text",
      placeholder: "John Doe",
    },
    {
      id: 3,
      label: "Email",
      type: "mail",
      placeholder: "john_doe@gmail.com",
    },
    {
      id: 4,
      label: "Phone",
      type: "text",
      placeholder: "+234 567 89",
    },
    {
      id: 5,
      label: "Password",
      type: "password",
    },
    {
      id: 6,
      label: "Address",
      type: "text",
      placeholder: "Eltonp",
    },
    {
      id: 7,
      label: "Role",
      type: "select",
      options: ["admin", "moderator", "user"],
    },
 
  ];
  
