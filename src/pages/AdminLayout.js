import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Stack, Typography } from "@mui/material";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin panel
          </Typography>

          <Stack direction="row" spacing={1}>

            <Button
              component={Link}
              to="/admin/bookings"
              variant={location.pathname.includes("/admin/bookings") ? "contained" : "text"}
            >
              Bookings
            </Button>

            <Button
              component={Link}
              to="/admin/rooms"
              variant={location.pathname.includes("/admin/rooms") ? "contained" : "text"}
            >
              Rooms
            </Button>

             <Button
              component={Link}
              to="/admin/users"
              variant={location.pathname.includes("/admin/users") ? "contained" : "text"}
            >
              Users
            </Button>

            <Button variant="outlined" onClick={() => navigate("/")}>
              ← Back to Home
            </Button>

          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
