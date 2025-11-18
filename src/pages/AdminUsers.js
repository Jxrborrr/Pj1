import React from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export default function AdminUsers() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("Please sign in as admin first.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("ADMIN USERS RESPONSE:", data);

        if (!res.ok || data.status !== "ok") {
          throw new Error(data.message || "db error");
        }

        setUsers(data.users || []);
      } catch (e) {
        console.error(e);
        setError(e.message || "db error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        Admin – Manage users
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {!loading && error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Paper sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u, idx) => (
                <TableRow key={u.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {(u.fname || "") + " " + (u.lname || "")}
                  </TableCell>
                  <TableCell>{u.phone || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.is_admin ? "Admin" : "User"}
                      color={u.is_admin ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
