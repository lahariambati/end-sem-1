import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUsers, fetchPosts, createPost, updatePost, deletePost } from '../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    
    if (activeTab === 'users') {
      const result = await fetchUsers();
      if (result.success) {
        setUsers(result.data);
      }
    } else if (activeTab === 'posts') {
      const result = await fetchPosts();
      if (result.success) {
        setPosts(result.data);
      }
    } else if (activeTab === 'assessments') {
      const allAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      setAssessments(allAssessments);
    }
    
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.body) return;
    
    const result = await createPost({
      title: newPost.title,
      body: newPost.body,
      userId: 1
    });
    
    if (result.success) {
      setPosts([result.data, ...posts]);
      setNewPost({ title: '', body: '' });
    }
  };

  const handleDeletePost = async (id: number) => {
    const result = await deletePost(id);
    if (result.success) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const deleteAssessment = (index: number) => {
    const updatedAssessments = assessments.filter((_, i) => i !== index);
    setAssessments(updatedAssessments);
    localStorage.setItem('assessments', JSON.stringify(updatedAssessments));
  };

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <h2>Access Denied</h2>
        <p>You need to be logged in to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Admin Panel</h2>
          
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="fas fa-users me-1"></i>
                Users
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                <i className="fas fa-file-alt me-1"></i>
                Posts
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'assessments' ? 'active' : ''}`}
                onClick={() => setActiveTab('assessments')}
              >
                <i className="fas fa-clipboard-list me-1"></i>
                Assessments
              </button>
            </li>
          </ul>

          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && !loading && (
            <div className="card">
              <div className="card-header">
                <h5>User Management</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && !loading && (
            <div>
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Create New Post</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Post Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary" onClick={handleCreatePost}>
                        <i className="fas fa-plus me-1"></i>
                        Create Post
                      </button>
                    </div>
                    <div className="col-12">
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Post Content"
                        value={newPost.body}
                        onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5>Posts Management</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Content</th>
                          <th>User ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map(post => (
                          <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{post.body.substring(0, 50)}...</td>
                            <td>{post.userId}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && !loading && (
            <div className="card">
              <div className="card-header">
                <h5>Assessment Results</h5>
              </div>
              <div className="card-body">
                {assessments.length === 0 ? (
                  <p className="text-muted">No assessment results found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Score</th>
                          <th>Percentage</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessments.map((assessment, index) => (
                          <tr key={index}>
                            <td>{assessment.userName}</td>
                            <td>{assessment.score}/{assessment.totalQuestions}</td>
                            <td>
                              <span className={`badge ${assessment.percentage >= 70 ? 'bg-success' : assessment.percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                {assessment.percentage}%
                              </span>
                            </td>
                            <td>{new Date(assessment.date).toLocaleDateString()}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteAssessment(index)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;