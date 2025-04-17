"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";

const StyledSearchBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f5f5f5",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  width: "300px",
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

const BoardCard = styled(Card)(({ theme }) => ({
  height: "200px",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState("grid");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("last");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterBy(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const mockBoards = [
    { id: 1, name: "My First Board", lastModified: "Apr 12", owner: "kaushik7984" },
    { id: 2, name: "Untitled", lastModified: "Apr 11", owner: "kaushik7984" },
    // Add more mock boards as needed
  ];

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Boards in this team
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/")}
            sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
          >
            Create new
          </Button>
        </Box>

        {/* Filters and Search Section */}
        <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <StyledSearchBox>
            <SearchIcon />
            <TextField
              placeholder="Search by title or topic"
              variant="standard"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ disableUnderline: true }}
              fullWidth
            />
          </StyledSearchBox>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter by</InputLabel>
            <Select value={filterBy} label="Filter by" onChange={handleFilterChange}>
              <MenuItem value="all">All boards</MenuItem>
              <MenuItem value="owned">Owned by me</MenuItem>
              <MenuItem value="shared">Shared with me</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select value={sortBy} label="Sort by" onChange={handleSortChange}>
              <MenuItem value="last">Last opened</MenuItem>
              <MenuItem value="created">Created date</MenuItem>
              <MenuItem value="name">Board name</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ ml: "auto" }}>
            <IconButton onClick={() => setViewType("grid")} color={viewType === "grid" ? "primary" : "default"}>
              <GridViewIcon />
            </IconButton>
            <IconButton onClick={() => setViewType("list")} color={viewType === "list" ? "primary" : "default"}>
              <ListIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Boards Grid */}
        <Grid container spacing={3}>
          {mockBoards.map((board) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={board.id}>
              <BoardCard>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" noWrap>
                      {board.name}
                    </Typography>
                    <IconButton size="small" onClick={handleMenuClick}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Last modified: {board.lastModified}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Owner: {board.owner}
                  </Typography>
                </CardContent>
              </BoardCard>
            </Grid>
          ))}
        </Grid>

        {/* Board Options Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Rename</MenuItem>
          <MenuItem onClick={handleMenuClose}>Duplicate</MenuItem>
          <MenuItem onClick={handleMenuClose}>Share</MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
            Delete
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
}
