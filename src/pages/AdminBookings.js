import React from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

console.log("API_URL =", API_URL);

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export default function AdminBookings() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("Please sign in with an admin account.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/admin/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || data.status !== "ok") {
          throw new Error(data.message || "Failed to load data.");
        }

        setItems(data.bookings || []);
      } catch (e) {
        console.error(e);
        setError(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const token = getToken();

    try {
      const res = await fetch(`${API_URL}/admin/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "Failed to update status");
      }

      setItems((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to update status.");
    }
  };

  const renderStatusChip = (status) => {
    const s = status || "pending";
    let color = "default";

    if (s === "confirmed") color = "success";
    else if (s === "paid") color = "info";
    else if (s === "cancelled") color = "error";

    return <Chip label={s} size="small" color={color} />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        Admin – All Bookings
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
                <TableCell>Booking Code</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total Price</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((b, idx) => (
                <TableRow key={b.id}>
                  <TableCell>{idx + 1}</TableCell>

                  <TableCell>{b.booking_code || "-"}</TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {b.room_name || "-"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {b.city || b.room_type || ""}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {b.fname || ""} {b.lname || ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {b.user_email}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {b.check_in
                      ? dayjs(b.check_in).format("DD MMM YYYY")
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {b.check_out
                      ? dayjs(b.check_out).format("DD MMM YYYY")
                      : "-"}
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {renderStatusChip(b.status)}

                      <FormControl size="small" sx={{ minWidth: 110 }}>
                        <Select
                          value={b.status || "pending"}
                          onChange={(e) =>
                            handleStatusChange(b.id, e.target.value)
                          }
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="paid">Paid</MenuItem>
                          <MenuItem value="confirmed">Confirmed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </TableCell>

                  <TableCell align="right">
                    ฿{Number(b.total_price || 0).toLocaleString()}
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
