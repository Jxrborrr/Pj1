import * as React from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Link,
  Button,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}
function getStoredUser() {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function setStoredUser(user) {
  if (localStorage.getItem("token")) {
    localStorage.setItem("user", JSON.stringify(user));
  } else if (sessionStorage.getItem("token")) {
    sessionStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export default function Profile() {
  const token = getToken();
  const storedUser = getStoredUser();
  const navigate = useNavigate();


  const [loading, setLoading] = React.useState(false);
  
  const [msg, setMsg] = React.useState("");

  const [me, setMe] = React.useState({
    fname: storedUser?.fname || "",
    lname: storedUser?.lname || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
  });

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.status === 401 && data?.message?.includes("jwt expired")) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        if (res.ok && data?.user) {
          setMe({
            fname: data.user.fname || "",
            lname: data.user.lname || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
          });
          const toStore = { ...storedUser, ...data.user };
          localStorage.setItem("user", JSON.stringify(toStore));
        }
      } catch (e) {
        console.error(e);
        setMsg("Network error");
      }
    })();
   
  }, []);

  const initials = (me.fname?.[0] || me.email?.[0] || "U").toUpperCase();

  const onSave = async () => {
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fname: (me.fname || "").trim(),
          lname: (me.lname || "").trim(),
          phone: (me.phone || "").trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMsg(data?.message || `Error ${res.status}`);
        return;
      }

      if (data?.user) {
        setMe({
          fname: data.user.fname || "",
          lname: data.user.lname || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
        });
        setStoredUser(data.user);
      }
      setMsg("Saved!");
    } catch (e) {
      console.error(e);
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignedOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const renderAppBar = (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid #eee" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "#0055ff" }}
          >
            Antab
          </Typography>
          <Button
            color="inherit"
            sx={{ fontWeight: "bold", color: "#333" }}
            component={RouterLink}
            to="/hotelbooking"
          >
            HOTEL
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          {!token ? (
            <>
              <Button
                variant="outlined"
                sx={{ color: "#0055ff", borderColor: "#0055ff" }}
                component={RouterLink}
                to="/login"
              >
                Sign in
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#0055ff" }}
                component={RouterLink}
                to="/register"
              >
                CREATE ACCOUNT
              </Button>
            </>
          ) : (
            <AccountMenu
              onSignOut={handleSignedOut}
              onMyTrips={() => navigate("/my-trips")}
              onProfile={() => navigate("/profile")}
            />
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );

  if (!token) {
    return (
      <>
        {renderAppBar}
        <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            User details
          </Typography>
          <Typography sx={{ mb: 2 }}>
            คุณยังไม่ได้เข้าสู่ระบบ กรุณา{" "}
            <Link component={RouterLink} to="/login">
              Sign in
            </Link>{" "}
            or{" "}
            <Link component={RouterLink} to="/register">
              Create account
            </Link>
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      {renderAppBar}

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          User details
        </Typography>

        {/* Header card: ชื่อ + avatar */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ width: 56, height: 56 }}>{initials}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  {`${me.fname || ""} ${me.lname || ""}`.trim() || "—"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Email */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Email
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>{me.email || "—"}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
