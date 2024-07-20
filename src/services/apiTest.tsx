import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/api';

interface ApiDataType {
  // Define the expected structure of your data here
}




const Apitest: React.FC = () => {
  const [data, setData] = useState<ApiDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUsers();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        
        setError( (error as Error).message|| 'An error occurred'); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  function jsonuser(data: any): string {
    return JSON.stringify(data, null, 2);
  }
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const rayan:any =jsonuser(data);
  return (
    <div>
      <h1>{rayan && rayan.Users && rayan.Users.map((user: { id: React.Key | null | undefined; nom: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; prenom: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; email: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
  <div key={user.id}>
    <p>Nom : {user.nom}</p>
    <p>Prénom : {user.prenom}</p>
    <p>Email : {user.email}</p>
    {/* Ajoutez d'autres propriétés à afficher si nécessaire */}
  </div>
))}</h1>
      <pre></pre>
    </div>
  );
};

export default Apitest;
