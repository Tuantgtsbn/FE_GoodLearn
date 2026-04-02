import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Menu from '@mui/material/Menu';
import MenuItemMUI from '@mui/material/MenuItem';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AuthButton from '@components/AuthWapperButton';
import { Box, useMediaQuery, useTheme } from '@mui/material';

export interface ISideBarItem {
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  to?: string;
  requireAuth?: boolean;
  children?: ISideBarItem[];
}

interface ISideBarProps {
  items: ISideBarItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const MenuItemWithChildren: React.FC<{
  item: ISideBarItem;
  currentPath: string;
  orientation: 'horizontal' | 'vertical';
}> = ({ item, currentPath, orientation }) => {
  const isOpen =
    item.children?.some(
      (child) => child.to && currentPath.startsWith(child.to)
    ) || false;
  const [open, setOpen] = useState(isOpen);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (orientation === 'vertical') {
      setOpen(!open);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isSelected = item.children?.some((child) =>
    child.to ? currentPath.startsWith(child.to) : false
  );

  if (orientation === 'horizontal') {
    return (
      <Box component="li">
        <ListItemButton
          onClick={handleClick}
          selected={isSelected}
          sx={{
            borderRadius: '8px',
            minHeight: '40px',
            gap: '8px',
            px: 2,
            py: 0.75,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%',
            color: isSelected ? 'black' : 'text.secondary',
            backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
            '&:hover': {
              backgroundColor: isSelected
                ? 'rgba(0, 0, 0, 0.06)'
                : 'rgba(0, 0, 0, 0.04)',
              transform: 'translateY(-1px)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(0, 0, 0, 0.06)',
              color: 'black',
              fontWeight: 700,
            },
          }}
        >
          {item.icon && (
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                color: 'inherit',
                fontSize: 20,
              }}
            >
              {React.isValidElement(item.icon)
                ? React.cloneElement(
                    item.icon as React.ReactElement,
                    {
                      size: 20,
                    } as any
                  )
                : item.icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isSelected ? 700 : 600,
              noWrap: true,
            }}
          />
          <ExpandMore
            sx={{
              fontSize: 18,
              opacity: 0.7,
              transform: anchorEl ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          />
        </ListItemButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          elevation={4}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '12px',
              mt: 1,
              minWidth: 180,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
            },
          }}
        >
          {item.children?.map((child, idx) => (
            <MenuItemMUI
              key={child.label + idx}
              onClick={() => {
                child.action?.();
                handleClose();
              }}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: '8px',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                  color: 'black',
                },
              }}
            >
              <MenuItem
                item={child}
                currentPath={currentPath}
                orientation="vertical"
              />
            </MenuItemMUI>
          ))}
        </Menu>
      </Box>
    );
  }

  return (
    <>
      <ListItem sx={{ px: 1, py: 0.5 }}>
        <ListItemButton
          onClick={handleClick}
          selected={isSelected}
          sx={{
            borderRadius: '10px',
            transition: 'all 0.2s ease-in-out',
            color: isSelected ? 'black' : 'text.secondary',
            py: 1,
            '&:hover': {
              backgroundColor: isSelected
                ? 'rgba(0, 0, 0, 0.06)'
                : 'rgba(0, 0, 0, 0.04)',
              '& .MuiListItemIcon-root': {
                transform: 'scale(1.1)',
              },
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(0, 0, 0, 0.06)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.06)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                width: '4px',
                height: '60%',
                backgroundColor: 'black',
                borderRadius: '0 4px 4px 0',
              },
            },
            width: '100%',
          }}
        >
          {item.icon && (
            <ListItemIcon
              sx={{
                minWidth: '38px',
                color: 'inherit',
                transition: 'transform 0.2s',
              }}
            >
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: isSelected ? 700 : 600,
              fontSize: '0.925rem',
            }}
          />
          {open ? (
            <ExpandLess sx={{ fontSize: 20 }} />
          ) : (
            <ExpandMore sx={{ fontSize: 20 }} />
          )}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 2 }}>
          {item.children?.map((child, idx) => (
            <MenuItem
              key={child.label + idx}
              item={child}
              currentPath={currentPath}
              orientation={orientation}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

// Component riêng cho menu item đơn
const MenuItem: React.FC<{
  item: ISideBarItem;
  currentPath: string;
  orientation: 'horizontal' | 'vertical';
}> = ({ item, currentPath, orientation }) => {
  const hasChildren = !!item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <MenuItemWithChildren
        item={item}
        currentPath={currentPath}
        orientation={orientation}
      />
    );
  }
  const isSelected =
    (!['/', '/app', '/admin'].includes(item.to || '') &&
      currentPath.startsWith(item.to || '')) ||
    (['/', '/app', '/admin'].includes(item.to || '') &&
      currentPath === item.to);

  return (
    <AuthButton
      action={() => item.action?.()}
      isRequiredAuth={item.requireAuth}
    >
      <ListItemButton
        selected={isSelected}
        sx={{
          flex: 'initial',
          borderRadius: '8px',
          gap: orientation === 'horizontal' ? '8px' : '12px',
          px: 2,
          py: orientation === 'horizontal' ? 0.75 : 1,
          whiteSpace: 'nowrap',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          width: orientation === 'horizontal' ? 'auto' : '100%',
          color: isSelected ? 'black' : 'text.secondary',
          '&:hover': {
            backgroundColor: isSelected
              ? 'rgba(0, 0, 0, 0.06)'
              : 'rgba(0,0,0,0.04)',
            transform:
              orientation === 'horizontal' ? 'translateY(-1px)' : 'none',
            '& .MuiListItemIcon-root': {
              color: 'black',
            },
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.06)',
            color: 'black',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.06)',
            },
            '&::before':
              orientation === 'vertical'
                ? {
                    content: '""',
                    position: 'absolute',
                    left: 4,
                    width: '4px',
                    height: '50%',
                    backgroundColor: 'black',
                    borderRadius: '4px',
                  }
                : undefined,
          },
        }}
      >
        {item.icon && (
          <ListItemIcon
            sx={{
              minWidth: 'auto',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              fontSize: 20,
              transition: 'color 0.2s',
            }}
          >
            {React.isValidElement(item.icon)
              ? React.cloneElement(
                  item.icon as React.ReactElement,
                  {
                    size: 20,
                  } as any
                )
              : item.icon}
          </ListItemIcon>
        )}
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            noWrap: true,
            fontSize: '0.875rem',
            fontWeight: isSelected ? 700 : 600,
          }}
        />
      </ListItemButton>
    </AuthButton>
  );
};

