import { Timestamp } from 'firebase/firestore';

export const userColumns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "createdAt",
    headerName: "Created Timestamp",
    width: 200,
    valueGetter: (params) => {
      const createdAtTimestamp = params.row.createdAt; // Gantilah ini dengan nama field yang sesuai
      if (createdAtTimestamp instanceof Timestamp) {
        // Pastikan itu benar-benar Timestamp
        const jsDate = createdAtTimestamp.toDate(); // Konversi ke objek Date

        // Format waktu menjadi string, contoh: "DD/MM/YYYY HH:mm:ss"
        const formattedDate = `${jsDate.getDate()} ${jsDate.toLocaleString('default', { month: 'short' })} ${jsDate.getFullYear()}`;

        return formattedDate;
      }

      return ""; // Atau tindakan lain jika bukan Timestamp
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
  {
    field: "roles",
    headerName: "Roles",
    width: 120,
  },
];

