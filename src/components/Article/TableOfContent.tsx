import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface TocItem {
  id: string;
  label: string;
  level: number;
}

interface TableOfContentProps {
  toc: TocItem[];
  title?: string;
  onSectionClick?: (id: string) => void;
}

const TocSectionList: React.FC<{
  sections: TocItem[];
  onSectionClick?: (id: string) => void;
}> = ({ sections, onSectionClick }) => {
  const handleClick = (id: string) => {
    if (onSectionClick) {
      onSectionClick(id);
    } else {
      // Mặc định scroll đến section
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <List
      sx={{
        py: 0,
        '& .MuiListItemButton-root': {
          borderRadius: 1,
          mb: 0.5,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: '#f3f4f6',
          },
        },
      }}
    >
      {sections.map((item) => (
        <ListItemButton
          key={item.id}
          onClick={() => handleClick(item.id)}
          sx={{
            pl: item.level * 2, // Indent theo level (h1=1, h2=2, h3=3...)
            py: 1,
          }}
        >
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: item.level === 1 ? '0.95rem' : '0.875rem',
              fontWeight: item.level === 1 ? 600 : 500,
              color: '#000',
            }}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

const TableOfContent: React.FC<TableOfContentProps> = ({
  toc,
  title = 'Mục lục',
  onSectionClick,
}) => {
  console.log('Rendering TableOfContent with toc:', toc);
  return (
    <Accordion
      sx={{ boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="text.secondary" fontWeight={700} fontSize={18}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <TocSectionList sections={toc} onSectionClick={onSectionClick} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default TableOfContent;
