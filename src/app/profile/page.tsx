"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  Avatar,
  Grid,
  IconButton,
  CircularProgress,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { IoMdCamera } from "react-icons/io";
import { MdPerson, MdSettings, MdNotifications } from "react-icons/md";

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
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
      setAvatarPreview(user.photoURL || "");
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile({
        displayName: name,
        // photoURL: uploadedAvatarUrl
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
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  alt='User Avatar'
                  src={avatarPreview}
                  sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                />
                <input
                  id='avatar-upload'
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
                <label htmlFor='avatar-upload'>
                  <IconButton
                    component='span'
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "white",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    <IoMdCamera />
                  </IconButton>
                </label>
              </Box>
              <Typography variant='h6' gutterBottom>
                {name || "Your Name"}
              </Typography>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                {email}
              </Typography>
            </Paper>
          </Grid>

          {/* Main Content */}
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
                <Tab icon={<MdNotifications />} label='Preferences' />
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
                    Notification Settings
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailNotifications}
                        onChange={(e) =>
                          setEmailNotifications(e.target.checked)
                        }
                      />
                    }
                    label='Email Notifications'
                  />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Typography variant='h6' gutterBottom>
                    Account Settings
                  </Typography>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={() => router.push("/auth/logout")}
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
