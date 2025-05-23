"use client";

import { Box, Typography, Grid, Paper, Button } from "@mui/material";

const templates = [
  { id: 1, name: "Blank board", image: "/templates/blank.svg" },
  { id: 2, name: "Flowchart", image: "/templates/flowchart.svg" },
  { id: 3, name: "Mind Map", image: "/templates/mindmap.svg" },
  { id: 4, name: "Kanban Framework", image: "/templates/kanban.svg" },
  { id: 5, name: "Quick Retrospective", image: "/templates/retrospective.svg" },
  { id: 6, name: "Brainwriting", image: "/templates/brainwriting.svg" },
];

const BoardTemplates = () => {
  const handleOtherTemplateClick = (templateName: string) => {
    alert(`Template "${templateName}" not added yet.`);
  };

  return (
    <Box sx={{ mb: 4, mt: -4 }}>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant='h6' fontWeight={500}>
          Explore templates
        </Typography>
      </Box> */}

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          pb: 2, // Add padding for scrollbar
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        {templates.map((template) => (
          <Paper
            key={template.id}
            sx={{
              p: 2,
              textAlign: "center",
              cursor: "not-allowed",
              "&:hover": {
                bgcolor: "inherit",
              },
              opacity: 1,
              height: "100%",
              minWidth: 160,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
            }}
            onClick={() => handleOtherTemplateClick(template.name)}
          >
            <Box
              sx={{
                width: "100%",
                height: 80,
                bgcolor: "#ffffff",
                mb: 1,
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px dashed #ccc",
              }}
            >
              <Typography variant='caption' color='textSecondary'>
                Image
              </Typography>
            </Box>
            <Typography variant='body2' fontWeight={400}>
              {template.name}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default BoardTemplates;
