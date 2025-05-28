import React, { ReactNode, useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  useMediaQuery, 
  useTheme as useMuiTheme,
  Divider,
  Avatar,
  Tooltip,
  alpha
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Build as ToolsIcon, 
  Info as AboutIcon, 
  ContactMail as ContactIcon, 
  AppRegistration as RegisterIcon,
  Menu as MenuIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

const drawerWidth = 240;

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

interface NavItem {
  text: string;
  icon: React.ReactElement;
  href: string;
  description?: string;
}

const navItems: NavItem[] = [
  { 
    text: 'Home', 
    icon: <HomeIcon />, 
    href: '/',
    description: 'Dashboard and overview'
  },
  { 
    text: 'Assignment Tools', 
    icon: <ToolsIcon />, 
    href: '/tools',
    description: 'Grading and assessment tools'
  },
  { 
    text: 'About Us', 
    icon: <AboutIcon />, 
    href: '/about',
    description: 'Learn about our platform'
  },
  { 
    text: 'Trial Access', 
    icon: <RegisterIcon />, 
    href: '/register',
    description: 'Sign up for a free trial'
  },
  { 
    text: 'Contact Us', 
    icon: <ContactIcon />, 
    href: '/contact',
    description: 'Get in touch with our team'
  },
];

export default function Layout({ children, title = 'Ingeno | Education with Gen AI' }: LayoutProps) {
  const theme = useMuiTheme();
  const { mode, toggleTheme } = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('');

  useEffect(() => {
    // Set active item based on current route
    const currentPath = router.pathname;
    const matchingItem = navItems.find(item => 
      currentPath === item.href || 
      (item.href !== '/' && currentPath.startsWith(item.href))
    );

    if (matchingItem) {
      setActiveItem(matchingItem.text);
    }
  }, [router.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Logo section with subtle shadow */}
        <Box sx={{ 
          py: 2.5, 
          px: 2, 
          display: 'flex', 
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          background: alpha(theme.palette.primary.dark, 0.4),
        }}>
          <Image 
            src="/logo.png" 
            alt="Ingeno Logo" 
            width={160} 
            height={70} 
            style={{ 
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2))'
            }}
            priority
          />
        </Box>

        {/* Navigation section */}
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto',
          px: 2,
          py: 2,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha('#ffffff', 0.3),
            borderRadius: '4px',
          },
        }}>
          <List sx={{ width: '100%' }}>
            {navItems.map((item) => {
              const isActive = activeItem === item.text;
              return (
                <Tooltip 
                  key={item.text}
                  title={item.description || ''}
                  placement="right"
                  arrow
                >
                  <Link href={item.href} passHref style={{ textDecoration: 'none' }}>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        sx={{
                          borderRadius: 2,
                          py: 1.2,
                          backgroundColor: isActive 
                            ? alpha(theme.palette.secondary.main, 0.9)
                            : 'transparent',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': isActive ? {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: '4px',
                            backgroundColor: theme.palette.secondary.light,
                            borderRadius: '4px',
                          } : {},
                          '&:hover': {
                            backgroundColor: isActive 
                              ? alpha(theme.palette.secondary.main, 0.9)
                              : alpha(theme.palette.secondary.main, 0.15),
                            transform: 'translateX(4px)',
                            transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ 
                          color: isActive ? '#ffffff' : alpha('#ffffff', 0.85), 
                          minWidth: 40,
                          '& .MuiSvgIcon-root': {
                            transition: 'transform 0.2s ease',
                            transform: isActive ? 'scale(1.1)' : 'scale(1)',
                          }
                        }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          primaryTypographyProps={{
                            fontWeight: isActive ? 600 : 400,
                            fontSize: '0.95rem',
                            letterSpacing: '0.01em',
                            color: isActive ? '#ffffff' : alpha('#ffffff', 0.85),
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                </Tooltip>
              );
            })}
          </List>
        </Box>

        {/* Footer section */}
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${alpha('#fff', 0.1)}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
            © {new Date().getFullYear()} Ingeno
          </Typography>
          <IconButton 
            size="small" 
            onClick={toggleTheme}
            sx={{ 
              color: alpha('#fff', 0.7),
              '&:hover': { color: '#ffffff', backgroundColor: alpha('#fff', 0.1) }
            }}
          >
            {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />

        {/* Mobile app bar */}
        {isMobile && (
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              width: '100%',
              background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              backdropFilter: 'blur(8px)',
              borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    mr: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease-in-out',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Image 
                  src="/logo.png" 
                  alt="Ingeno Logo" 
                  width={120} 
                  height={45} 
                  style={{ 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                  }}
                  priority
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                  <IconButton 
                    color="inherit"
                    size="small"
                    onClick={toggleTheme}
                    sx={{ 
                      ml: 1,
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.2),
                        transition: 'background-color 0.3s ease-in-out',
                      }
                    }}
                  >
                    {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        {/* Sidebar drawer */}
        <Box
          component="nav"
          sx={{ 
            width: { md: drawerWidth }, 
            flexShrink: { md: 0 },
          }}
        >
          {/* Mobile drawer */}
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                },
                '& .MuiBackdrop-root': {
                  backgroundColor: alpha(theme.palette.common.black, 0.5),
                  backdropFilter: 'blur(4px)',
                }
              }}
            >
              {drawer}
            </Drawer>
          ) : (
            /* Desktop drawer */
            <Drawer
              variant="permanent"
              sx={{
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                  border: 'none',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          )}
        </Box>

        {/* Main content */}
        <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              width: { md: `calc(100% - 200px)` }, // Adjusted width
              ml: { md: `20px` }, // Adjusted margin-left
              mt: isMobile ? 8 : 0,
              backgroundColor: theme.palette.background.default,
              minHeight: '50vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
        >
          {/* Page header */}
          {/*{!isMobile && activeItem && (*/}
          {/*    <Box*/}
          {/*        sx={{*/}
          {/*          mb: 3,*/}
          {/*          pb: 2,*/}
          {/*          borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,*/}
          {/*        }}*/}
          {/*    >*/}
          {/*      <Typography*/}
          {/*          variant="h4"*/}
          {/*          component="h1"*/}
          {/*          sx={{*/}
          {/*            fontWeight: 700,*/}
          {/*            color: theme.palette.text.primary,*/}
          {/*            position: 'relative',*/}
          {/*            display: 'inline-block',*/}
          {/*            '&::after': {*/}
          {/*              content: '""',*/}
          {/*              position: 'absolute',*/}
          {/*              bottom: -8,*/}
          {/*              left: 0,*/}
          {/*              width: '40%',*/}
          {/*              height: 3,*/}
          {/*              borderRadius: 1.5,*/}
          {/*              backgroundColor: theme.palette.primary.main,*/}
          {/*            }*/}
          {/*          }}*/}
          {/*      >*/}
          {/*        {activeItem}*/}
          {/*      </Typography>*/}
          {/*    </Box>*/}
          {/*)}*/}

          {/* Main content container */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '1400px',
              mx: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.08)} 0%, transparent 70%)`,
                zIndex: 0,
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -150,
                left: -150,
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.08)} 0%, transparent 70%)`,
                zIndex: 0,
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
              {children}
            </Box>
          </Box>

          {/* Footer */}
          <Box 
            sx={{ 
              mt: 'auto', 
              pt: 3,
              pb: 2,
              opacity: 0.7,
              textAlign: 'center',
              fontSize: '0.75rem',
              color: theme.palette.text.secondary,
            }}
          >
            <Typography variant="caption">
              © {new Date().getFullYear()} Ingeno Education. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
