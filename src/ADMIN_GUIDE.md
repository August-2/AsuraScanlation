# Admin Dashboard Guide

## Accessing the Admin Panel

To access the admin dashboard, navigate to:

```
#admin
```

Simply add `#admin` to the end of your app URL (e.g., `https://yourapp.com/#admin`)

## Admin Credentials

**Username:** `admin`  
**Password:** `admin123`

## Features

### 📊 Dashboard Overview

The admin dashboard provides real-time statistics including:

- **Total Users**: Current user count with daily new user stats
- **Premium Users**: Number of premium subscribers with conversion rate
- **Total Comics**: Number of comics with total chapter count
- **Revenue**: Monthly revenue tracking with growth metrics

### 📚 Comic Management

**View and Edit Comics:**
- Edit comic details (title, author, description, cover image)
- Update ratings and status (ongoing/completed)
- Manage genres
- Delete comics
- View chapters for each comic

**Actions Available:**
- ✏️ Edit comic information
- 👁️ View chapters
- 🗑️ Delete comic

### 📖 Chapter Management

**Manage Chapters:**
- Edit chapter titles and numbers
- Toggle premium/free status (lock/unlock chapters)
- View release dates (both premium and free)
- Track number of pages per chapter
- Delete chapters

**Chapter States:**
- 🔒 **Premium Only** (Locked) - Only premium users can read
- 🔓 **Free** (Unlocked) - Available to all users

### 👥 User Management

**User Overview:**
- View all registered users
- See user status (Premium/Free)
- Track join dates
- Access user details
- Edit user information

**User Actions:**
- View detailed user profiles
- Edit user information
- Track reading history
- Manage premium status

## Tips

1. **Quick Stats**: The dashboard homepage gives you a quick overview of your platform's performance
2. **Comic Management**: Use the Comics tab to manage all your manhwa content
3. **Chapter Control**: Switch to the Chapters tab after selecting a comic to manage its chapters
4. **User Insights**: Check the Users tab to see who's using your platform

## Security Notes

⚠️ **Important**: This is a demo admin system. In production:
- Use proper authentication with secure password hashing
- Implement role-based access control (RBAC)
- Add audit logging for all admin actions
- Use HTTPS for all admin communications
- Implement 2FA for admin accounts
- Set up session timeouts
- Use environment variables for credentials

## Logging Out

Click the **Logout** button in the top-right corner of the admin dashboard to exit the admin panel and return to the main app.
