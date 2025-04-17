"use client";
import { Box, IconButton, Tooltip, Divider } from "@mui/material";
import CursorIcon from "@mui/icons-material/MouseOutlined";
import ShapeLineIcon from "@mui/icons-material/ShowChart";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PanToolIcon from "@mui/icons-material/PanTool";
import RectangleIcon from "@mui/icons-material/Rectangle";
import CircleIcon from "@mui/icons-material/Circle";
import CreateIcon from "@mui/icons-material/Create";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import AddIcon from "@mui/icons-material/Add";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

const BoardToolbar = () => {
  const tools = [
    { icon: <CursorIcon />, name: "Select" },
    { icon: <PanToolIcon />, name: "Hand" },
    { icon: <CreateIcon />, name: "Pen" },
    { icon: <ShapeLineIcon />, name: "Line" },
    { icon: <RectangleIcon />, name: "Rectangle" },
    { icon: <CircleIcon />, name: "Circle" },
    { icon: <TextFieldsIcon />, name: "Text" },
    { icon: <StickyNote2Icon />, name: "Sticky Note" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "48px",
        backgroundColor: "#fff",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      {/* Main Tools */}
      <Box sx={{ p: 0.5 }}>
        {tools.map((tool) => (
          <Tooltip key={tool.name} title={tool.name} placement="right">
            <IconButton
              size="small"
              sx={{
                width: 40,
                height: 40,
                mb: 0.5,
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {tool.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Divider />

      {/* Bottom Tools */}
      <Box sx={{ p: 0.5, mt: "auto" }}>
        <Tooltip title="Add" placement="right">
          <IconButton
            size="small"
            sx={{
              width: 40,
              height: 40,
              mb: 0.5,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Undo" placement="right">
          <IconButton
            size="small"
            sx={{
              width: 40,
              height: 40,
              mb: 0.5,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <UndoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo" placement="right">
          <IconButton
            size="small"
            sx={{
              width: 40,
              height: 40,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <RedoIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default BoardToolbar; 