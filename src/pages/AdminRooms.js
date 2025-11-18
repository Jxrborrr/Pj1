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
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

console.log("API_URL =", API_URL);

export default function AdminRooms() {
  const [rooms, setRooms] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingRoom, setEditingRoom] = React.useState(null);
  const [form, setForm] = React.useState({
    id: null,
    room_number: "",
    room_type: "",
    city: "",
    price_per_night: "",
    status: "",
  });

  const token = getToken();

  const loadRooms = React.useCallback(async () => {
    if (!token) {
      setError("Please log in as admin.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "Failed to load data.");
      }

      setRooms(data.rooms || []);
      setError("");
    } catch (e) {
      console.error(e);
      setError(e.message || "Error occurred.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const openCreateDialog = () => {
    setEditingRoom(null);
    setForm({
      id: null,
      room_number: "",
      room_type: "",
      city: "",
      price_per_night: "",
      status: "",
    });
    setOpenDialog(true);
  };

  const openEditDialog = (room) => {
    setEditingRoom(room);
    setForm({
      id: room.id,
      room_number: room.room_number,
      room_type: room.room_type,
      city: room.city,
      price_per_night: room.price_per_night,
      status: room.status,
    });
    setOpenDialog(true);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    const token = getToken();
    const body = {
      room_number: form.room_number.trim(),
      room_type: form.room_type.trim(),
      city: form.city.trim(),
      price_per_night: Number(form.price_per_night) || 0,
      status: form.status,
    };

    const isEdit = !!form.id;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${API_URL}/admin/rooms/${form.id}`
      : `${API_URL}/admin/rooms`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "ok") {
        console.error("SAVE ROOM ERROR:", data);
        alert(data.message || "Failed to save room");
        return;
      }

      setOpenDialog(false);
      setEditingRoom(null);
      setForm({
        id: null,
        room_number: "",
        room_type: "",
        city: "",
        price_per_night: "",
        status: "",
      });
      loadRooms();
    } catch (err) {
      console.error(err);
      alert(err.message || "Network error");
    }
  };

  const handleDelete = async (room) => {
    if (!window.confirm(`Delete room "${room.room_number}" ?`)) return;

    try {
      const res = await fetch(`${API_URL}/admin/rooms/${room.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "Delete failed.");
      }
      loadRooms();
    } catch (e) {
      console.error(e);
      alert(e.message || "Error while deleting.");
    }
  };

  const renderStatusChip = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "unavailable") {
      return <Chip label="Unavailable" color="error" size="small" />;
    }
    if (s === "maintenance") {
      return <Chip label="Maintenance" color="warning" size="small" />;
    }
    return <Chip label="Available" color="success" size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>
          Admin – Manage Rooms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          Add room
        </Button>
      </Stack>

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
                <TableCell>Room no.</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>City</TableCell>
                <TableCell align="right">Price / night</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((r, idx) => (
                <TableRow key={r.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{r.room_number}</TableCell>
                  <TableCell>{r.room_type}</TableCell>
                  <TableCell>{r.city}</TableCell>
                  <TableCell align="right">
                    ฿{Number(r.price_per_night || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{renderStatusChip(r.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEditDialog(r)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(r)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {rooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No rooms found. Click "Add room" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Dialog: Add / Edit room */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRoom ? "Edit room" : "Add new room"}
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Room number"
            value={form.room_number}
            onChange={handleChange("room_number")}
            fullWidth
            required
          />
          <TextField
            label="Room type"
            value={form.room_type}
            onChange={handleChange("room_type")}
            fullWidth
            required
            placeholder="Standard / Deluxe / Suite / Family / etc."
          />
          <TextField
            label="City"
            value={form.city}
            onChange={handleChange("city")}
            fullWidth
            required
            placeholder="Bangkok / Pattaya / Chiang Mai / ..."
          />
          <TextField
            label="Price per night (THB)"
            type="number"
            value={form.price_per_night}
            onChange={handleChange("price_per_night")}
            fullWidth
            required
          />
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={handleChange("status")}
            fullWidth
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="unavailable">Unavailable</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
