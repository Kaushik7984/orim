import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

interface TemplateMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const TemplateMenu: React.FC<TemplateMenuProps> = ({ anchorEl, onClose }) => {
  const router = useRouter();

  const templates = [
    { id: 1, name: "Kanban Board" },
    { id: 2, name: "Scrum Board" },
    { id: 3, name: "Roadmap" },
    { id: 4, name: "Weekly Planner" },
  ];

  const handleSelectTemplate = (templateId: number) => {
    // router.push(`/board/new?template=${templateId}`);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {templates.map((template) => (
        <MenuItem
          key={template.id}
          onClick={() => handleSelectTemplate(template.id)}
        >
          {template.name}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default TemplateMenu;
