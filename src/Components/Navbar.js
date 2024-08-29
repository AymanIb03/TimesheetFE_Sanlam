import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import sanlamLogo from '../assets/sanlam.svg';
import '../App.css';
import moment from 'moment'; 

function CustomNavbar() {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://localhost:44396/api/Timesheet/GetNotifications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(notification => !notification.isRead).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTimeout(markAllNotificationsAsRead, 5000); 
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notification => !notification.isRead);
      await Promise.all(unreadNotifications.map(async (notification) => {
        await fetch(`https://localhost:44396/api/Timesheet/MarkNotificationAsRead/${notification.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
        });
      }));

      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true
      }));

      setNotifications(updatedNotifications);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const formatDate = (date) => {
    const now = moment();
    const diffInHours = now.diff(moment(date), 'hours');
    if (diffInHours < 1) {
      return `il y a ${now.diff(moment(date), 'minutes')} min`;
    } else if (diffInHours < 24) {
      return `il y a ${diffInHours} h`;
    } else {
      return moment(date).format('HH:mm');
    }
  };

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = moment(notification.dateCreated).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 custom-navbar" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand className="d-flex align-items-center">
          <img src={sanlamLogo} height="40" alt="Sanlam Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="mx-auto">
            <Nav.Link
              as={Link}
              to="/user-dashboard"
              className={`mx-3 nav-link-custom ${location.pathname === '/user-dashboard' ? 'active-nav-link' : ''}`}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/timesheets"
              className={`mx-3 nav-link-custom ${location.pathname === '/timesheets' ? 'active-nav-link' : ''}`}
            >
              Timesheets
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/account-info"
              className={`mx-3 nav-link-custom ${location.pathname === '/account-info' ? 'active-nav-link' : ''}`}
              style={{ display: 'flex', alignItems: 'center', padding: 0 }}
            >
              <AccountCircleIcon sx={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
              <span>Account</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav className="ms-auto d-flex align-items-center">
          <IconButton
            color="inherit"
            className="me-3"
            sx={{
              color: '#007bff',
              backgroundColor: '#f0f8ff',
              borderRadius: '50%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '0.3rem'
            }}
            onClick={handleDropdownClick}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon sx={{ color: '#007bff' }} />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              style: {
                minWidth: '350px',
                maxHeight: '400px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            {Object.keys(groupedNotifications).length === 0 ? (
              <MenuItem>Aucune nouvelle notification.</MenuItem>
            ) : (
              Object.keys(groupedNotifications).map((date) => (
                <React.Fragment key={date}>
                  <MenuItem disabled className="text-muted" style={{ fontSize: '1rem', fontWeight: 'bold', padding: '0.5rem 1rem' }}>
                    {moment(date).format('D MMMM YYYY')}
                  </MenuItem>
                  {groupedNotifications[date].map((notification, index) => (
                    <MenuItem
                      key={index}
                      className={notification.isRead ? '' : 'font-weight-bold'}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: notification.isRead ? '#fff' : '#e9f5ff',
                        borderBottom: '1px solid #dee2e6'
                      }}
                    >
                      <div>
                        {notification.message}
                        <br />
                        <small style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                          {formatDate(notification.dateCreated)}
                        </small>
                      </div>
                    </MenuItem>
                  ))}
                </React.Fragment>
              ))
            )}
          </Menu>
          <Button variant="outline-light" as={Link} to="/logout"
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '30px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s ease',
              fontWeight: 'bold',
            }}
          >
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
