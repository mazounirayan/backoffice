import axios from "axios";

 export const   fetchSasUrl = async (userId:number,name:string, token:string) => {
    try {
      const response = await axios.post(
        `https://pa-api-0tcm.onrender.com/generate-sas-url/${userId}`,
        { blobName: name, token: token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data.sasUrl;
    } catch (error) {
      console.error('Error fetching SAS URL:', error);
      return null;
    }
  };