import "./datatable.scss";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { UserRow, userColumns,userRows } from "./datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
export default function DataTable() {
    const [data, setData] = useState(userRows);

    const handleDelete = (id: number) => {
        setData(data.filter((item: UserRow) => item.id !== id));
    } ;
    const actionClone =[
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params: { row: { id: any; }; }) => {
            
              return (
                <div className="cellAction">
                  <Link to="/users/test" style={{ textDecoration: "none" }}>
                    <div className="viewButton">View</div>
                  </Link>
                  <div
                    className="deleteButton"
                   onClick={() => handleDelete(params.row.id)} 
                  >
                    Delete
                  </div>
                </div>
              );
            },
          },
        ];
  return (
    <div className="datatable">
    <div className="datatableTitle">
      Add New User
      <Link to="/users/new" className="link">
        Add New
      </Link>
    </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionClone)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}

