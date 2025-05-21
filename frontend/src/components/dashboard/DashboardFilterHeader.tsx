"use client";

import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface DashboardFilterHeaderProps {
  onCreateClick: () => void;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  currentFilter: string;
  currentSort: string;
}

const DashboardFilterHeader = ({
  onCreateClick,
  onFilterChange,
  onSortChange,
  currentFilter,
  currentSort,
}: DashboardFilterHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        mb: 3,
        flexWrap: "wrap",
        gap: 2,
        marginTop: -4,
      }}
    >
      <Typography
        variant='h5'
        fontWeight={500}
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          width: { xs: "100%", sm: "auto" },
          mb: { xs: 1, sm: 0 },
        }}
      >
        Boards in this team
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1,
            width: { xs: "100%", sm: "auto" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography
            variant='body2'
            color='textSecondary'
            sx={{
              minWidth: { xs: "100%", sm: "auto" },
              mb: { xs: 0.5, sm: 0 },
            }}
          >
            Filter by
          </Typography>
          <FormControl
            size='small'
            sx={{
              minWidth: { xs: "100%", sm: "120px" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Select
              value={currentFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ fontSize: "0.875rem" }}
            >
              <MenuItem value='All boards'>All boards</MenuItem>
              <MenuItem value='Collaborator'>Collaborator</MenuItem>
              {/* Add other filter options as needed */}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1,
            width: { xs: "100%", sm: "auto" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography
            variant='body2'
            color='textSecondary'
            sx={{
              minWidth: { xs: "100%", sm: "auto" },
              mb: { xs: 0.5, sm: 0 },
            }}
          >
            Sort by
          </Typography>
          <FormControl
            size='small'
            sx={{
              minWidth: { xs: "100%", sm: "120px" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Select
              value={currentSort}
              onChange={(e) => onSortChange(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ fontSize: "0.875rem" }}
            >
              <MenuItem value='Last opened'>Last opened</MenuItem>
              {/* Add other sort options as needed */}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={onCreateClick}
          sx={{
            borderRadius: "4px",
            textTransform: "none",
            fontSize: "0.875rem",
            minWidth: { xs: "100%", sm: "auto" },
            pl: 1.5,
            pr: 2,
            py: 0.75,
            mt: { xs: 1, sm: 0 },
          }}
        >
          Create new
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardFilterHeader;
