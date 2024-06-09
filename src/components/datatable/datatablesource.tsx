
import { GridColDef } from '@mui/x-data-grid';

export const userColumns: GridColDef[] = [
  { 
    field: 'img', 
    headerName: 'Image', 
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
        </div>
      );
    }
  },
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  { field: 'age', headerName: 'Age', type: 'number', width: 90 },
  { 
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  { field: 'mail', headerName: 'MAIL', width: 50 },
  { field: 'status', headerName: 'Role', width: 50 , renderCell: (params) => {
    return (
      <div className={`cellWithStatus ${params.row.status}`}>
        {params.row.status}
      </div>
    );
  }},
];
export interface UserRow {
  id: number;
  lastName: string;
  img?: string; // Assuming image URL or path is always a string
  mail?: string;
  firstName?: string;
  status: string;
  age?: number | null; // Age can be a number or null
}
export const userRows: UserRow[] = [
  { id: 1, lastName: 'Snow',img:"./logo.png",mail:"aa@aa.com", firstName: 'Jon',status:"admin",age: 35 },
  { id: 2, lastName: 'Lannister',img:"https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",mail:"aa@aa.com",status:"admin", firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister',img:"https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",mail:"aa@aa.com",status:"admin", firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark',img:"https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",mail:"aa@aa.com",status:"admin", firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen',img:"./components/image/logo.png",mail:"aa@aa.com",status:"admin", firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre',img:"./components/image/logo.png",mail:"aa@aa.com",status:"admin", firstName: '', age: 150 },
  { id: 7, lastName: 'Clifford',img:"./components/image/logo.png",mail:"aa@aa.com",status:"admin", firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances',img:"./components/image/logo.png",mail:"aa@aa.com",status:"admin", firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie',img:"./components/image/logo.png",mail:"aa@aa.com",status:"admin", firstName: 'Harvey', age: 65 },
];