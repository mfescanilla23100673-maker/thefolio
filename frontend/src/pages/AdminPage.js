// frontend/src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';

const AdminPage = () => {
 const [users, setUsers] = useState([]);
 const [posts, setPosts] = useState([]);
 const [tab, setTab] = useState('users');
 const [themeIcon, setThemeIcon] = useState('🌙');

 const getUserRoleType = (user) => {
   const normalized = user?.name?.trim().toLowerCase();
   if (normalized === 'mark escanilla' || normalized?.includes('mark escanilla')) return 'owner';
   if (user?.role === 'admin') return 'admin';
   return 'member';
 };
 
 useEffect(() => {
   initializeTheme();
   setThemeIcon(getThemeIcon());
   API.get('/admin/users').then(r => setUsers(r.data));
   API.get('/admin/posts').then(r => setPosts(r.data));
 }, []);
 
 const handleThemeToggle = () => {
   toggleTheme();
   setThemeIcon(getThemeIcon());
 };
 
 const toggleStatus = async (id) => {
   const { data } = await API.put(`/admin/users/${id}/status`);
   setUsers(users.map(u => u._id === id ? data.user : u));
 };
 
 const removePost = async (id) => {
   await API.put(`/admin/posts/${id}/remove`);
   setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
 };

return (
 <div className='admin-page'>
   <header className='header'>
     <h1 className='logo'>MFAE POETRY</h1>
     <nav className='nav'>
       <ul>
         <li><Link to='/home'>Home</Link></li>
         <li><Link to='/about'>About</Link></li>
         <li><Link to='/contact'>Contact</Link></li>
         <li><Link to='/admin' className='active'>Admin Dashboard</Link></li>
       </ul>
     </nav>
   </header>

   <main className='container'>
     <button id='theme-toggle' className='theme-toggle' onClick={handleThemeToggle}>
       {themeIcon}
     </button>

     <section className='admin-section'>
       <div className='admin-header'>
         <h2>Admin Dashboard</h2>
         <p>Manage community members and oversee all posts.</p>
       </div>

       <div className='admin-tabs'>
         <button onClick={() => setTab('users')} className={tab === 'users' ? 'active' : ''}>
           Members ({users.length})
         </button>
         <button onClick={() => setTab('posts')} className={tab === 'posts' ? 'active' : ''}>
           All Posts ({posts.length})
         </button>
       </div>
       {tab === 'users' && (
         <div className='admin-table-wrapper'>
           <table className='admin-table'>
             <thead>
               <tr>
                 <th>Name</th>
                 <th>Email</th>
                 <th>Role</th>
                 <th>Status</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {users.map(u => (
                 <tr key={u._id}>
                   <td>{u.name}</td>
                   <td>{u.email}</td>
                   <td><span className={`role-badge ${getUserRoleType(u)}`}>{getUserRoleType(u) === 'owner' ? 'Owner' : getUserRoleType(u) === 'admin' ? 'Admin' : 'Member'}</span></td>
                   <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                   <td>
                     <button onClick={() => toggleStatus(u._id)} className={u.status === 'active' ? 'btn-danger' : 'btn-success'}>
                       {u.status === 'active' ? 'Deactivate' : 'Activate'}
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       )}
 {tab === 'posts' && (
         <div className='admin-table-wrapper'>
           <table className='admin-table'>
             <thead>
               <tr>
                 <th>Title</th>
                 <th>Author</th>
                 <th>Status</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {posts.map(p => (
                 <tr key={p._id}>
                   <td>{p.title}</td>
                   <td>{p.author?.name}</td>
                   <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                   <td>
                     {p.status === 'published' && (
                       <button className='btn-danger' onClick={() => removePost(p._id)}>
                         Remove
                       </button>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       )}
     </section>
   </main>

   <footer className='footer'>
     <p>Contact: mfescanilla23100673@student.dmmmsu.edu.ph | Phone: 09120863514</p>
     <p>© 2026 Mark Fermin A. Escanilla. All rights reserved.</p>
   </footer>
 </div>
 );
};
export default AdminPage;
