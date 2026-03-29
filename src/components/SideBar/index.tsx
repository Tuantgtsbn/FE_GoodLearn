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
            borderRadius: '6px',
            minHeight: '36px',
            gap: '6px',
            px: 1.5,
            py: 0.5,
            transition: 'all 0.2s',
            width: '100%',
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>
              {React.isValidElement(item.icon)
                ? React.cloneElement(
                    item.icon as React.ReactElement,
                    {
                      size: 18,
                    } as any
                  )
                : item.icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
              noWrap: true,
            }}
          />
          <ExpandMore sx={{ fontSize: 16, opacity: 0.7 }} />
        </ListItemButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
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
                backgroundColor:
                  child.to && currentPath.startsWith(child.to)
                    ? '#ccc'
                    : 'inherit',
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
      <ListItem>
        <ListItemButton
          onClick={handleClick}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#ccc',
            },
            '&.MuiListItemButton-root': {
              borderRadius: '8px',
            },
            width: '100%',
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: '24px', gap: '0px' }}>
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText primary={item.label} />
          {open ? <ExpandLess /> : <ExpandMore />}
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
          borderRadius: '6px',
          gap: orientation === 'horizontal' ? '8px' : '10px',
          px: 1.5,
          py: 0.5,
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          width: orientation === 'horizontal' ? 'auto' : '100%',
        }}
      >
        {item.icon && (
          <ListItemIcon
            sx={{
              minWidth: 'auto',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {React.isValidElement(item.icon)
              ? React.cloneElement(item.icon as React.ReactElement, {
                  size: 18,
                })
              : item.icon}
          </ListItemIcon>
        )}
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            noWrap: true,
            fontSize: '0.875rem',
            fontWeight: isSelected ? 600 : 500,
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
        className={`w-full bg-gray-200 border-b border-gray-200 flex items-center px-4 ${className || ''}`}
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
      className={`h-full bg-gray-200 pt-4 border-r border-gray-200 flex flex-col justify-between ${className || ''}`}
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
        <div className="border-t border-gray-200 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </aside>
  );
};

export default SideBar;