const SideBar: React.FC<ISideBarProps> = ({
  items,
  header,
  footer,
  className,
  orientation: propOrientation,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const orientation = propOrientation || (isMobile ? 'vertical' : 'horizontal');

  if (orientation === 'horizontal') {
    return (
      <header
        className={`w-full bg-white border-b border-gray-100 flex items-center px-4 shadow-sm ${className || ''}`}
        style={{ height: '64px' }}
      >
        {header}
        <List
          className="flex-1 flex flex-row items-center"
          sx={{ py: 0, overflowX: 'auto', gap: 1 }}
        >
          {items.map((item, idx) => (
            <MenuItem
              key={item.label + idx}
              item={item}
              currentPath={currentPath}
              orientation="horizontal"
            />
          ))}
        </List>
        {footer}
      </header>
    );
  }

  return (
    <aside
      className={`h-full bg-gray-50 pt-4 border-r border-gray-100 flex flex-col justify-between shadow-sm ${className || ''}`}
    >
      {header}
      <List className="flex-1" sx={{ py: 0, overflowY: 'auto' }}>
        {items.map((item, idx) => (
          <MenuItem
            key={item.label + idx}
            item={item}
            currentPath={currentPath}
            orientation="vertical"
          />
        ))}
      </List>

      {footer && (
        <div className="border-t border-gray-100 py-4 px-2 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </aside>
  );
};

export default SideBar;
