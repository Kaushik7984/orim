"use client";
import { useAuth } from "@/context/AuthContext";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { MdPerson, MdSettings } from "react-icons/md";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const { user, updateProfile, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile({
        displayName: name,
      });
      setSuccess("Profile updated successfully!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", py: 4 }}>
      <Container maxWidth='md'>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
              <Avatar
                alt='User Avatar'
                src={(user && user.photoURL) || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 2,
                  bgcolor: user ? "#2563eb" : "#e0e0e0",
                  fontSize: "2.5rem",
                }}
              >
                {(user && user.email?.charAt(0).toUpperCase()) || "?"}
              </Avatar>

              <Typography variant='h6' gutterBottom>
                {name || "Your Name"}
              </Typography>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                {email}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper sx={{ borderRadius: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  px: 2,
                  bgcolor: "white",
                }}
              >
                <Tab icon={<MdPerson />} label='Personal Info' />
                <Tab icon={<MdSettings />} label='Account' />
              </Tabs>

              {error && (
                <Alert
                  severity='error'
                  onClose={() => setError("")}
                  sx={{ m: 2 }}
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  severity='success'
                  onClose={() => setSuccess("")}
                  sx={{ m: 2 }}
                >
                  {success}
                </Alert>
              )}

              <Box sx={{ p: 3 }}>
                <TabPanel value={tabValue} index={0}>
                  <Box component='form' onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label='Full Name'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label='Email'
                          value={email}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label='Job Title'
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label='Company'
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type='submit'
                          variant='contained'
                          disabled={loading}
                          sx={{
                            bgcolor: "#2563eb",
                            "&:hover": { bgcolor: "#1d4ed8" },
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Typography variant='h6' gutterBottom>
                    Account Settings
                  </Typography>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={() => logout()}
                    sx={{ mt: 2 }}
                  >
                    Log Out
                  </Button>
                </TabPanel>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
